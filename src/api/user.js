import request from "@/http/request";

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function getInfo(userId) {
  return request({
    url: `/user/info/${userId}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'user/logout',
    method: 'post',
    data: {}
  })
}
