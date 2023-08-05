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

export function reset(data) {
  return request({
    url: 'user/reset',
    method: 'post',
    data: data
  })
}

export function register(data) {
  return request({
    url: 'user/register',
    method: 'post',
    data: data
  })
}

export function getUserEmails() {
  return request({
    url: 'user/register',
    method: 'get',
  })
}
