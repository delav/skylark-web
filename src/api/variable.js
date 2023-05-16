import request from '@/utils/request'

export function fetchVariables(moduleId, moduleType, envId=null, regionId=null) {
  let params = {
    mid: moduleId,
    mtp: moduleType
  }
  if (envId !== null) {
    params.env = envId
  }
  if (regionId !== null) {
    params.region = regionId
  }
  return request({
    url: '/variable',
    method: 'get',
    params: params
  })
}

export function createVariable(data) {
  return request({
    url: '/variable',
    method: 'post',
    data: data
  })
}

export function updateVariable(vId, data) {
  return request({
    url: `/variable/${vId}`,
    method: 'patch',
    data: data
  })
}

export function deleteVariable(vId) {
  return request({
    url: `/variable/${vId}`,
    method: 'delete',
  })
}

export function batchCreateVariable(data) {
  return request({
    url: '/batch-variable',
    method: 'post',
    data
  })
}
