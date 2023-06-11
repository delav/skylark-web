import {deepCopy} from "@/utils/dcopy";

const getTreeState = () => {
  return {
    projectId: '',
    projectName: '',
    hideTree: false,
    treeId: '',
    detailType: 0,
    nodeCategory: '',
    currentNodeId: '',
    selectedNode: {},
    checkedNodes: [],
    copiedNode: {}
  }
}

const state = getTreeState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getTreeState())
  },
  RELOAD_STATE: (state) => {
    if (state.copiedNode.length === 0) {
      Object.assign(state, getTreeState())
    } else {
      const cpNode = deepCopy(state.copiedNode)
      Object.assign(state, getTreeState())
      state.copiedNode = cpNode
    }
  },
  SET_PROJECT_ID: (state, projectId) => {
    state.projectId = projectId
  },
  SET_PROJECT_NAME: (state, projectName) => {
    state.projectName = projectName
  },
  SET_HIDE_TREE: (state, isHide) => {
    state.hideTree = isHide
  },
  SET_TREE_ID: (state, treeId) => {
    state.treeId = treeId
  },
  SET_CURRENT_NODE_ID: (state, nodeId) => {
    state.currentNodeId = nodeId
  },
  SET_SELECT_NODE: (state, node) => {
    state.selectedNode = node
  },
  SET_DETAIL_TYPE: (state, typeNum) => {
    state.detailType = typeNum
  },
  SET_NODE_CATEGORY: (state, category) => {
    state.nodeCategory = category
  },
  SET_CHECKED_NODES: (state, nodes) => {
    state.checkedNodes = nodes
  },
  SET_COPY_NODE: (state, node) => {
    state.copiedNode = node
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
