import request from '@/http/request'

export function getKeywordGroup() {
  return request({
    url: '/keyword-group',
    method: 'get',
  })
}

