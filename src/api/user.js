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

export function precheck(data) {
  return request({
    url: 'user/precheck',
    method: 'post',
    data: data
  })
}

export function resetConfirm(data) {
  return request({
    url: 'user/reset_password',
    method: 'post',
    data: data
  })
}

export function fetchUsers() {
  return request({
    url: 'user/get_user_list',
    method: 'get',
  })
}

export function getInfo() {
  return request({
    url: `/user/get_info`,
    method: 'get'
  })
}
