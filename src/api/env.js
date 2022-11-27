import request from '@/utils/request'

export function fetchEnvs() {
  return request({
    url: '/environment',
    method: 'get',
  })
}

