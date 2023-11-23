import request from "@/http/request";

export function fetchParametersByProject(projectId) {
  return request({
    url: '/execute_param',
    method: 'get',
    params: { project: projectId }
  })
}

export function createParameter(data) {
  return request({
    url: '/execute_param',
    method: 'post',
    data: data
  })
}

export function updateParameter(parameterId, data) {
  return request({
    url: `/execute_param/${parameterId}`,
    method: 'patch',
    data: data
  })
}

export function deleteParameter(parameterId) {
  return request({
    url: `/execute_param/${parameterId}`,
    method: 'delete',
  })
}
