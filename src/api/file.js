import request from "@/http/request";

export function fetchFileContent(suiteId) {
  return request({
    url: '/virtual_file',
    method: 'get',
    params: { suite: suiteId }
  })
}

export function saveFileContent(data) {
  return request({
    url: '/virtual_file',
    method: 'post',
    data: data
  })
}

export function uploadFile(formData) {
  return request({
    url: '/file/project_file/upload',
    method: 'post',
    headers: {'Content_Type': 'multipart/form_data'},
    data: formData
  })
}

export function downloadFile(formData) {
  return request({
    url: '/file/project_file/download',
    method: 'post',
    headers: {'Content_Type': 'multipart/form_data'},
    data: formData
  })
}

export function batchDeleteFile(data) {
  return request({
    url: '/file/virtual_file',
    method: 'post',
    data: data
  })
}
