import request from "@/http/request";


export function getHistoryReport(historyId, reportType) {
  return request({
    url: '/build/history/get_report',
    method: 'get',
    params: { id: historyId, type: reportType }
  })
}
