import request from '@/utils/request'

export function buildQuickTest(data) {
  return request({
    url: '/builder/test/quick',
    method: 'post',
    data
  })
}

export function buildInstantTest(data) {
  return request({
    url: '/builder/test/instant',
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

export function getBuildTestProgress(buildId) {
  return request({
    url: `/builder/test/${buildId}`,
    method: 'get',
  })
}

export function getBuildDebugProgress(buildId) {
  return request({
    url: `/builder/debug/${buildId}`,
    method: 'get',
  })
}

export function getBuildInfo(buildId) {
  return request({
    url: `/builder/debug/${buildId}`,
    method: 'get',
  })
}

