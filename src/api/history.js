import request from "@/http/request";


export function fetchHistories(recordId) {
  return request({
    url: '/build/history',
    method: 'get',
    params: { record: recordId }
  })
}
