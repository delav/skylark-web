const RootPId = 0

const NodeType = {
  TESTCASE: 0,
  RESOURCE: 1,
  HELPFILE: 2,
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
  NodeType,
  NodeDesc,
  ActionType,
  DetailType,
  ModuleType,
}
