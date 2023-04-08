const RootPId = 0

const NodeCategory = {
  TESTCASE: 0,
  KEYWORD: 1,
  RESOURCE: 2,
  HELPFILE: 3,
}

const NodeDesc = {
  CASE: 'C',
  SUITE: 'S',
  DIR: 'D',
  ROOT: 'P'
}

const ActionType = {
  POST: 1,
  UPDATE: 2,
}

const DetailType = {
  EMPTY: 0,
  CASE: 1,
  SUITE: 2,
  DIR: 3,
  ROOT: 4,
  FILE: 5,
}

const ModuleType = {
  PROJECT: 0,
  DIR: 1,
  SUITE: 2,
}

export default {
  RootPId,
  NodeCategory,
  NodeDesc,
  ActionType,
  DetailType,
  ModuleType,
}
