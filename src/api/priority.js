import request from '@/utils/request'

export function fetchPriorities() {
  return request({
    url: '/case-priority',
    method: 'get',
  })
}
