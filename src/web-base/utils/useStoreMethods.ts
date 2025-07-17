import { storeToRefs } from 'pinia'
import { usePageStore } from '@/stores/modules/page'
import { Session } from '@/web-base/utils/storage'

// const { info, roleInfo, currencyRate, isLocalLoggedIn } = storeToRefs(useUserStore())
export function get<T>(url: string): Promise<T> {
  return new Promise((resole, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText)
          resole(res)
        }
        else {
          reject(new Error(`get: ${url} err`))
        }
      }
    }
    xhr.onerror = (err) => {
      reject(err)
    }

    xhr.open('GET', url, true)

    xhr.timeout = 2000
    xhr.send()
  })
}
/**
 * 解析名称
 *
 */
export function unserialize(v: any, isPlatform: boolean) {
  const { lang } = storeToRefs(usePageStore())
  if (!v)
    return ''
  const obj: any = {
    'en-US': 'en-US',
    'en': 'en-US',
    'en-AU': 'en-US',
    'zh': 'zh-CN',
    'zh-CN': 'zh-CN',
    'vi': 'vi-VN',
    'vi-VN': 'vi-VN',
    'vn': 'vi-VN',
  }

  try {
    if (isPlatform) {
      v = JSON.parse(v)
    }
  }
  catch (err) {
    console.error(err)
  }
  return `${(v[obj[lang.value]] || v['en-US'] || v['zh-CN'] || v['vi-VN'] || '')}`
}
/**
 * 取最快的链接
 */
export function getFastestUrl(): Promise<string> {
  return new Promise((resolve) => {
    function determineProtocol(ipAddress: string) {
      if (ipAddress.startsWith('http://')) {
        return 'http'
      }
      else if (ipAddress.startsWith('https://')) {
        return 'https'
      }
      else if (ipAddress.startsWith('ws://')) {
        return 'ws'
      }
      else if (ipAddress.startsWith('wss://')) {
        return 'wss'
      }
      else {
        // 默认使用 http 协议
        return 'http'
      }
    }

    function connectWithTimeout(url: string | URL, timeout: number | undefined) {
      return new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(url)

        const timer = setTimeout(() => {
          reject(new Error('WebSocket 连接超时'))
          ws.close()
        }, timeout)

        ws.onopen = function () {
          clearTimeout(timer)
          ws.close()
          resolve()
        }

        ws.onerror = function (error) {
          clearTimeout(timer)
          reject(error)
        }
      })
    }

    // 暂时注释掉选择速度最快的服务器
    let fastCost = 99999
    let fastIndex = 0
    // let fastUrl = Session.get('fastUrl')
    // if (fastUrl) {
    //     resolve(fastUrl)
    // } else {
    const { settings } = storeToRefs(usePageStore())
    if (settings.value?.server_testUrls?.length > 0) {
      const promises: Promise<{ cost: number, index: number }>[] = settings.value.server_testUrls.map((urls: any[], index: any) => {
        const url = urls[0]
        return new Promise((resolve) => {
          const startTime = new Date().getTime()
          const _nowrul = urls[0] // httpToWs(url);

          switch (determineProtocol(_nowrul)) {
            case 'http':
            case 'https':
              get(url)
                .then(() => {
                  const endTime = new Date().getTime()
                  const cost = endTime - startTime
                  console.log(`请求:${url} 耗时:${cost}`)
                  resolve({ cost, index })
                })
                .catch((error: any) => {
                  console.error('Error:', error)
                  resolve({ cost: 9999999, index }) // 如果出错，将 cost 设置为 Infinity
                })
              break
            case 'ws':
            case 'wss':
              connectWithTimeout(_nowrul, 5000)
                .then(() => {
                  // console.log('WebSocket 连接成功');
                  const endTime = new Date().getTime()
                  const cost = endTime - startTime
                  console.log(`请求:${_nowrul} 耗时:${cost}`)
                  resolve({ cost, index })
                })

                .catch((error) => {
                  console.error('WebSocket 连接失败:', error)
                  resolve({ cost: 9999999, index }) // 如果出错，将 cost 设置为 Infinity
                })
              break

            default:
              break
          }
        })
      })
      Promise.all(promises).then(async (results) => {
        results.forEach(({ cost, index }) => {
          if (cost < fastCost) {
            fastCost = cost
            fastIndex = index
          }
        })

        const fastestUrl = settings.value.server_testUrls[fastIndex]
        // let _wsurl = fastestUrl[1]; //httpToWs(fastestUrl);
        // let server_ips = [_wsurl];
        console.log(`最快URL:${fastestUrl[0]} 耗时:${fastCost}`)
        resolve(fastestUrl[1])
        // Session.set('fastUrl', fastestUrl[1])
      })
      // } else {
      //     resolve(settings.value.server_testUrls[0][1])
      // }
    }
  })
}
// 玩家IP
export function IP(): Promise<string> {
  return new Promise((resolve) => {
    let fastCost = 99999
    let fastIndex = 0
    let _ip = ''
    const { settings } = storeToRefs(usePageStore())
    const promises: Promise<{ cost: number, index: number, str: string }>[] = settings.value.GET_IP_LIST.map((url: any, index: any) => {
      return new Promise((resolve) => {
        const startTime = new Date().getTime()

        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.timeout = 5000
        xhr.responseType = 'text'

        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              const endTime = new Date().getTime()
              const cost = endTime - startTime
              const str: any = xhr.responseText
              // cc.log(请求:${url} 耗时:${cost}, index:${index}, str);
              resolve({ cost, index, str })
            }
            else {
              // console.error("Error: xhr.status", xhr.status);
              resolve({ cost: 9999999, index, str: '' }) // 如果出错，将 cost 设置为 Infinity
            }
          }
        }

        xhr.send()
      })
    })

    Promise.all(promises).then((results) => {
      results.forEach(({ cost, index, str }) => {
        if (cost < fastCost) {
          fastCost = cost
          fastIndex = index
          _ip = str
        }
      })
      const fastestUrl = settings.value.GET_IP_LIST[fastIndex]
      console.log(`最快IP: ${fastestUrl} 耗时: ${fastCost} IP: ${_ip}`)
      resolve(_ip)
    })
  })
}

// convert the display money, all the money need to call this function before display
// export function convert2DisplayMoney(num: number = 0, isShowDecimal: boolean = false, isToLocal: boolean = true) {
//   if (typeof num === 'string') {
//     num = Number(num)
//   }
//   if (Number.isNaN(num)) {
//     return 0 // 或者返回默认值
//   }
//   const rate = isLocalLoggedIn.value ? roleInfo.value.currencyrate : currencyRate.value
//   if (Number.isNaN(rate) || rate === 0) {
//     return 0 // 或者返回默认值
//   }
//   num = isShowDecimal
//     ? Number((num / rate).toFixed(0))
//     : Number((num / rate).toFixed())
//   let result
//   if (isToLocal) {
//     result = num.toLocaleString()
//   }
//   else {
//     result = num
//   }
//   return result || 0
// }
// // for the input money and need to send to server
// export function convert2ServerMoney(num: number) {
//   return num * roleInfo.value.currencyrate
// }

// export async function onPlayGame(v: any) {
//   if (!isLocalLoggedIn.value) {
//     // await useUserStore().setLogin(true)
//     return
//   }

//   // if (v.agentId == 30) {
//   //     v.kindId = '7'
//   // }

//   // if(v.agentId == 16||v.id == 16) {
//   //     v.gameId = '301'
//   //     v.kindId = '999'
//   // }

//   if (v.has_next === 1 && v.three_game_kind?.length) {
//     router.push({
//       path: '/categoryPage',
//       query: {
//         type: v.three_game_kind[0].id,
//         platformId: v.id,
//       },
//     })
//   }
//   else {
//     usePageStore().setShowRight(false)
//     Local.set('selectedGameItem', v)
//     router.push({
//       path: '/game',
//       query: { id: v.gameId || v.id },
//     })
//   }
// }
// 未登录汇率
export async function handleCurrencyRate(data: any) {
  console.log('汇率', data)
  // await useUserStore().getCurrencyRate(data)
}
// 绑定资金密码后，需要更新 store
// export async function updateStorePayPwd(val: any) {
//   const newData = { ...roleInfo.value }
//   newData.withdraw_pwd = val
//   newData.withdraw_pwd_status = 2 // 已绑定资金密码
//   // await useUserStore().getRoleInfo(newData)
// }
// // 绑定手机号码后，需要更新 store
// export async function updateUserInfo(val: any) {
//   const newData = { ...info.value }
//   newData.mobile = val
//   // await useUserStore().getInfo(newData)
// }
// 获取ip对应得地址 保存到session中
export async function getIPAddress(data: any) {
  const { settings } = storeToRefs(usePageStore())
  const ips = Session.get('ips') || {}
  for (let index = 0; index < data.length; index++) {
    if (data[index].ip && !ips[data[index].ip]) {
      const response = await fetch(settings.value.geoip_api + data[index].ip)
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`)
      }
      const res = await response.json()
      if (res && res.data && res.data.country) {
        ips[data[index].ip] = `${res.data.city} ${res.data.region} ${res.data.country}`
        data[index].location = `${res.data.city} ${res.data.region} ${res.data.country}`
        Session.set('ips', ips)
      }
      else {
        data[index].location = ''
      }
    }
    else {
      data[index].location = ips[data[index].ip]
    }
  }
}
