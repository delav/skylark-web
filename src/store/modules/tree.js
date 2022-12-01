

const getTreeState = () => {
  return {
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
  SET_HIDE_TREE: (state, isHide) => {
    state.hideTree = isHide
  },
  SET_DETAIL_TYPE: (state, typeNum) => {
    state.detailType = typeNum
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
