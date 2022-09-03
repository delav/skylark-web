import request from "@/utils/request";

export function fetchBaseDir(projectId) {
  return request({
    url: '/suite-dir',
    method: 'get',
    params: { project: projectId }
  })
}
