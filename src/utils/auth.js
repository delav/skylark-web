import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const TokenKey = 'Authorization'

export const NotAuthPath = {
  Login: '/login',
  Register: '/register',
  Reset: '/reset',
  Page401: '/401',
  Page404: '/404'
}

export function isNotAuthPage(path) {
  return Object.values(NotAuthPath).indexOf(path) !== -1
}

export function notAuthApi(url) {
  const notAuthApi = [
    '/user/login',
    '/user/register',
    '/user/precheck',
    '/user/reset_password'
  ]
  return notAuthApi.indexOf(url) !== -1
}

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    const authorize = 'Bearer ' + token
    return Cookies.set(TokenKey, authorize)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function encrypt (plaintext) {
  const keyStr = '20220427@)@@)$@&'
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const src = CryptoJS.enc.Utf8.parse(plaintext)
  const encrypted = CryptoJS.AES.encrypt(src, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
