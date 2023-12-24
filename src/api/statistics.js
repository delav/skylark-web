import request from "@/http/request";


export function fetchOverview() {
  return request({
    url: '/statistics/overview',
    method: 'get',
  })
}

export function fetchAllProjectInfo() {
  return request({
    url: '/statistics/project_info',
    method: 'get',
  })
}

export function fetchIncreaseInfo() {
  return request({
    url: '/statistics/increase_info',
    method: 'get',
  })
}

export function fetchProjectRecordInfo(projectId) {
  return request({
    url: '/statistics/record_info',
    method: 'get',
    params: { project: projectId }
  })
}

export function fetchProjectBuildInfo(projectId) {
  return request({
    url: '/statistics/build_info',
    method: 'get',
    params: { project: projectId }
  })
}
