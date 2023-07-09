import request from "@/http/request";

export function fetchDirAndSuiteNode(dirId) {
  return request({
    url: '/test_suite',
    method: 'get',
    params: { dir: dirId }
  })
}

export function createSuite(data) {
  return request({
    url: '/test_suite',
    method: 'post',
    data: data
  })
}

export function updateSuite(suiteId, data) {
  return request({
    url: `/test_suite/${suiteId}`,
    method: 'patch',
    data: data
  })
}

export function deleteSuite(suiteId) {
  return request({
    url: `/test_suite/${suiteId}`,
    method: 'delete',
  })
}

export function duplicateSuite(data) {
  return request({
    url: '/test_suite/duplicate',
    method: 'post',
    data: data
  })
}
