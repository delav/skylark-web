import request from "@/http/request";

export function getLibKeyword(projectId) {
  return request({
    url: '/keyword/lib_keyword',
    method: 'get',
    params: { project: projectId}
  })
}

export function createKeyword(data) {
  return request({
    url: `/keyword/lib_keyword`,
    method: 'post',
    data: data
  })
}

export function updateKeyword(keywordId, data) {
  return request({
    url: `/keyword/lib_keyword/${keywordId}`,
    method: 'patch',
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

export function getLibKeywordByGroup(groupId) {
  return request({
    url: '/keyword/lib_keyword/get_list_by_group',
    method: 'get',
    params: { group: groupId }
  })
}

export function getReadyLibKeyword() {
  return request({
    url: '/keyword/lib_keyword/scan_keyword',
    method: 'get',
  })
}
