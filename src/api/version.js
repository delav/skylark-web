import request from "@/http/request";

export function createVersion(data) {
  return request({
    url: '/project_version',
    method: 'post',
    data: data
  })
}

export function fetchVersion(projectId, filter=false) {
  return request({
    url: '/project_version',
    method: 'get',
    params: { project: projectId, filter: filter }
  })
}
