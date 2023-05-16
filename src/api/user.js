import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function getInfo(userId) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { uid: userId }
  })
}

export function logout() {
  return request({
    url: 'user/logout',
    method: 'post',
    data: {}
  })
}
