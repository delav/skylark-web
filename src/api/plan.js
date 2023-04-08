import request from '@/utils/request'

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
