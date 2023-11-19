import request from "@/http/request";

export function fetchKeywordGroup() {
  return request({
    url: '/keyword_group',
    method: 'get',
  })
}

export function createKeywordGroup(data) {
  return request({
    url: '/keyword_group',
    method: 'post',
    data: data
  })
}

export function updateKeywordGroup(groupId, data) {
  return request({
    url: `/keyword_group/${groupId}`,
    method: 'patch',
    data: data
  })
}

export function deleteKeywordGroup(groupId) {
  return request({
    url: `/keyword_group/${groupId}`,
    method: 'delete'
  })
}
