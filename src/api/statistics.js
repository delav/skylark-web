import request from "@/http/request";

export function fetchCaseInfo() {
  return request({
    url: '/statistics/case_info',
    method: 'get',
  })
}

export function fetchBuildInfo() {
  return request({
    url: '/statistics/build_info',
    method: 'get',
  })
}
