const getExecuteState = () => {
  return {
    isRunning: false,
  }
}

const state = getExecuteState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getExecuteState())
  },
  SET_RUNNING: (state, runFlag) => {
    state.isRunning = runFlag
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
