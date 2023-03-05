import request from '@/utils/request'

export function createVersion(data) {
  return request({
    url: '/project-version',
    method: 'post',
    data
  })
}

export function fetchVersion(projectId, filter) {
  return request({
    url: '/project-version',
    method: 'get',
    params: { project: projectId, filter: filter }
  })
}
