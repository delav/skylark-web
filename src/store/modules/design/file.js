import { fetchFileContent } from "@/api/file";
import { guid } from "@/utils/other";

const getFileState = () => {
  return {
    fileContent: {},
    syncFileFlag: false
  }
}

const state = getFileState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getFileState())
  },
  SET_FILE_CONTENT: (state, content) => {
    state.fileContent = content
  },
  SET_FILE_SYNC_FLAG: (state, flag) => {
    state.syncFileFlag = flag
  }
}

const actions = {

  getFileContent({ commit }, suiteId) {
    commit('RESET_STATE')
    return new Promise((resolve, reject) => {
      fetchFileContent(suiteId).then(response => {
        commit('SET_FILE_CONTENT', response.data)
        commit('SET_FILE_SYNC_FLAG', guid())
        resolve()
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
