import request from "@/http/request";


export function fetchRecords(page, size, queryParams) {
  let pageParams = { page: page, size: size }
  const params = Object.assign({}, pageParams, queryParams)
  return request({
    url: '/build/record',
    method: 'get',
    params: params
  })
}


export function getRecordDetail(recordId) {
  return request({
    url: `/build/record/${recordId}`,
    method: 'get',
  })
}

export function queryRecordStatus(recordId) {
  const params = { id: recordId }
  return request({
    url: '/build/record/query_status',
    method: 'get',
    params: params
  })
}
