import axios from "axios";
import { fetchProjectList } from "@/api/project";
import { fetchEnvs } from "@/api/env";
import { fetchRegions } from "@/api/region";


const getBaseState = () => {
  return {
    baseLoaded: false,
    projectList: [],
    envList: [],
    regionList: [],
    projectMap: {},
    envMap: {},
    regionMap: {},
    showRegion: false,
    containAllProjectList: [],
    containAllEnvList: [],
    containAllRegionList: [],
    sysNoticeList: [
      {'title': '关于平台新功能通知', 'content': '平台新增了版本控制功能，欢迎大家体验', 'new': true},
      {'title': '关于平台维护时间通知', 'content': '由于升级更新功能，平台于2023-09-18 16:30:00起维护，届时平台将不可用，预计1小时', 'new': true}
    ]
  }
}

const state = getBaseState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getBaseState())
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
  },
  SET_ALL_PROJECT_LIST: (state, array) => {
    state.containAllProjectList = array
  },
  SET_ALL_ENV_LIST: (state, array) => {
    state.containAllEnvList = array
  },
  SET_ALL_REGION_LIST: (state, array) => {
    state.containAllRegionList = array
  }
}

const actions = {
  getProjects({ commit }) {
    return new Promise((resolve, reject) => {
      fetchProjectList().then(response => {
        const projectArr = response.data
        const allItemList = [
          {id: 0, name: 'ALL'}
        ]
        commit('SET_PROJECT_LIST', projectArr)
        let _map = {}
        for (let i = 0; i < projectArr.length; i++) {
          _map[projectArr[i]['id']] = projectArr[i]['name']
          allItemList.push(projectArr[i])
        }
        commit('SET_PROJECT_MAP', _map)
        commit('SET_ALL_PROJECT_LIST', allItemList)
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
        const allItemList = [
          {id: 0, name: 'ALL'}
        ]
        commit('SET_ENV_LIST', envArr)
        let _map = {}
        for (let i = 0; i < envArr.length; i++) {
          _map[envArr[i]['id']] = envArr[i]['name']
          allItemList.push(envArr[i])
        }
        commit('SET_ENV_MAP', _map)
        commit('SET_ALL_ENV_LIST', allItemList)
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
        const allItemList = [
          {id: 0, name: 'ALL'}
        ]
        commit('SET_REGION_LIST', regionArr)
        let _map = {}
        for (let i = 0; i < regionArr.length; i++) {
          _map[regionArr[i]['id']] = regionArr[i]['name']
          allItemList.push(regionArr[i])
        }
        commit('SET_REGION_MAP', _map)
        commit('SET_ALL_REGION_LIST', allItemList)
        if (regionArr.length !== 0) {
          commit('SET_SHOW_REGION', true)
        }
        resolve(regionArr)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getBaseInfo({ dispatch, commit }) {
    if (state.baseLoaded) {
      return
    }
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
