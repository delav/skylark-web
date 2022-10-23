import request from '@/utils/request'

export function getLibKeyword() {
  return request({
    url: '/keyword/lib-keyword',
    method: 'get',
  })
}

export function getUserKeyword(projectId) {
  return request({
    url: '/keyword/user-keyword',
    method: 'get',
    params: { project: projectId }
  })
}
