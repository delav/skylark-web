import request from '@/utils/request'

export function createBuild(data) {
  return request({
    url: '/build',
    method: 'post',
    data
  })
}

export function getBuildInfo(buildId) {
  return request({
    url: `/build/${buildId}`,
    method: 'get',
  })
}

export function getBuildProgress(buildId) {
  return request({
    url: `/build-edge/${buildId}`,
    method: 'get',
  })
}
