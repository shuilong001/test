import pako from 'pako'
import { computed } from 'vue'
import { usePageStore } from '@/stores/modules/page'
import { useGameStore } from '@/stores/modules/game'
import { db } from '@/web-base/utils/storage'

/**
 * 获取三方游戏数据的 Hook
 */
export function useAppData() {
  const pageStore = usePageStore()
  const gameStore = useGameStore()

  /**
   * 获取配置的URL地址
   */
  const getGameDataUrls = (): GameDataUrls | null => {
    const settings = pageStore.settings
    if (!settings) {
      console.warn('Settings 尚未加载，无法获取游戏数据')
      return null
    }

    return {
      kind: settings.third_game_kind,
      platform: settings.third_platform,
      game: settings.third_game,
    }
  }

  /**
   * 检查是否需要加载数据
   */
  const _shouldLoadData = (): boolean => {
    // 检查是否正在加载
    if (gameStore.isLoading) {
      return false
    }

    // 检查缓存是否有效
    if (gameStore.isCacheValid()) {
      // 从缓存恢复数据到 pageStore
      const cachedGameData = gameStore.getCachedGameData
      const cachedHomeGameData = gameStore.getCachedHomeGameData

      if (cachedGameData && cachedHomeGameData.length > 0) {
        gameStore.setGameData(cachedGameData)
        gameStore.setHomePageGameData(cachedHomeGameData)
        return false
      }
    }

    return true
  }

  /**
   * 获取并解压数据
   */
  const fetchAndDecompressData = async (url: string, name: string): Promise<any[]> => {
    try {
      const response = await fetch(`${url}?${Date.now()}`)

      if (!response.ok) {
        throw new Error(`获取${name}数据失败: ${response.statusText}`)
      }

      const buffer = await response.arrayBuffer()
      const uint8Array = new Uint8Array(buffer)
      const decompressedString = pako.ungzip(uint8Array, { to: 'string' })
      const data = JSON.parse(decompressedString)

      return data
    }
    catch (error) {
      console.error(`获取${name}数据失败:`, error)
      throw error
    }
  }

  /**
   * 并行获取所有游戏数据
   */
  const fetchAllGameData = async (urls: GameDataUrls): Promise<RawGameData> => {
    try {
      const [kindData, platformData, gameData] = await Promise.all([
        fetchAndDecompressData(urls.kind, '分类'),
        fetchAndDecompressData(urls.platform, '平台'),
        fetchAndDecompressData(urls.game, '游戏'),
      ])

      return {
        kind: kindData,
        platform: platformData,
        game: gameData,
      }
    }
    catch (error) {
      console.error('获取游戏数据失败:', error)
      throw error
    }
  }

  /**
   * 处理游戏数据排序
   */
  const sortGamesByWeight = (games: Game[]): void => {
    games.sort((a: Game, b: Game) => {
      // 如果 a 和 b 都有 weight，按 weight 降序排列
      if (a.weight !== undefined && b.weight !== undefined) {
        return b.weight - a.weight
      }
      // 如果只有 a 有 weight，a 排在前面
      if (a.weight !== undefined) {
        return -1
      }
      // 如果只有 b 有 weight，b 排在前面
      if (b.weight !== undefined) {
        return 1
      }
      // 如果都没有 weight，按 id 升序排列
      return a.id - b.id
    })
  }

  /**
   * 处理平台数据排序
   */
  const sortPlatformsByWeight = (platforms: GamePlatform[]): void => {
    platforms.sort((a: GamePlatform, b: GamePlatform) => {
      // 如果 a 和 b 都有 weight，按 weight 降序排列
      if (a.weight !== undefined && b.weight !== undefined) {
        return b.weight - a.weight
      }
      // 如果只有 a 有 weight，a 排在前面
      if (a.weight !== undefined) {
        return -1
      }
      // 如果只有 b 有 weight，b 排在前面
      if (b.weight !== undefined) {
        return 1
      }
      // 如果都没有 weight，按 id 升序排列
      return a.id - b.id
    })
  }

  /**
   * 构建平台游戏映射
   */
  const buildPlatformGameMap = (kindData: GameKind[], gameData: Game[]): Record<string, GameKindWithGames> => {
    const platListData: Record<string, GameKindWithGames> = {}

    gameData.forEach((game: Game) => {
      const key = `${game.agentId}_${game.kindId}`

      if (platListData[key]) {
        platListData[key].three_game.push(game)
      }
      else {
        const kindInfo = kindData.find((kind: GameKind) => kind.kindId === game.kindId)
        if (kindInfo) {
          const kind = JSON.parse(JSON.stringify(kindInfo)) as GameKindWithGames
          kind.three_game = [game]
          platListData[key] = kind
        }
      }
    })

    // 排序每个平台下的游戏
    Object.values(platListData).forEach((kind: GameKindWithGames) => {
      if (kind.three_game) {
        sortGamesByWeight(kind.three_game)
      }
    })

    return platListData
  }

  /**
   * 处理平台数据并关联游戏
   */
  const processPlatformData = (
    homeGameData: GameKind[],
    platformData: GamePlatform[],
    platListData: Record<string, GameKindWithGames>,
  ): void => {
    platformData.forEach((platform: GamePlatform) => {
      // 如果没有下级游戏，直接关联到分类
      if (platform.has_next === 0) {
        const targetKind = homeGameData.find((kind: GameKind) => kind.kindId === platform.venueId)
        if (targetKind) {
          if (!targetKind.three_platform) {
            targetKind.three_platform = []
          }
          targetKind.three_platform.push(platform)
        }
      }
      // 如果有下级游戏，处理游戏关联
      else {
        homeGameData.forEach((kind: GameKind) => {
          const platformCopy = JSON.parse(JSON.stringify(platform)) as GamePlatform
          const key = `${platform.agentId}_${kind.kindId}`

          if (platListData[key]) {
            platformCopy.three_game_kind = [platListData[key]]
            const targetKind = homeGameData.find((k: GameKind) =>
              k.kindId === platListData[key].three_game[0]?.kindId,
            )

            if (targetKind) {
              if (!targetKind.three_platform) {
                targetKind.three_platform = []
              }
              targetKind.three_platform.push(platformCopy)
            }
          }
        })
      }
    })
  }

  /**
   * 创建热门游戏分类
   */
  const createHotGamesCategory = (platformData: GamePlatform[], gameData: Game[]): GameKind => {
    const hotGames: (GamePlatform | Game)[] = []

    // 收集热门平台
    platformData.forEach((platform: GamePlatform) => {
      if (platform.is_hot === 1) {
        hotGames.push(platform)
      }
    })

    // 收集热门游戏
    gameData.forEach((game: Game) => {
      if (game.is_hot === 1) {
        hotGames.push(game)
      }
    })

    return {
      id: 0,
      venueId: 0,
      kindId: 999,
      kind_id: 999,
      name: {
        'zh-CN': '热门',
        'vi-VN': 'Phổ biến',
        'en-US': 'Popular',
      },
      icon_h5: '',
      icon_pc: '',
      icon_h5_before: '',
      icon_light: null,
      three_platform: hotGames as GamePlatform[],
    }
  }

  /**
   * 混合处理游戏数据
   */
  const mixGameData = async (rawData: RawGameData): Promise<void> => {
    try {
      // 深拷贝原始数据，避免修改原数据
      const homeGameData: GameKind[] = JSON.parse(JSON.stringify(rawData.kind))
      const platformData: GamePlatform[] = JSON.parse(JSON.stringify(rawData.platform))
      const gameData: Game[] = JSON.parse(JSON.stringify(rawData.game))

      // 构建平台游戏映射关系
      const platListData = buildPlatformGameMap(homeGameData, gameData)

      // 处理平台数据并关联游戏
      processPlatformData(homeGameData, platformData, platListData)

      // 排序每个分类下的平台
      homeGameData.forEach((kind: GameKind) => {
        if (kind.three_platform) {
          sortPlatformsByWeight(kind.three_platform)
        }
        else {
          kind.three_platform = []
        }
      })

      // 创建热门游戏分类并添加到首位
      const hotGamesCategory = createHotGamesCategory(platformData, gameData)
      const finalHomeGameData = [hotGamesCategory, ...homeGameData]

      // 更新 stores
      await gameStore.setGameData(rawData)
      await gameStore.setHomePageGameData(finalHomeGameData)

      // 缓存数据到 gameStore
      gameStore.setGameCache({
        kind: rawData.kind,
        platform: rawData.platform,
        game: rawData.game,
        homeGameData: finalHomeGameData,
      })

      // 延迟保存到 IndexedDB，避免阻塞
      setTimeout(async () => {
        try {
          await db.set('global_homeGameData', finalHomeGameData)
          await db.set('global_GameData', rawData)
          console.log('游戏数据已保存到 IndexedDB')
        }
        catch (error) {
          console.warn('保存到 IndexedDB 失败:', error)
        }
      }, 1000)
    }
    catch (error) {
      console.error('处理游戏数据失败:', error)
      throw error
    }
  }

  /**
   * 主函数：获取三方游戏数据
   */
  const loadGameData = async (): Promise<void> => {
    try {
      // 检查是否需要加载数据
      if (!_shouldLoadData()) {
        return
      }

      // 获取配置的 URL
      const urls = getGameDataUrls()
      if (!urls) {
        console.warn('无法获取游戏数据 URL 配置')
        return
      }

      // 设置加载状态
      gameStore.setLoading(true)
      pageStore.setGameIsLoading(true)

      // 获取原始数据
      const rawData = await fetchAllGameData(urls)

      // 处理数据
      await mixGameData(rawData)

      console.log('三方游戏数据加载完成')
    }
    catch (error) {
      console.error('加载三方游戏数据失败:', error)
      // 可以在这里添加错误提示给用户
    }
    finally {
      // 清除加载状态
      gameStore.setLoading(false)
      pageStore.setGameIsLoading(false)
    }
  }

  /**
   * 清除缓存
   */
  const clearGameDataCache = (): void => {
    gameStore.clearCache()
    try {
      db.del('global_homeGameData')
      db.del('global_GameData')
      console.log('游戏数据缓存已清除')
    }
    catch (error) {
      console.warn('清除 IndexedDB 缓存失败:', error)
    }
  }

  return {
    loadGameData,
    clearGameDataCache,
    isLoading: computed(() => gameStore.isLoading),
    isCacheValid: computed(() => gameStore.isCacheValid()),
  }
}
