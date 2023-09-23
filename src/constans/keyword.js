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
  ORDINARY: 0,
  RESERVED: 1,
  CUSTOMIZED: 9
}

export default {
  KeywordType,
  KeywordArgType,
  KeywordCategory
}
