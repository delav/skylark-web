import request from '@/utils/request'

export function fetchRegions() {
  return request({
    url: '/region',
    method: 'get',
  })
}

