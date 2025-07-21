import { defineStore } from 'pinia'
import { GameType } from '@/constants/emums/gameEnum'
import { isValid, splitArrayIntoChunks } from '@/utils/helper'

interface GameCacheData {
  kind: any[]
  platform: any[]
  game: any[]
  homeGameData: any[]
  timestamp: number
}

interface RawGameData {
  kind: any[]
  platform: any[]
  game: any[]
}

interface GameQueryParams {
  kindId?: any // 分类ID  电子、视讯 之类（kindId）
  agentId?: any // 厂商ID 有下级游戏的叫厂商 （agentId）
  venueId?: any // 场馆ID 没有下级游戏的叫场馆 （venueId）
  gameId?: any // 游戏ID 游戏的ID  （gameId）
}

interface GameQueryResult {
  kind?: any
  agent?: any
  venue?: any
  game?: any
}

export const useGameStore = defineStore('game', {
  state: (): {
    myGames: any[]
    gameCache: GameCacheData | null
    isLoading: boolean
    cacheExpiration: number
    gameDatas: RawGameData
    homeGameData: any[]
  } => ({
    myGames: [],
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
  }),
  actions: {
    setMyGames(games: any[]) {
      this.myGames = games
    },

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
    _normalizeGameIds(item: any): void {
      if (!item.gameId && !item.agentId) {
        item.agentId = item.id
        item.gameId = item.venue_id
      }
    },

    /**
     * 收集热门游戏
     */
    _collectHotGames(platforms: any[]): any[] {
      const hotGames: any[] = []

      platforms.forEach((plat: any) => {
        this._normalizeGameIds(plat)

        // 检查是否为直接的热门平台
        if ([GameType.Live, GameType.Sports, GameType.Lottery].includes(plat.venue_id)) {
          if (plat.is_hot === 1) {
            hotGames.push(plat)
          }
        }
        else if (plat.three_game_kind) {
          // 检查平台下的游戏
          plat.three_game_kind.forEach((room: any) => {
            room.three_game?.forEach((game: any) => {
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
    _createGameChunks(gameData: any): void {
      if (gameData.id === 0) {
        // 热门游戏一组8个
        gameData.newList = splitArrayIntoChunks(gameData.three_platform.slice(0, 80), 8)
      }
      else {
        // 收集热门游戏
        const hotGames = this._collectHotGames(gameData.three_platform)

        // 根据游戏类型设置分块大小
        const chunkSize = gameData.id === GameType.Live ? 3 : 6
        const maxCount = gameData.id === GameType.Live ? 30 : 60

        gameData.newList = splitArrayIntoChunks(hotGames.slice(0, maxCount), chunkSize)
      }
    },

    async setHomePageGameData(data: any[]) {
      // 处理每个游戏数据项
      data.forEach((gameData: any) => {
        this._createGameChunks(gameData)
      })

      // 更新或添加到 homeGameData
      data.forEach((newData: any) => {
        const existingIndex = this.homeGameData.findIndex((existing: any) => existing.id === newData.id)

        if (existingIndex === -1) {
          this.homeGameData.push(newData)
        }
        else {
          this.homeGameData[existingIndex] = newData
        }
      })

      console.log('[this.homeGameData]', this.homeGameData)
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

    /**
     * 优化的游戏查询方法
     * 支持多种查询方式：
     * 1. 通过 venueId 查找场馆
     * 2. 通过 gameId + agentId/kindId 查找具体游戏
     * 3. 通过 agentId 查找厂商
     */
    getGame: (state) => {
      return (params: GameQueryParams): GameQueryResult => {
        const result: GameQueryResult = {}

        // 1. 优先处理场馆查询（venueId）
        if (isValid(params.venueId)) {
          return this._queryByVenueId(state, params)
        }

        // 2. 处理游戏查询（gameId）
        if (isValid(params.gameId)) {
          return this._queryByGameId(state, params)
        }

        // 3. 处理厂商查询（agentId）
        if (isValid(params.agentId)) {
          return this._queryByAgentId(state, params)
        }

        return result
      }
    },

    /**
     * 通过场馆ID查询
     */
    _queryByVenueId: () => {
      return (state: any, params: GameQueryParams): GameQueryResult => {
        const result: GameQueryResult = {}

        // 查找场馆
        result.venue = state.gameDatas.platform.find((platform: any) =>
          platform.venueId === params.venueId,
        )

        // 如果提供了分类ID，查找对应分类
        if (isValid(params.kindId)) {
          result.kind = state.homeGameData.find((kind: any) =>
            kind.kindId === params.kindId,
          )
        }

        // 如果提供了游戏ID，查找对应游戏
        if (isValid(params.gameId)) {
          result.game = state.gameDatas.game.find((game: any) =>
            game.venueId === params.venueId && game.gameId === params.gameId,
          )
        }

        return result
      }
    },

    /**
     * 通过游戏ID查询
     */
    _queryByGameId: () => {
      return (state: any, params: GameQueryParams): GameQueryResult => {
        const result: GameQueryResult = {}

        // 查找所有匹配的游戏
        const matchingGames = state.gameDatas.game.filter((game: any) =>
          game.gameId === params.gameId,
        )

        // 根据提供的参数精确匹配游戏
        if (isValid(params.agentId)) {
          result.game = matchingGames.find((game: any) => game.agentId === params.agentId)
        }
        else if (isValid(params.kindId)) {
          result.game = matchingGames.find((game: any) => game.kindId === params.kindId)
        }
        else {
          result.game = matchingGames[0] // 返回第一个匹配项
        }

        // 如果找到游戏，反查分类和厂商
        if (result.game) {
          result.kind = state.homeGameData.find((kind: any) =>
            kind.kindId === result.game.kindId,
          )

          if (result.kind?.three_platform) {
            result.agent = result.kind.three_platform.find((agent: any) =>
              agent.agentId === result.game.agentId,
            )
          }
        }

        return result
      }
    },

    /**
     * 通过厂商ID查询
     */
    _queryByAgentId: () => {
      return (state: any, params: GameQueryParams): GameQueryResult => {
        const result: GameQueryResult = {}

        // 直接从平台数据查找厂商
        result.agent = state.gameDatas.platform.find((agent: any) =>
          agent.agentId === params.agentId,
        )

        // 如果提供了分类ID，从分类中查找厂商
        if (isValid(params.kindId)) {
          result.kind = state.homeGameData.find((kind: any) =>
            kind.kindId === params.kindId,
          )

          if (result.kind?.three_platform) {
            const agentInKind = result.kind.three_platform.find((agent: any) =>
              agent.agentId === params.agentId,
            )
            if (agentInKind) {
              result.agent = agentInKind
            }
          }
        }

        return result
      }
    },
  },

  persist: {
    storage: localStorage,
    key: 'game-store',
    pick: ['gameCache'],
  },
})
