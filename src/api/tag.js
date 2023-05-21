import request from '@/http/request'

export function fetchTagsByProject(projectId) {
  return request({
    url: '/tag',
    method: 'get',
    params: { project: projectId }
  })
}
