import request from '@/http/request'

export function createPlan(data) {
  return request({
    url: '/build/plan',
    method: 'post',
    data: data
  })
}

export function updatePlan(planId, data) {
  return request({
    url: `/build/plan/${planId}`,
    method: 'post',
    data: data
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


export function fetchInstantlyPlans(size) {
  return request({
    url: `/build/plan/instantly`,
    method: 'get',
    params: { limit: size }
  })
}
