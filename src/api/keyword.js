import request from "@/http/request";

export function getLibKeyword(data) {
  return request({
    url: '/keyword/lib_keyword/get_keyword_list',
    method: 'post',
    data: data
  })
}

export function getUserKeyword(projectId) {
  return request({
    url: '/keyword/user_keyword',
    method: 'get',
    params: { project: projectId }
  })
}
