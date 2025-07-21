// 判断是否在桌面版本中
export function isRunningAsPWA() {
  // 通用检测
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  // iOS检测
  const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
  const isStandaloneIOS = isIOS && ('standalone' in window.navigator) && window.navigator.standalone

  return isStandalone || isStandaloneIOS
}

// 用于游戏数据分割成有分页的效果
export function splitArrayIntoChunks(array: any, chunkSize: number) {
  const result = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}
export function isValid(value) {
  return value !== undefined && value !== null
}

export function joinURL(baseURL: any, path: any) {
  if (!path)
    return ''
  if (!baseURL)
    baseURL = ''
  // 时间戳为10位需*1000，时间戳为13位不需乘1000
  if (baseURL.endsWith('/')) {
    baseURL = baseURL.slice(0, -1)
  }
  // 移除 path 开头的斜杠（如果有）
  if (path?.startsWith('/')) {
    path = path.slice(1)
  }
  // 拼接 URL
  return `${baseURL}/${path}`
}
