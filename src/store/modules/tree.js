

const getTreeState = () => {
  return {
    projectId: null,
    hideTree: false,
  }
}

const state = getTreeState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getTreeState())
  },
  SET_CURRENT_PROJECT: (state, projectId) => {
    state.projectId = projectId
  },
  SET_HIDE_TREE: (state, isHide) => {
    state.hideTree = isHide
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
