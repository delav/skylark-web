const getPageState = () => {
  return {
    detailPage: 0,
    prePage: '',
  }
}

const state = getPageState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getPageState())
  },
  SET_DETAIL_PAGE: (state, pageType) => {
    state.detailPage = pageType
  },
  SET_PRE_PAGE: (state, pageType) => {
    state.prePage = pageType
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
