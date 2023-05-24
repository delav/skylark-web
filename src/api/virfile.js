import request from "@/http/request";

export function fetchFileContent(suiteId) {
  return request({
    url: '/virtual-file',
    method: 'get',
    params: { suite: suiteId }
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
