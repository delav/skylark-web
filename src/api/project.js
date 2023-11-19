import request from "@/http/request";

export function fetchProjectList() {
  return request({
    url: '/project',
    method: 'get',
  })
}

export function updateProject(projectId, data) {
  return request({
    url: `/project/${projectId}`,
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

