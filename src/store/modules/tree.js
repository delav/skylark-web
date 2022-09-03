

const getTreeState = () => {
  return {
    expandNodes: [],
  }
}

const state = getTreeState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getTreeState())
  },
  SET_EXPAND_NODES: (state, nodeId) => {
    state.expandNodes.push(nodeId)
  },
  GET_EXPAND_NODES: (state) => {
    return state.expandNodes
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
