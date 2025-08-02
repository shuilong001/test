export enum GameType {
  Slot = 1,
  Fishing = 2,
  Live = 3,
  Sports = 4,
  Porker = 5,
  Lottery = 6,
}

// 多语言名称接口
export interface MultiLanguageName {
  /** 中文名称 */
  'zh-CN': string
  /** 越南语名称 */
  'vi-VN': string
  /** 英文名称 */
  'en-US': string
}

// 游戏分类（kind）数据接口
export interface GameKind {
  /** 分类ID */
  id: number
  /** 场馆ID */
  venueId: number
  /** 分类类型ID */
  kindId: number
  /** 多语言名称 */
  name: MultiLanguageName
  /** H5端图标路径 */
  icon_h5: string
  /** PC端图标路径 */
  icon_pc: string
  /** 分类ID（备用） */
  kind_id: number
  /** H5端图标前置路径 */
  icon_h5_before: string
  /** 高亮图标路径（可选） */
  icon_light: string | null
  /** 三方游戏平台 */
  three_platform?: GamePlatform[]
  /** 游戏列表分块（首页展示用） */
  newList?: (Game | GamePlatform)[][]
  three_game?: Game[]
}

// 游戏平台数据接口
export interface GamePlatform {
  /** 平台ID */
  id: number
  /** 多语言名称 */
  name: MultiLanguageName
  /** H5端Logo路径 */
  logo_h5: string
  /** H5端图片路径 */
  picture_h5: string
  /** PC端图片路径 */
  picture_pc: string
  /** 是否有下级游戏 (1-有, 0-无) */
  has_next: number
  /** 方向设置（可选） */
  direction: number | null
  /** 是否热门 (1-是, 0-否) */
  is_hot: number
  /** 场馆ID（备用） */
  venue_id: number
  /** H5端第二背景图路径 */
  picture_h5_second_background: string
  /** 分类列表背景图路径 */
  picture_category_list_background: string
  /** 权重值 */
  weight: number
  /** 电子游戏图标路径 */
  electronics: string
  /** 视频游戏图标路径 */
  video: string
  /** 捕鱼游戏图标路径 */
  fishing: string
  /** 体育游戏图标路径 */
  sports: string
  /** 棋牌游戏图标路径 */
  chess: string
  /** 彩票游戏图标路径 */
  lottery: string
  /** 电子游戏权重 */
  electronics_weight: number
  /** 视频游戏权重 */
  video_weight: number
  /** 捕鱼游戏权重 */
  fishing_weight: number
  /** 体育游戏权重 */
  sports_weight: number
  /** 棋牌游戏权重 */
  chess_weight: number
  /** 彩票游戏权重 */
  lottery_weight: number
  /** 场馆ID */
  venueId: number
  /** 是否维护中 (1-是, 0-否) */
  ismMintain: number
  /** 高亮图片路径 */
  picture_light: string
  /** 代理商ID */
  agentId: number
  /** 游戏ID */
  gameId: number
  /** 三方游戏分类（平台下的游戏分组） */
  three_game_kind?: GameKind[]
}

// 游戏数据接口
export interface Game {
  /** 游戏ID */
  id: number
  /** 多语言名称 */
  name: MultiLanguageName
  /** H5端图片路径 */
  picture_h5: string
  /** PC端图片路径 */
  picture_pc: string
  /** 是否热门 (1-是, 0-否) */
  is_hot: number
  /** 热门权重 */
  hot_weight: number
  /** 是否推荐 (1-是, 0-否) */
  is_tuijian: number
  /** 推荐权重 */
  tuijian_weight: number
  /** 是否新游戏 (1-是, 0-否) */
  is_new: number
  /** 新游戏权重 */
  new_weight: number
  /** 是否维护中 (1-是, 0-否) */
  is_maintain: number
  /** 方向设置 */
  direction: number
  /** 是否俱乐部游戏 (1-是, 0-否) */
  is_club: number
  /** 场馆ID */
  venueId: number
  /** 代理商ID */
  agentId: number
  /** 分类ID */
  kindId: number
  /** 游戏ID字符串 */
  gameId: string
  /** 权重值（可选） */
  weight?: number
}

// 带游戏列表的游戏分类接口
export interface GameKindWithGames extends GameKind {
  /** 该分类下的游戏列表 */
  three_game: Game[]
}

// 游戏数据接口url
export interface GameDataUrls {
  kind: string
  platform: string
  game: string
}

// 游戏数据接口返回数据
export interface RawGameData {
  /** 游戏分类数据 */
  kind: GameKind[]
  /** 游戏平台数据 */
  platform: GamePlatform[]
  /** 游戏数据 */
  game: Game[]
}

// 游戏缓存数据接口
export interface GameCacheData {
  /** 游戏分类数据 */
  kind: GameKind[]
  /** 游戏平台数据 */
  platform: GamePlatform[]
  /** 游戏数据 */
  game: Game[]
  /** 首页游戏数据 */
  homeGameData: GameKind[]
  /** 缓存时间戳 */
  timestamp: number
}

// 游戏查询参数接口
export interface GameQueryParams {
  /** 分类ID - 电子、视讯等类型 */
  kindId?: number
  /** 厂商ID - 有下级游戏的平台 */
  agentId?: number
  /** 场馆ID - 没有下级游戏的平台 */
  venueId?: number
  /** 游戏ID - 具体游戏的ID */
  gameId?: string
}

// 游戏查询结果接口
export interface GameQueryResult {
  /** 分类信息 */
  kind?: GameKind
  /** 厂商信息 */
  agent?: GamePlatform
  /** 场馆信息 */
  venue?: GamePlatform
  /** 游戏信息 */
  game?: Game
}

// 游戏搜索结果接口
export interface GameSearchResult {
  /** 结果类型 */
  type: 'game' | 'platform'
  /** 匹配的数据 */
  data: Game | GamePlatform
  /** 匹配的字段 */
  matchField: 'name' | 'gameId'
}

// 游戏统计信息接口
export interface GameStats {
  /** 游戏总数 */
  totalGames: number
  /** 平台总数 */
  totalPlatforms: number
  /** 分类总数 */
  totalCategories: number
  /** 缓存是否有效 */
  cacheValid: boolean
}

// 分类游戏查询结果接口
export interface CategoryGamesResult {
  /** 分类信息 */
  kind: GameKind | null
  /** 平台列表 */
  platforms: GamePlatform[]
  /** 游戏列表 */
  games: Game[]
}
