import request from "@/http/request";

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

export function fetchPlans(page, size, queryParams) {
  let pageParams = { page: page, size: size }
  const params = Object.assign({}, pageParams, queryParams)
  return request({
    url: '/build/plan',
    method: 'get',
    params: params
  })
}

export function deletePlan(planId) {
  return request({
    url: `/build/plan/${planId}`,
    method: 'delete',
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
    url: `/build/plan/get_instantly_plan_list`,
    method: 'get',
    params: { limit: size }
  })
}
