import request from '@/utils/request'

export function buildQuickTest(data) {
  return request({
    url: '/builder/quick',
    method: 'post',
    data
  })
}

export function buildInstantTest(data) {
  return request({
    url: '/builder/instant',
    method: 'post',
    data
  })
}

export function buildDebug(data) {
  return request({
    url: '/builder/debug',
    method: 'post',
    data
  })
}

export function getBuildProgress(buildId) {
  return request({
    url: `/builder/test/${buildId}`,
    method: 'get',
  })
}

export function getBuildInfo(buildId) {
  return request({
    url: `/builder/debug/${buildId}`,
    method: 'get',
  })
}

