const getRecordState = () => {
  return {
    changeFlag: '',
    recordData: {},
  }
}

const state = getRecordState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getRecordState())
  },
  SET_CHANGE_FLAG: (state, flag) => {
    state.changeFlag = flag
  },
  SET_RECORD_DATA: (state, data) => {
    state.recordData = data
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
