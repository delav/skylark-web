const getExecuteState = () => {
  return {
    canRun: false,
    canStop: false,
    seeLog: false,
  }
}

const state = getExecuteState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getExecuteState())
  },
  SET_CAN_RUN: (state, runFlag) => {
    state.canRun = runFlag
  },
  SET_CAN_STOP: (state, stopFlag) => {
    state.canStop = stopFlag
  },
  SET_SEE_LOG: (state, seeFlag) => {
    state.seeLog = seeFlag
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
