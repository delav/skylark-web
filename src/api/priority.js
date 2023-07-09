import request from "@/http/request";

export function fetchPriorities() {
  return request({
    url: '/case_priority',
    method: 'get',
  })
}
