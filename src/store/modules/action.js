const getExecuteState = () => {
  return {
    isRunning: false,
    runFinish: false
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
  SET_RUN_FINISH: (state, finishFlag) => {
    state.runFinish = finishFlag
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
