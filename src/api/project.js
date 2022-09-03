import request from '@/utils/request'

export function fetchProjectList(page, size) {
  return request({
    url: '/project',
    method: 'get',
    params: { page: page, size: size }
  })
}

