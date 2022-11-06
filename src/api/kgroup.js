import request from '@/utils/request'

export function getKeywordGroup() {
  return request({
    url: '/keyword-group',
    method: 'get',
  })
}

