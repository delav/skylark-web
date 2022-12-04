const getExecuteState = () => {
  return {
    isRunning: false,
    runFinish: false,
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
  SET_RUN_FINISH: (state, finFlag) => {
    state.runFinish = finFlag
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
