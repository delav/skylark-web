import request from "@/http/request";

export function fetchWebhooks() {
  return request({
    url: '/webhook',
    method: 'get'
  })
}

export function createWebhook(data) {
  return request({
    url: '/webhook',
    method: 'post',
    data: data
  })
}

export function deleteWebhook(hookId) {
  return request({
    url: `/webhook/${hookId}`,
    method: 'delete',
  })
}
