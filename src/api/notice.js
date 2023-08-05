import request from "@/http/request";


export function getNotice(projectId) {
  return request({
    url: '/notice',
    method: 'get',
    params: { project: projectId }
  })
}
