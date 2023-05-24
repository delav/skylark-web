import request from "@/http/request";

export function postSetupTeardown(data) {
  return request({
    url: '/setup-teardown',
    method: 'post',
    data: data
  })
}

