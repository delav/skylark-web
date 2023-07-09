import request from "@/http/request";

export function fetchCaseNode(suiteId) {
  return request({
    url: '/test_case',
    method: 'get',
    params: { suite: suiteId }
  })
}

export function createCase(data) {
  return request({
    url: '/test_case',
    method: 'post',
    data: data
  })
}

export function updateCase(caseId, data) {
  return request({
    url: `/test_case/${caseId}`,
    method: 'patch',
    data: data
  })
}

export function deleteCase(caseId) {
  return request({
    url: `/test_case/${caseId}`,
    method: 'delete',
  })
}

export function duplicateCase(data) {
  return request({
    url: '/test_case/duplicate',
    method: 'post',
    data: data
  })
}
