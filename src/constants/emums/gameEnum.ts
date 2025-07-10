export enum GameType {
  Slot = 1,
  Fishing = 2,
  Live = 3,
  Sports = 4,
  Porker = 5,
  Lottery = 6,
}

export enum AgentType {
  Evo = 10,
}

export enum GameSortType {
  HOT = 'hot',
  TUIJIAN = 'tuijian',
  NEW = 'new',
}

export const ZiYanGame: number = 9999
export const ThirdGameLangMap: any = {
  'en-US': 3,
  'vi-VN': 2,
  'zh-CN': 1,
}
// sub_game_type
export const LotteryTypeList = [
  {
    value: '',
    label: 'all',
  },
  {
    value: '10',
    label: 'game_lottery_southen',
  },
  {
    value: '11',
    label: 'game_lottery_central',
  },
  {
    value: '12',
    label: 'game_lottery_northern',
  },
  {
    value: '13',
    label: 'game_lottery_high',
  },
  {
    value: '14',
    label: 'game_lottery_low',
  },
  {
    value: '15',
    label: 'game_lottery_other',
  },
]
