import request from '@/utils/request'

export function fetchEntities(caseId) {
  return request({
    url: '/case-entity',
    method: 'get',
    params: { case: caseId }
  })
}

export function updateEntities(data) {
  return request({
    url: '/case-entity',
    method: 'post',
    data: data
  })
}

