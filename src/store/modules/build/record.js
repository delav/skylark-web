import { fetchRecords } from "@/api/record";

const getRecordState = () => {
  return {
    recentlyRecords: []
  }
}

const state = getRecordState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getRecordState())
  },
  SET_RECENTLY_RECORDS: (state, recordArr) => {
    state.recentlyRecords = recordArr
  }
}

const actions = {
  getRecentlyRecordList({ commit }) {
    return new Promise((resolve, reject) => {
      fetchRecords(1,10).then(response => {
        commit('SET_RECENTLY_RECORDS', response.data.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
