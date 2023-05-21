import request from '@/http/request'

export function fetchRegions() {
  return request({
    url: '/region',
    method: 'get',
  })
}

