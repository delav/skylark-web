

const getTreeState = () => {
  return {
    projectId: 0,
    hideTree: false,
    detailType: 1,
    nodeData: {}
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
  },
  SET_DETAIL_TYPE: (state, dtType) => {
    state.detailType = dtType
  },
  SET_NODE_DATA: (state, data) => {
    state.nodeData = data
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