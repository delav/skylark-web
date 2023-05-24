import request from "@/http/request";

export function fetchPriorities() {
  return request({
    url: '/case-priority',
    method: 'get',
  })
}
