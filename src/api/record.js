import request from '@/utils/request'


export function fetchRecords(size, status) {
  return request({
    url: '/build/record',
    method: 'get',
    params: { size: size, result: status }
  })
}
