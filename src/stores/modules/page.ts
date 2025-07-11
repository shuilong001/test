import { defineStore } from 'pinia'
import { joinURL, splitArrayIntoChunks } from '@/utils/helper'
import { langObjMap } from '@/constants/emums/langEnum'
import { GameType } from '@/constants/emums/gameEnum'
import { dingZhiActivity } from '@/constants/emums/activityEnum'

/**
 * 页面信息
 * @methods setUserInfos 设置用户信息
 */
interface PageState {
  homePath: string // 首页路径
  menuActive: number
  countryOptions: any
  bannerArr: any
  textAnnouncement: any
  serviceUrlObj: any
  settings: any
  pageLoading: boolean
  reConnectWsing: boolean
  gameIsLoading: boolean
  thirdGameIsRequest: boolean
  hotGameIsLoading: boolean
  adminI18n: any
  lang: string
  langLoading: boolean
  unread: number
  gameDatas: any
  homeGameData: any
  activityList: any
  activityTitleList: any
  showLeft: boolean
  showRight: boolean
  hotBoxGames: any
  defaultActivityList: any
  rechargeWaitShow: boolean
  rechargeSuccessShow: boolean
}

export const usePageStore = defineStore('page-store', {
  state: (): PageState => ({
    homePath: '/home',
    settings: null,

    // 下面是暂时项目没用到的数据，后续看情况删除
    menuActive: -1,
    countryOptions: null,
    bannerArr: [],
    textAnnouncement: [],
    serviceUrlObj: {},

    gameDatas: {
      game: [],
      kind: [],
      platform: [],
    },
    homeGameData: [],
    pageLoading: true,
    gameIsLoading: false,
    hotGameIsLoading: false,
    thirdGameIsRequest: false,
    adminI18n: null,
    lang: '',
    langLoading: true,
    unread: 0,
    defaultActivityList: null,
    activityList: sessionStorage.getItem('activityList') ? JSON.parse(sessionStorage.getItem('activityList') || '[]') : null,
    activityTitleList: null,
    showLeft: false,
    showRight: false,
    hotBoxGames: [], // HomeGameHotBox 的游戏数据
    rechargeWaitShow: false, // 充值等待提示框
    rechargeSuccessShow: false, // 充值成功提示框
    reConnectWsing: false, // 是否是ws是否正在重连中
  }),
  actions: {
    setShowRight(val: boolean) {
      this.showRight = val
    },
    setRechargeWaitShow(val: boolean) {
      this.rechargeWaitShow = val
    },
    setRechargeSuccessShow(val: boolean) {
      this.rechargeSuccessShow = val
    },
    // 获取未读消息数量
    async getUnread(isFirst = false) {
      if (isFirst) {
        this.unread = 0
      }
      const chat_info: any = this.$state.settings?.chat_res?.chat_info
      let device_id
      if (localStorage.getItem('deviceid')) {
        device_id = localStorage.getItem('deviceid') || ''
      }
      //  device_id = localStorage.getItem('deviceid')
      if (chat_info && device_id) {
        const url = joinURL(chat_info, `/api/message/unread?device_id=${device_id}`)
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Network response was not ok ${response.statusText}`)
            }
            return response.json() // 将响应解析为 JSON
          })
          .then((res) => {
            console.log('消息', res?.data)
            this.unread = res?.data?.count || 0
          })
      }
    },
    async setGameData(value: any) {
      this.gameDatas = value
    },
    async setHomePageGameData(data: any) {
      data.forEach((e: any) => {
        if (e.id === 0) { // 热门一组8个
          e.newList = splitArrayIntoChunks(e.three_platform.slice(0, 80), 8)
        }
        else { // 其他一组6个
          const hosList: any = []
          e.three_platform.forEach((plat: any) => {
            if (!plat.gameId && !plat.agentId) {
              plat.agentId = plat.id
              plat.gameId = plat.venue_id
            }

            // if ([GameType.Live, GameType.Sports, GameType.Lottery].includes(e.id)) {
            //     plat.agentId = plat.id
            //     plat.gameId = plat.venue_id
            // }
            if ([GameType.Live, GameType.Sports, GameType.Lottery].includes(plat.venue_id)) {
              // plat.agentId = plat.id
              // plat.gameId = plat.venue_id
              if (plat.is_hot === 1) {
                hosList.push(plat)
              }
            }
            else {
              if (plat.three_game_kind) {
                plat.three_game_kind.forEach((room: any) => {
                  if (room.three_game) {
                    room.three_game.forEach((game: any) => {
                      if (game.is_hot === 1) {
                        hosList.push(game)
                      }
                    })
                  }
                })
              }
              else {
                if (!plat.gameId && !plat.agentId) {
                  plat.agentId = plat.id
                  plat.gameId = plat.venue_id
                }
              }
            }
          })
          e.newList = e.id === GameType.Live ? splitArrayIntoChunks(hosList.slice(0, 30), 3) : splitArrayIntoChunks(hosList.slice(0, 60), 6)
        }
      })
      data.forEach((e: any) => {
        let target: any = this.homeGameData.find((b: any) => b.id === e.id)
        if (!target) {
          this.homeGameData.push(e)
        }
        else {
          target = e
        }
      })
      // this.homeGameData = JSON.parse(JSON.stringify(this.homeGameData))
      sessionStorage.setItem('global_homeGameData', JSON.stringify(this.homeGameData))
      console.log('[this.homeGameData]', this.homeGameData)
    },
    async setSettings(value: any) {
      this.settings = value
    },
    async setAdminI18n(value: any) {
      this.adminI18n = value
    },
    async setPageLoading(value: any) {
      this.pageLoading = value
    },
    async setReConnectWs(value: any) {
      this.reConnectWsing = value
    },
    async setHotGameIsLoading(value: any) {
      this.hotGameIsLoading = value
    },
    async setThirdGameIsRequest(value: any) {
      this.thirdGameIsRequest = value
    },
    async setGameIsLoading(value: any) {
      this.gameIsLoading = value
    },
    async setLangLoading(value: any) {
      this.langLoading = value
    },
    async setLang(value: any) {
      this.lang = value

      if (!this.adminI18n)
        return
      this.serviceUrlObj = null
      this.bannerArr = null
      const strs = value.split('-')
      let str = strs[0]
      if (strs[0] === 'vi') {
        str = 'vn'
      }
      const keys = Object.keys(this.adminI18n[str])
      const bannerArr: Array<string> = []
      const serviceUrlObj: any = {}
      keys.forEach((e: string) => {
        if (!e.includes('pc') && e.includes('admin_banner_list')) {
          bannerArr.push(e)
        }
        if (e.includes('service_')) {
          serviceUrlObj[e] = this.adminI18n[str][e]
        }
      })
      this.serviceUrlObj = serviceUrlObj
      this.bannerArr = bannerArr

      this.setActivityTitleList(this.defaultActivityList)
    },
    async resetAnnouncement() {
      this.textAnnouncement = []
    },
    async setTextAnnouncementMore(str: string) {
      this.textAnnouncement.push(str)
      this.textAnnouncement.splice(0, 0)
    },
    async setActivityTitleList(value: any) {
      if (!value)
        return

      this.defaultActivityList = value
      const lang = langObjMap[this.lang] || this.lang

      let newList = value
      newList = newList.map((item: any) => {
        const pic_key = item.pic_link
        const adminLang = this.adminI18n[lang]
        const content_key = pic_key.replace('title', 'content')
        let pic_link = adminLang[pic_key]
        if (dingZhiActivity[item.id]) {
          pic_link = `/imgs/lang/${lang}/activity/${dingZhiActivity[item.id].id}.png`
        }
        return {
          name: dingZhiActivity[item.id]?.name || adminLang[item.name],
          pic_link,
          details: adminLang[item.details] || '',
          content: adminLang[item.content] || '',
          restrict: adminLang[item.restrict] || '',
          pic_content: adminLang[content_key],
          content_key,
          rules: item.rules,
          total: item.total || '',
          id: item.id,
          tag: dingZhiActivity[item.id]?.tag || item.tag,
        }
      })

      if (newList.length > 0) {
        // newList = newList.filter((item: { pic_link: any; }) => item.pic_link && item.pic_link !== null)
        // 过滤不是当前用户所在国家的活动
        newList = newList.filter((item: { pic_link: any, id: string, pic_content: any }) => (item.id === '4' && item.pic_content) || (item.id !== '4' && item.pic_link))
        const obj: any = {
          home_page_all: newList,
        }
        newList.forEach((e: any) => {
          obj[e.tag] = []
          newList.forEach((j: any) => {
            if (j.tag === e.tag) {
              obj[e.tag].push(j)
            }
          })
        })

        this.activityTitleList = obj
        this.activityList = splitArrayIntoChunks(newList, 4)

        sessionStorage.setItem('activityList', JSON.stringify(this.activityList))
      }
    },
    async updateHotBoxGames(data: any[]) {
      this.hotBoxGames = data
    },
  },
  getters: {
    // 获取游戏相关数据， 如果只传 gameId 不能正确查询，gameId不唯一，需要联动 kindId 或者 agentId
    // 如果只是获取厂商 则只需要传 agentId
    getGame(state) {
      // 所以如果要查询游戏，需要传 kindId + gameId  或者 agentId + gameId  或者都传
      // 如果要查场馆 就传 venueId + kindId 或者 venueId + gameId
      return (params: {
        kindId?: any // 分类ID  电子、视讯 之类（kindId）
        agentId?: any // 厂商ID 有下级游戏的叫厂商 （agentId）
        venueId?: any // 场馆ID 没有下级游戏的叫场馆 （venueId）
        gameId?: any // 游戏ID 游戏的ID  （gameId）
      }) => {
        let kind: any
        let agent: any
        let venue: any
        let game: any
        if (isValid(params.venueId)) { // 查找场馆
          venue = state.gameDatas.platform.find((k: any) => k.venueId === params.venueId)
          if (isValid(params.kindId)) {
            kind = state.homeGameData.find((k: any) => k.kindId === params.kindId)
          }
          if (isValid(params.gameId)) {
            game = state.gameDatas.game.find((g: any) => g.venueId === params.venueId && g.gameId === params.gameId)
          }
        }
        else if (isValid(params.gameId)) { // 查找游戏
          const games = state.gameDatas.game.filter((g: any) => g.gameId === params.gameId)
          if (isValid(params.agentId)) { // 定位游戏
            game = games.find((g: any) => g.agentId === params.agentId)
          }
          if (isValid(params.kindId)) {
            game = games.find((g: any) => g.kindId === params.kindId)
          }
          if (game) { // 通过游戏来反查分类和厂商
            kind = state.homeGameData.find((k: any) => k.kindId === game.kindId)
            if (kind && kind.three_platform) {
              agent = kind.three_platform.find((k: any) => k.agentId === game.agentId)
            }
          }
        }
        else { // 查找厂商
          if (isValid(params.agentId)) {
            agent = state.gameDatas.platform.find((a: any) => a.agentId === params.agentId)
          }
          if (isValid(params.kindId)) {
            kind = state.homeGameData.find((k: any) => k.kindId === params.kindId)
            if (isValid(params.agentId)) {
              agent = kind.three_platform
                .find((k: any) => k.agentId === params.agentId)
            }
          }
        }

        return { kind, agent, venue, game }
      }
    },

    // 查询某个游戏 相关数据
    //   console.error('查询', getGame.value({
    //     agentId: 6,
    //     gameId: "21003",
    //     kindId: 2
    //   }))
  },
  persist: {
    storage: sessionStorage,
    key: 'page-store',
    pick: ['settings'],
  },
})

function isValid(value: any) {
  return value !== undefined && value !== null
}

export default usePageStore
