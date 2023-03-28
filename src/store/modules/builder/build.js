const getBuildState = () => {
  return {
    rightPage: 3,
  }
}

const state = getBuildState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getBuildState())
  },
  SET_RIGHT_PAGE: (state, pageType) => {
    state.rightPage = pageType
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
