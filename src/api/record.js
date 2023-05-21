import request from '@/http/request'


export function fetchRecords(size) {
  return request({
    url: '/build/record',
    method: 'get',
    params: { limit: size }
  })
}
