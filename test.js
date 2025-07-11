function getRandomNum(start, end) {
  return Math.floor(Math.round(Math.random() * (end - start) + start))
}
function getRandomSign(deviceId) {
  let random1 = getRandomNum(0, 9)
  let random2 = getRandomNum(0, 9)
  let baseStr
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let leng = baseStr.length
  let str1 = ''
  for (let k = 0; k < random1; ++k) {
    let idx = getRandomNum(0, leng - 1)
    let tmp = baseStr[idx]
    str1 = str1 + tmp
  }
  let str2 = ''
  for (let k = 0; k < random2; ++k) {
    let idx = getRandomNum(0, leng - 1)
    let tmp = baseStr[idx]
    str2 = str2 + tmp
  }
  let str = random1.toString() + random2.toString() + str1 + deviceId + str2
  let base64Str = btoa(str)

  return base64Str
}
console.log(1111, getRandomSign('f0b7ab3ea38a7274d655276ed74e4123'))
