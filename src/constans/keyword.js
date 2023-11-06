
const EntitySplitSep = '#@#'
const KeywordSplitSep = '|'
const ListFreeArg = '*args'
const DictFreeArg = '**kwargs'

const KeywordArgType = {
  NONE: 0,
  FINITE: 1,
  LIST: 2,
  DICT: 3,
  MIXED: 4,
}

const KeywordCategory = {
  RESERVED: 0,
  ORDINARY: 1,
  DEPENDENCE: 2,
  CUSTOMIZED: 3,
  PLATFORM: 9,
}

export default {
  EntitySplitSep,
  KeywordSplitSep,
  ListFreeArg,
  DictFreeArg,
  KeywordArgType,
  KeywordCategory
}
