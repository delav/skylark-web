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

export function createModuleTag(data) {
  return request({
    url: '/module_tag',
    method: 'post',
    data: data
  })
}

export function deleteModuleTag(tagId) {
  return request({
    url: `/module_tag/${tagId}`,
    method: 'delete',
  })
}

export function createTagModuleTag(data) {
  return request({
    url: '/module_tag/add_tag',
    method: 'post',
    data: data
  })
}
