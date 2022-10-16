import request from "@/utils/request";

export function fetchBaseDir(projectId) {
  return request({
    url: '/suite-dir',
    method: 'get',
    params: { project: projectId }
  })
}

export function createDir(data) {
  return request({
    url: '/suite-dir',
    method: 'post',
    data
  })
}

export function updateDir(dirId, data) {
  return request({
    url: `/suite-dir/${dirId}`,
    method: 'patch',
    data
  })
}

export function deleteDir(dirId) {
  return request({
    url: `/suite-dir/${dirId}`,
    method: 'delete',
  })
}
