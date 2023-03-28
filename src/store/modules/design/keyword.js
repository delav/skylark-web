const getKeywordState = () => {
  return {
    keywordsObject: {},
    hideKeyword: false,
  }
}

const state = getKeywordState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getKeywordState())
  },
  SET_KEYWORDS_OBJECT: (state, keywordObj) => {
    state.keywordsObject = keywordObj
  },
  SET_HIDE_KEYWORD: (state, isHide) => {
    state.hideKeyword = isHide
  },
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
