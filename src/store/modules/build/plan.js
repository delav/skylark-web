const getPlanState = () => {
  return {
    planPage: 0,
    changeFlag: '',
    planData: {},
  }
}

const state = getPlanState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getPlanState())
  },
  SET_PLAN_PAGE: (state, pageType) => {
    state.planPage = pageType
  },
  SET_CHANGE_FLAG: (state, flag) => {
    state.changeFlag = flag
  },
  SET_PLAN_DATA: (state, data) => {
    state.planData = data
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
