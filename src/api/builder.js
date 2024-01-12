import request from "@/http/request";

export function buildQuickTest(data) {
  return request({
    url: '/builder/quick',
    method: 'post',
    data: data
  })
}

export function buildInstantTest(data) {
  return request({
    url: '/builder/instant',
    method: 'post',
    data: data
  })
}

export function buildDebug(data) {
  return request({
    url: '/builder/debug',
    method: 'post',
    data: data
  })
}

export function getBuildProgress(data) {
  return request({
    url: `/builder/progress`,
    method: 'post',
    data: data
  })
}

export function getDebugLog(buildId) {
  return request({
    url: `/builder/log`,
    method: 'get',
    params: {id: buildId}
  })
}

export function buildStop(data) {
  return request({
    url: '/builder/stop',
    method: 'post',
    data: data
  })
}
