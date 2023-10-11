import request from "@/http/request";

export function fetchKeywordGroup() {
  return request({
    url: '/keyword_group',
    method: 'get',
  })
}

