import request from "@/http/request";

export function fetchTagsByProject(projectId) {
  return request({
    url: '/tag',
    method: 'get',
    params: { project: projectId }
  })
}

export function createTag(data) {
  return request({
    url: '/tag',
    method: 'post',
    data: data
  })
}

export function deleteTag(tagId) {
  return request({
    url: `/tag/${tagId}`,
    method: 'delete',
  })
}
