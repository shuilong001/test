import { defineStore } from 'pinia'
import { GameType } from '@/constants/emums/gameEnum'
import { isValid, splitArrayIntoChunks } from '@/utils/helper'

interface GameStoreState {
  gameCache: GameCacheData | null
  isLoading: boolean
  cacheExpiration: number
  gameDatas: RawGameData
  homeGameData: GameKind[]
  gameUrl: string
}

export const useGameStore = defineStore('game-store', {
  state: (): GameStoreState => ({
    // 三方游戏数据缓存
    gameCache: null as GameCacheData | null,
    isLoading: false,
    // 缓存有效期 (8小时)
    cacheExpiration: 8 * 60 * 60 * 1000,
    gameDatas: {
      kind: [],
      platform: [],
      game: [],
    },
    homeGameData: [],
    gameUrl: '',
  }),
  actions: {
    // 设置游戏数据缓存
    setGameCache(data: Omit<GameCacheData, 'timestamp'>) {
      this.gameCache = {
        ...data,
        timestamp: Date.now(),
      }
    },

    // 检查缓存是否有效
    isCacheValid(): boolean {
      if (!this.gameCache)
        return false
      const now = Date.now()
      return (now - this.gameCache.timestamp) < this.cacheExpiration
    },

    // 清除缓存
    clearCache() {
      this.gameCache = null
    },

    // 设置加载状态
    setLoading(loading: boolean) {
      this.isLoading = loading
    },
    async setGameData(value: RawGameData) {
      this.gameDatas = value
    },

    /**
     * 处理单个游戏项目的 ID 映射
     */
    _normalizeGameIds(item: GamePlatform | Game): void {
      if (!item.gameId && !item.agentId) {
        item.agentId = item.id
        item.gameId = (item as GamePlatform).venue_id
      }
    },

    /**
     * 收集热门游戏
     */
    _collectHotGames(platforms: GamePlatform[]): (GamePlatform | Game)[] {
      const hotGames: (GamePlatform | Game)[] = []

      platforms.forEach((plat: GamePlatform) => {
        this._normalizeGameIds(plat)

        // 检查是否为直接的热门平台
        if ([GameType.Live, GameType.Sports, GameType.Lottery].includes(plat.venue_id)) {
          if (plat.is_hot === 1) {
            hotGames.push(plat)
          }
        }
        else if (plat.three_game_kind) {
          // 检查平台下的游戏
          plat.three_game_kind.forEach((room: GameKindWithGames) => {
            room.three_game?.forEach((game: Game) => {
              if (game.is_hot === 1) {
                hotGames.push(game)
              }
            })
          })
        }
        else {
          this._normalizeGameIds(plat)
        }
      })

      return hotGames
    },

    /**
     * 创建游戏列表分块
     */
    _createGameChunks(gameData: GameKind): void {
      if (gameData.id === 0) {
        // 热门游戏一组8个
        const platforms = gameData.three_platform?.slice(0, 80) || []
        gameData.newList = splitArrayIntoChunks(platforms, 8)
      }
      else {
        // 收集热门游戏
        const hotGames = this._collectHotGames(gameData.three_platform || [])

        // 根据游戏类型设置分块大小
        const chunkSize = gameData.id === GameType.Live ? 3 : 6
        const maxCount = gameData.id === GameType.Live ? 30 : 60

        gameData.newList = splitArrayIntoChunks(hotGames.slice(0, maxCount), chunkSize)
      }
    },

    async setHomePageGameData(data: GameKind[]) {
      // 处理每个游戏数据项
      data.forEach((gameData: GameKind) => {
        this._createGameChunks(gameData)
      })

      // 更新或添加到 homeGameData
      data.forEach((newData: GameKind) => {
        const existingIndex = this.homeGameData.findIndex((existing: GameKind) => existing.id === newData.id)

        if (existingIndex === -1) {
          this.homeGameData.push(newData)
        }
        else {
          this.homeGameData[existingIndex] = newData
        }
      })

      console.log('[this.homeGameData]', this.homeGameData)
    },

    /**
     * 查询游戏相关数据
     * 支持多种查询方式：
     * 1. 通过 venueId 查找场馆
     * 2. 通过 gameId + agentId/kindId 查找具体游戏
     * 3. 通过 agentId 查找厂商
     *
     * @example
     * // 查找具体游戏
     * const result = gameStore.getGame({ gameId: '123', agentId: 456 })
     * // 查找场馆
     * const result = gameStore.getGame({ venueId: 789 })
     * // 查找厂商
     * const result = gameStore.getGame({ agentId: 456, kindId: 2 })
     */
    getGame(params: GameQueryParams): GameQueryResult {
      const result: GameQueryResult = {}

      // 1. 优先处理场馆查询（venueId）
      if (isValid(params.venueId)) {
        // 查找场馆
        result.venue = this.gameDatas.platform.find((platform: GamePlatform) =>
          platform.venueId === params.venueId,
        )

        // 如果提供了分类ID，查找对应分类
        if (isValid(params.kindId)) {
          result.kind = this.homeGameData.find((kind: GameKind) =>
            kind.kindId === params.kindId,
          )
        }

        // 如果提供了游戏ID，查找对应游戏
        if (isValid(params.gameId)) {
          result.game = this.gameDatas.game.find((game: Game) =>
            game.venueId === params.venueId && game.gameId === params.gameId,
          )
        }

        return result
      }

      // 2. 处理游戏查询（gameId）
      if (isValid(params.gameId)) {
        // 查找所有匹配的游戏
        const matchingGames = this.gameDatas.game.filter((game: Game) =>
          game.gameId === params.gameId,
        )

        // 根据提供的参数精确匹配游戏
        if (isValid(params.agentId)) {
          result.game = matchingGames.find((game: Game) => game.agentId === params.agentId)
        }
        else if (isValid(params.kindId)) {
          result.game = matchingGames.find((game: Game) => game.kindId === params.kindId)
        }
        else {
          result.game = matchingGames[0] // 返回第一个匹配项
        }

        // 如果找到游戏，反查分类和厂商
        if (result.game) {
          result.kind = this.homeGameData.find((kind: GameKind) =>
            kind.kindId === result.game!.kindId,
          )

          if (result.kind?.three_platform) {
            result.agent = result.kind.three_platform.find((agent: GamePlatform) =>
              agent.agentId === result.game!.agentId,
            )
          }
        }

        return result
      }

      // 3. 处理厂商查询（agentId）
      if (isValid(params.agentId)) {
        // 直接从平台数据查找厂商
        result.agent = this.gameDatas.platform.find((agent: GamePlatform) =>
          agent.agentId === params.agentId,
        )

        // 如果提供了分类ID，从分类中查找厂商
        if (isValid(params.kindId)) {
          result.kind = this.homeGameData.find((kind: GameKind) =>
            kind.kindId === params.kindId,
          )

          if (result.kind?.three_platform) {
            const agentInKind = result.kind.three_platform.find((agent: GamePlatform) =>
              agent.agentId === params.agentId,
            )
            if (agentInKind) {
              result.agent = agentInKind
            }
          }
        }

        return result
      }

      return result
    },

    /**
     * 批量查询游戏
     * @param gameList 游戏ID列表
     * @returns 查询结果数组
     */
    getGamesBatch(gameList: GameQueryParams[]): GameQueryResult[] {
      return gameList.map(params => this.getGame(params))
    },

    /**
     * 根据分类获取所有游戏
     * @param kindId 分类ID
     * @returns 该分类下的所有游戏和平台
     */
    getGamesByCategory(kindId: number): CategoryGamesResult {
      const kind = this.homeGameData.find((k: GameKind) => k.kindId === kindId)

      if (!kind) {
        return { kind: null, platforms: [], games: [] }
      }

      const platforms = kind.three_platform || []
      const games: Game[] = []

      // 收集该分类下的所有游戏
      platforms.forEach((platform: GamePlatform) => {
        if (platform.three_game_kind) {
          platform.three_game_kind.forEach((gameKind: GameKindWithGames) => {
            if (gameKind.three_game) {
              games.push(...gameKind.three_game)
            }
          })
        }
      })

      return { kind, platforms, games }
    },

    /**
     * 搜索游戏（模糊匹配）
     * @param keyword 搜索关键词
     * @returns 匹配的游戏列表
     */
    searchGames(keyword: string): GameSearchResult[] {
      if (!keyword.trim())
        return []

      const results: GameSearchResult[] = []
      const lowerKeyword = keyword.toLowerCase()

      // 在游戏数据中搜索
      this.gameDatas.game.forEach((game: Game) => {
        const gameName = Object.values(game.name).join(' ').toLowerCase()
        const gameId = String(game.gameId || '').toLowerCase()

        if (gameName.includes(lowerKeyword) || gameId.includes(lowerKeyword)) {
          results.push({
            type: 'game',
            data: game,
            matchField: gameName.includes(lowerKeyword) ? 'name' : 'gameId',
          })
        }
      })

      // 在平台数据中搜索
      this.gameDatas.platform.forEach((platform: GamePlatform) => {
        const platformName = Object.values(platform.name).join(' ').toLowerCase()

        if (platformName.includes(lowerKeyword)) {
          results.push({
            type: 'platform',
            data: platform,
            matchField: 'name',
          })
        }
      })

      return results
    },
    setGameUrl(url: string) {
      this.gameUrl = url
    },
  },

  getters: {
    // 获取缓存的游戏数据
    getCachedGameData: (state) => {
      return state.gameCache
        ? {
            kind: state.gameCache.kind,
            platform: state.gameCache.platform,
            game: state.gameCache.game,
          }
        : null
    },

    // 获取缓存的首页游戏数据
    getCachedHomeGameData: (state) => {
      return state.gameCache?.homeGameData || []
    },

    // 获取游戏统计信息
    gameStats: (state): GameStats => {
      return {
        totalGames: state.gameDatas.game.length,
        totalPlatforms: state.gameDatas.platform.length,
        totalCategories: state.homeGameData.length,
        cacheValid: state.gameCache ? (Date.now() - state.gameCache.timestamp) < state.cacheExpiration : false,
      }
    },

    // 获取热门游戏分类
    hotGamesCategory: (state): GameKind | undefined => {
      return state.homeGameData.find((category: GameKind) => category.id === 0)
    },

    // 获取指定分类的游戏数量
    getGameCountByCategory: (state) => {
      return (kindId: number): number => {
        const category = state.homeGameData.find((cat: GameKind) => cat.kindId === kindId)
        if (!category)
          return 0

        let count = 0
        category.three_platform?.forEach((platform: GamePlatform) => {
          if (platform.three_game_kind) {
            platform.three_game_kind.forEach((gameKind: GameKindWithGames) => {
              count += gameKind.three_game?.length || 0
            })
          }
        })
        return count
      }
    },
    // 第三方所有游戏
    getAllThreeGames: (state) => {
      return state.homeGameData
        .filter(plat => plat.id > 0 && plat.three_platform)
        .flatMap(plat =>
          plat.three_platform.flatMap((e) => {
            if (e.three_game_kind) {
              // 先把 e（但 three_game_kind 置空）加入
              const result = [{ ...e, three_game_kind: [] }]
              // 再把所有 kind 下的 game 扁平加入
              e.three_game_kind.forEach((kind) => {
                if (kind.three_game) {
                  result.push(...kind.three_game as any[])
                }
              })
              return result
            }
            else {
              return [e]
            }
          }),
        )
    },

  },

  persist: {
    storage: localStorage,
    key: 'game-store',
    pick: ['gameCache'],
  },
})
