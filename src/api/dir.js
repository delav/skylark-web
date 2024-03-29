import request from "@/http/request";

export function fetchBaseDir(projectId) {
  return request({
    url: '/suite_dir',
    method: 'get',
    params: { project: projectId }
  })
}

export function createDir(data) {
  return request({
    url: '/suite_dir',
    method: 'post',
    data: data
  })
}

export function updateDir(dirId, data) {
  return request({
    url: `/suite_dir/${dirId}`,
    method: 'patch',
    data: data
  })
}

export function deleteDir(dirId) {
  return request({
    url: `/suite_dir/${dirId}`,
    method: 'delete',
  })
}
