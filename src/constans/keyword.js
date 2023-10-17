const KeywordType = {
  LIB: 0,
  USER: 1,
  PRO: 2
}

const KeywordArgType = {
  NONE: 0,
  SINGLE: 1,
  MULTI: 2,
  LIST: 3,
  DICT: 4,
}

const KeywordCategory = {
  RESERVED: 0,
  ORDINARY: 1,
  DEPENDENCE: 2,
  CUSTOMIZED: 3,
  PLATFORM: 9,
}

export default {
  KeywordType,
  KeywordArgType,
  KeywordCategory
}
