import request from '@/utils/request'

export function fetchProjectList() {
  return request({
    url: '/project',
    method: 'get',
  })
}

export function updateProject(pId, data) {
  return request({
    url: `/project/${pId}`,
    method: 'patch',
    data: data
  })
}

export function createProject(data) {
  return request({
    url: '/project',
    method: 'post',
    data: data
  })
}
