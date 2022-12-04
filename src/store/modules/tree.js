

const getTreeState = () => {
  return {
    hideTree: false,
    detailType: 1,
    selectedNodeId: '',
    nodeDetail: [],
    checkedNodes: []
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
  SET_SELECT_NODE_ID: (state, nid) => {
    state.selectedNodeId = nid
  },
  SET_DETAIL_TYPE: (state, typeNum) => {
    state.detailType = typeNum
  },
  SET_NODE_DETAIL: (state, data) => {
    state.nodeDetail = data
  },
  SET_CHECKED_NODES: (state, nodes) => {
    state.checkedNodes = nodes
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
