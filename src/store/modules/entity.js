const getEntityState = () => {
  return {
    currentEntity: {},
    entityChange: false
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
  SET_CASE_CHANGE: (state, changeFlag) => {
    state.entityChange = changeFlag
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
