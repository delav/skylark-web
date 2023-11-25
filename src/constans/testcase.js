const CaseTimeout = 20000
const QueryPeriod = 2000

const CaseStatus = {
  PASSED: 'PASS',
  FAILED: 'FAIL',
  SKIPPED: 'SKIP',
}

const StatusColor = {
  DEFAULT: '#555',
  PASSED: '#00a83e',
  FAILED: '#f56c6c',
  SKIPPED: '#e6a23c'
}

export default {
  CaseTimeout,
  QueryPeriod,
  CaseStatus,
  StatusColor
}
