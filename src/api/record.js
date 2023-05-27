import request from "@/http/request";


export function fetchRecords(page, size, project=null) {
  let params = { page: page, size: size }
  if (project !== null) {
    params.project = project
  }
  return request({
    url: '/build/record',
    method: 'get',
    params: params
  })
}
