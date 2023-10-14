import request from "@/http/request";


export function getNotice(projectId) {
  return request({
    url: '/notice',
    method: 'get',
    params: { project: projectId }
  })
}

export function saveNotice(data) {
  return request({
    url: '/notice',
    method: 'post',
    data: data
  })
}
