import request from '@/http/request'

export function fetchEnvs() {
  return request({
    url: '/environment',
    method: 'get',
  })
}

