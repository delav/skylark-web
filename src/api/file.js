import request from "@/http/request";

export function fetchFileContent(suiteId) {
  return request({
    url: '/virtual-file',
    method: 'get',
    params: { suite: suiteId }
  })
}

export function saveFileContent(data) {
  return request({
    url: '/virtual-file',
    method: 'post',
    data: data
  })
}

export function uploadFile(formData) {
  return request({
    url: '/project-file/upload',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data: formData
  })
}

export function downloadFile(formData) {
  return request({
    url: '/project-file/download',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data: formData
  })
}

export function batchDeleteFile(data) {
  return request({
    url: '/virtual-file',
    method: 'post',
    data: data
  })
}
