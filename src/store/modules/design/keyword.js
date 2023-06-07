const getKeywordState = () => {
  return {
    keywordObjects: {},
    hideKeyword: false,
    updateUserKeyword: ''
  }
}

const state = getKeywordState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getKeywordState())
  },
  SET_KEYWORD_OBJECTS: (state, keywordObj) => {
    state.keywordObjects = keywordObj
  },
  SET_HIDE_KEYWORD: (state, isHide) => {
    state.hideKeyword = isHide
  },
  SET_UPDATE_USER_KEYWORD: (state, flag) => {
    state.updateUserKeyword = flag
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
