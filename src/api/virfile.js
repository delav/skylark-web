import request from '@/utils/request'

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
    formData
  })
}

export function downloadFile(suiteId) {
  return request({
    url: '/project-file/download',
    method: 'get',
    params: {suite: suiteId}
  })
}
