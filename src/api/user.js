import request from "@/http/request";

export function login(data) {
  return request({
    url: '/user/login',
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

export function reset(data) {
  return request({
    url: 'user/reset',
    method: 'post',
    data: data
  })
}

export function fetchUsers() {
  return request({
    url: 'user/info',
    method: 'get',
  })
}

export function getInfo() {
  return request({
    url: `/user/info/1`,
    method: 'get'
  })
}
