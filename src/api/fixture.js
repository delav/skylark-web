import request from "@/http/request";

export function saveSetupTeardown(data) {
  return request({
    url: '/setup_teardown',
    method: 'post',
    data: data
  })
}

