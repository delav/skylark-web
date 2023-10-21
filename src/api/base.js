import request from "@/http/request";

export function fetchBaseInfo() {
  return request({
    url: '/base/base_info',
    method: 'get',
  })
}

export function fetchProjectInfo() {
  return request({
    url: '/base/project_info',
    method: 'get',
  })
}
