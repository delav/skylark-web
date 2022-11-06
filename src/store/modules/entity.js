const getEntityState = () => {
  return {
    keywordsObject: {},
    currentEntity: {},
    caseEntityChange: false
  }
}

const state = getEntityState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getEntityState())
  },
  SET_CURRENT_ENTITY: (state, entity) => {
    state.currentEntity = entity
  },
  SET_KEYWORDS_OBJECT: (state, keywordObj) => {
    state.keywordsObject = keywordObj
  },
  SET_CASE_CHANGE: (state, changeFlag) => {
    state.caseEntityChange = changeFlag
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
