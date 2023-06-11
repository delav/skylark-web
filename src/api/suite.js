import request from "@/http/request";

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
    data: data
  })
}

export function updateSuite(suiteId, data) {
  return request({
    url: `/test-suite/${suiteId}`,
    method: 'patch',
    data: data
  })
}

export function deleteSuite(suiteId) {
  return request({
    url: `/test-suite/${suiteId}`,
    method: 'delete',
  })
}

export function duplicateSuite(data) {
  return request({
    url: '/test-suite/duplicate',
    method: 'post',
    data: data
  })
}
