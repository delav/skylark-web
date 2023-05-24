import axios from "axios";
import { fetchProjectList } from "@/api/project";
import { fetchEnvs } from "@/api/env";
import { fetchRegions } from "@/api/region";


const getProjectState = () => {
  return {
    baseLoaded: false,
    projectList: [],
    envList: [],
    regionList: [],
    projectMap: {},
    envMap: {},
    regionMap: {},
    showRegion: false,
  }
}

const state = getProjectState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getProjectState())
  },
  SET_BASE_LOADED: (state, flag) => {
    state.baseLoaded = flag
  },
  SET_PROJECT_LIST: (state, projectArray) => {
    state.projectList = projectArray
  },
  SET_ENV_LIST: (state, evnArray) => {
    state.envList = evnArray
  },
  SET_REGION_LIST: (state, regionArray) => {
    state.regionList = regionArray
  },
  SET_SHOW_REGION: (state, flag) => {
    state.showRegion = flag
  },
  SET_PROJECT_MAP: (state, projectDict) => {
    state.projectMap = projectDict
  },
  SET_ENV_MAP: (state, envDict) => {
    state.envMap = envDict
  },
  SET_REGION_MAP: (state, regionDict) => {
    state.regionMap = regionDict
  }
}

const actions = {
  getProjects({ commit }) {
    return new Promise((resolve, reject) => {
      fetchProjectList().then(response => {
        const projectArr = response.data
        commit('SET_PROJECT_LIST', projectArr)
        let _map = {}
        for (let i = 0; i < projectArr.length; i++) {
          _map[projectArr[i]['id']] = projectArr[i]['name']
        }
        commit('SET_PROJECT_MAP', _map)
        resolve(projectArr)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getEnvironments({ commit }) {
    return new Promise((resolve, reject) => {
      fetchEnvs().then(response => {
        const envArr = response.data
        commit('SET_ENV_LIST', envArr)
        let _map = {}
        for (let i = 0; i < envArr.length; i++) {
          _map[envArr[i]['id']] = envArr[i]['name']
        }
        commit('SET_ENV_MAP', _map)
        resolve(envArr)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getRegions({ commit }) {
    return new Promise((resolve, reject) => {
      fetchRegions().then(response => {
        const regionArr = response.data
        commit('SET_REGION_LIST', regionArr)
        let _map = {}
        for (let i = 0; i < regionArr.length; i++) {
          _map[regionArr[i]['id']] = regionArr[i]['name']
        }
        commit('SET_REGION_MAP', _map)
        if (regionArr.length !== 0) {
          commit('SET_SHOW_REGION', true)
        }
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getBaseInfo({ dispatch, commit }) {
    axios.all([
      dispatch('getProjects'),
      dispatch('getEnvironments'),
      dispatch('getRegions')
    ]).then(
      axios.spread(() => {
        commit('SET_BASE_LOADED', true)
      })
    )
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
