const RootPId = 0

const NodeCategory = {
  TESTCASE: 0,
  KEYWORD: 1,
  RESOURCE: 2,
  PROJECTFILE: 3,
}

const NodeDesc = {
  CASE: 'C',
  SUITE: 'S',
  DIR: 'D',
  ROOT: 'P'
}

const ActionType = {
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3,
  UPLOAD: 4,
  DOWNLOAD: 5,
  COPY: 6,
  PASTE: 7,
}

const DetailType = {
  EMPTY: 0,
  CASE: 1,
  SUITE: 2,
  DIR: 3,
  ROOT: 4,
  CONST: 5,
  FILE: 6,
}

const ModuleType = {
  PROJECT: 0,
  DIR: 1,
  SUITE: 2,
  CASE: 3,
}

const ExtraDataKey = {
  VARIABLE: 'variables',
  FIXTURE: 'fixtures',
  TAG: 'tags',
  ENTITY: 'entities'
}

export default {
  RootPId,
  NodeCategory,
  NodeDesc,
  ActionType,
  DetailType,
  ModuleType,
  ExtraDataKey
}
