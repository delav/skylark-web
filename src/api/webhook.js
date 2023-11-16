import request from "@/http/request";

export function fetchWebhookList() {
  return request({
    url: '/webhook/get_webhook_list',
    method: 'get'
  })
}

export function getBuildWebhook() {
  return request({
    url: '/webhook/build_webhook',
    method: 'get'
  })
}

export function createBuildWebhook(data) {
  return request({
    url: '/webhook/create_webhook',
    method: 'post',
    data: data
  })
}
