import request from '@/utils/request'

export function fetchEntities(caseId) {
  return request({
    url: '/case-entity',
    method: 'get',
    params: { case: caseId }
  })
}

export function saveEntities(data) {
  return request({
    url: '/case-entity',
    method: 'post',
    data
  })
}

