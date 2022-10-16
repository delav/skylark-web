import request from '@/utils/request'

export function fetchCaseNode(suiteId) {
  return request({
    url: '/test-case',
    method: 'get',
    params: { suite: suiteId }
  })
}

export function createCase(data) {
  return request({
    url: '/test-case',
    method: 'post',
    data
  })
}

export function updateCase(caseId, data) {
  return request({
    url: `/test-case/${caseId}`,
    method: 'patch',
    data
  })
}

export function deleteCase(caseId) {
  return request({
    url: `/test-case/${caseId}`,
    method: 'delete',
  })
}
