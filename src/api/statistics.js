import request from "@/http/request";


export function fetchOverview() {
  return request({
    url: '/statistics/overview',
    method: 'get',
  })
}

export function fetchProjectInfo() {
  return request({
    url: '/statistics/project_info',
    method: 'get',
  })
}

export function fetchIncreaseInfo() {
  return request({
    url: '/statistics/increase_info',
    method: 'get',
  })
}
