// 用于游戏数据分割成有分页的效果
export function splitArrayIntoChunks(array: any, chunkSize: number) {
  const result = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
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
