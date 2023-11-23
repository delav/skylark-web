const getExecuteState = () => {
  return {
    currentEnv: '',
    currentRegion: '',
    isRunning: false,
    runFinish: false,
    executeParams: '',
  }
}

const state = getExecuteState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getExecuteState())
  },
  SET_CURRENT_ENV: (state, envId) => {
    state.currentEnv = envId
  },
  SET_CURRENT_REGION: (state, regionId) => {
    state.currentRegion = regionId
  },
  SET_RUNNING: (state, runFlag) => {
    state.isRunning = runFlag
  },
  SET_RUN_FINISH: (state, finishFlag) => {
    state.runFinish = finishFlag
  },
  SET_EXECUTE_PARAMS: (state, varParams) => {
    state.executeParams = varParams
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
