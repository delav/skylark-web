import request from '@/utils/request'

export function fetchDirAndSuiteNode(dirId) {
  return request({
    url: '/test-suite',
    method: 'get',
    params: { dir: dirId }
  })
}
