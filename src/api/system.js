import request from "@/http/request";

export function fetchSystemMessage() {
  return request({
    url: '/system/get_system_message',
    method: 'get',
  })
}

export function readSystemMessage(data) {
  return request({
    url: `/system/read_system_message`,
    method: 'post',
    data: data
  })
}

export function removeSystemMessage(data) {
  return request({
    url: `/system/remove_system_message`,
    method: 'post',
    data: data
  })
}

export function userFeedback(formData) {
  return request({
    url: `/system/user_feedback`,
    method: 'post',
    headers: {'Content_Type': 'multipart/form_data'},
    data: formData
  })
}
