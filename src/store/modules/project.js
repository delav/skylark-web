

const getProjectState = () => {
  return {
    projectList: [],
  }
}

const state = getProjectState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getProjectState())
  },
  SET_PROJECT_LIST: (state, projects) => {
    state.projectList = projects
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
