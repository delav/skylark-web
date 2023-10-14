import request from "@/http/request";


export function fetchAccessProjects() {
  return request({
    url: '/permission_project',
    method: 'get'
  })
}

export function updateAccessProject(data) {
  return request({
    url: '/permission_project',
    method: 'post',
    data: data
  })
}
