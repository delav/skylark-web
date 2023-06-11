import Cookies from "js-cookie";

const TokenKey = 'Authorization'

export const NotAuthUrl = {
  Login: '/user/login',
  Reset: '/user/reset',
  Register: '/user/register'
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

export function notAuth(url) {
  return url !== NotAuthUrl.Login
    || url !== NotAuthUrl.Reset
    || url !== NotAuthUrl.Register
}
