import request from '@/utils/request'

export function fetchDirAndSuiteNode(dirId) {
  return request({
    url: '/test-suite',
    method: 'get',
    params: { dir: dirId }
  })
}

export function createSuite(data) {
  return request({
    url: '/test-suite',
    method: 'post',
    data
  })
}

export function updateSuite(suiteId, data) {
  return request({
    url: `/test-suite/${suiteId}`,
    method: 'patch',
    data
  })
}

export function deleteSuite(suiteId) {
  return request({
    url: `/test-suite/${suiteId}`,
    method: 'delete',
  })
}
