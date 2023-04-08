import request from '@/utils/request'

export function createBuildTest(data) {
  return request({
    url: '/build/test',
    method: 'post',
    data
  })
}

export function createBuildDebug(data) {
  return request({
    url: '/build/debug',
    method: 'post',
    data
  })
}

export function getBuildTestProgress(buildId) {
  return request({
    url: `/build/test/${buildId}`,
    method: 'get',
  })
}

export function getBuildDebugProgress(buildId) {
  return request({
    url: `/build/debug/${buildId}`,
    method: 'get',
  })
}

export function getBuildInfo(buildId) {
  return request({
    url: `/build/debug/${buildId}`,
    method: 'get',
  })
}

