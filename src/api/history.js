import request from '@/utils/request'


export function fetchHistories(size, status) {
  return request({
    url: '/build/history',
    method: 'get',
    params: { size: size, result: status }
  })
}
