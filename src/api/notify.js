import request from "@/http/request";


export function getNotification(projectId) {
  return request({
    url: '/notification',
    method: 'get',
    params: { project: projectId }
  })
}

export function saveNotification(data) {
  return request({
    url: '/notification',
    method: 'post',
    data: data
  })
}
