import { fetchFileContent } from '@/api/virfile'

const getFileState = () => {
  return {
    fileContent: {}
  }
}

const state = getFileState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getFileState())
  },
  SET_FILE_CONTENT: (state, content) => {
    state.fileContent = content
  }
}

const actions = {

  getFileContent({ commit }, suiteId) {
    commit('RELOAD_STATE')
    return new Promise((resolve, reject) => {
      fetchFileContent(suiteId).then(response => {
        commit('SET_FILE_CONTENT', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
