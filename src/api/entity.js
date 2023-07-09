import request from "@/http/request";

export function fetchEntities(caseId) {
  return request({
    url: '/case_entity',
    method: 'get',
    params: { case: caseId }
  })
}

export function updateEntities(data) {
  return request({
    url: '/case_entity',
    method: 'post',
    data: data
  })
}

