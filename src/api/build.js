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

export function createPlan(data) {
  return request({
    url: '/build/plan',
    method: 'post',
    data
  })
}

export function updatePlan(planId, data) {
  return request({
    url: `/build/plan/${planId}`,
    method: 'post',
    data
  })
}

export function fetchPlans(page, size) {
  return request({
    url: '/build/plan',
    method: 'get',
    params: { page: page, size: size }
  })
}

export function getPlansByProject(projectId) {
  return request({
    url: `/build/plan`,
    method: 'get',
    params: { project: projectId }
  })
}

export function getPlanDetail(planId) {
  return request({
    url: `/build/plan/${planId}`,
    method: 'get',
  })
}

export function fetchHistories(size, status) {
  return request({
    url: '/build/history',
    method: 'get',
    params: { size: size, result: status }
  })
}
