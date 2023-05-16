import request from '@/utils/request'

export function postSetupTeardown(data) {
  return request({
    url: '/setup-teardown',
    method: 'post',
    data: data
  })
}

