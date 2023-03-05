import { fetchEnvs } from '@/api/env'
import {fetchProjectList} from '@/api/project'


const getProjectState = () => {
  return {
    projectId: '',
    projectName: '',
    envList: [],
    projectList: [],
    currentEnv: '',
  }
}

const state = getProjectState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getProjectState())
  },
  SET_PROJECT_ID: (state, projectId) => {
    state.projectId = projectId
  },
  SET_PROJECT_NAME: (state, projectName) => {
    state.projectName = projectName
  },
  SET_ENV_LIST: (state, evnArray) => {
    state.envList = evnArray
  },
  SET_PROJECT_LIST: (state, projects) => {
    state.projectList = projects
  },
  SET_CURRENT_ENV: (state, envId) => {
    state.currentEnv = envId
  }
}

const actions = {
  // get environment
  setenv({ commit }) {
    return new Promise((resolve, reject) => {
      fetchEnvs().then(response => {
        const data = response.data
        let hadDefault = false
        for (let i = 0; i < data.length; i++) {
          if (data[i]['default'] === true) {
            hadDefault = true
            commit('SET_CURRENT_ENV', data[i]['id'])
            break
          }
        }
        if (!hadDefault) {
          commit('SET_CURRENT_ENV', data[0]['id'])
        }
        commit('SET_ENV_LIST', data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getProjects({ commit }) {
    return new Promise((resolve, reject) => {
      fetchProjectList().then(response => {
        commit('SET_PROJECT_LIST', response.data)
        resolve(response.data)
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
