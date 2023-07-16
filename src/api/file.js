import request from "@/http/request";

export function fetchFileContent(suiteId) {
  return request({
    url: '/file/virtual_file/get_content',
    method: 'get',
    params: { suite: suiteId }
  })
}

export function saveFileContent(data) {
  return request({
    url: '/file/virtual_file/save_content',
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
    url: '/file/virtual_file/batch_delete',
    method: 'post',
    data: data
  })
}
