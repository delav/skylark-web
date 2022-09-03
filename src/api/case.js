import request from '@/utils/request'

export function fetchCaseNode(suiteId) {
  return request({
    url: '/test-case',
    method: 'get',
    params: { suite: suiteId }
  })
}
