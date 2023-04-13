import { fetchProjectList } from '@/api/project'
import { fetchEnvs } from '@/api/env'
import { fetchRegions } from '@/api/region'


const getProjectState = () => {
  return {
    projectList: [],
    envList: [],
    regionList: []
  }
}

const state = getProjectState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getProjectState())
  },
  SET_PROJECT_LIST: (state, projectArray) => {
    state.projectList = projectArray
  },
  SET_ENV_LIST: (state, evnArray) => {
    state.envList = evnArray
  },
  SET_REGION_LIST: (state, regionArray) => {
    state.regionList = regionArray
  }
}

const actions = {
  getProjects({ commit }) {
    return new Promise((resolve, reject) => {
      fetchProjectList().then(response => {
        commit('SET_PROJECT_LIST', response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getEnvironments({ commit }) {
    return new Promise((resolve, reject) => {
      fetchEnvs().then(response => {
        commit('SET_ENV_LIST', response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getRegions({commit}) {
    return new Promise((resolve, reject) => {
      fetchRegions().then(response => {
        commit('SET_REGION_LIST', response.data)
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
