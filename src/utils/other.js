

// generate uuid
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function isMobile() {
  return navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
}


export function isJsonString(str) {
  try {
    const obj = JSON.parse(str)
    return !!(typeof obj == 'object' && obj)
  } catch (err) {
    return false
  }
}
