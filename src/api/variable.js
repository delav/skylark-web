import request from '@/utils/request'

export function fetchVariables(moduleId, moduleType) {
  return request({
    url: '/variable',
    method: 'get',
    params: { mid: moduleId, mtp: moduleType }
  })
}

export function createVariable(data) {
  return request({
    url: '/variable',
    method: 'post',
    data
  })
}

export function updateVariable(vId, data) {
  return request({
    url: `/variable/${vId}`,
    method: 'patch',
    data
  })
}

export function deleteVariable(vId) {
  return request({
    url: `/variable/${vId}`,
    method: 'delete',
  })
}
