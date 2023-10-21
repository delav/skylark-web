import { fetchBaseInfo } from "@/api/base";
import { fetchProjectList } from "@/api/project";
import { getUsers } from "@/api/user";

const getBaseState = () => {
  return {
    baseLoaded: false,
    projectList: [],
    globalProject: '',
    envList: [],
    regionList: [],
    projectMap: {},
    envMap: {},
    regionMap: {},
    showRegion: false,
    containAllProjectList: [],
    containAllEnvList: [],
    containAllRegionList: [],
    userList: [],
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
  SET_GLOBAL_PROJECT: (state, projectId) => {
    state.globalProject = projectId
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
  },
  SET_USER_LIST: (state, array) => {
    state.userList = array
  }
}

const actions = {
  getProjectList({ commit }) {
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
  getBaseInfo({ dispatch, commit }) {
    if (state.baseLoaded) {
      return
    }
    dispatch('getUserList')
    return new Promise((resolve, reject) => {
      fetchBaseInfo().then(response => {
        const baseInfo = response.data
        const projectArr = baseInfo['project_list']
        const allItemProjectList = [
          {id: 0, name: 'ALL'}
        ]
        commit('SET_PROJECT_LIST', projectArr)
        let _project_map = {}
        for (let i = 0; i < projectArr.length; i++) {
          _project_map[projectArr[i]['id']] = projectArr[i]['name']
          allItemProjectList.push(projectArr[i])
        }
        commit('SET_PROJECT_MAP', _project_map)
        commit('SET_ALL_PROJECT_LIST', allItemProjectList)
        const envArr = baseInfo['env_list']
        const allItemEnvList = [
          {id: 0, name: 'ALL'}
        ]
        commit('SET_ENV_LIST', envArr)
        let _env_map = {}
        for (let i = 0; i < envArr.length; i++) {
          _env_map[envArr[i]['id']] = envArr[i]['name']
          allItemEnvList.push(envArr[i])
        }
        commit('SET_ENV_MAP', _env_map)
        commit('SET_ALL_ENV_LIST', allItemEnvList)
        const regionArr = baseInfo['region_list']
        const allItemRegionList = [
          {id: 0, name: 'ALL'}
        ]
        commit('SET_REGION_LIST', regionArr)
        let _region_map = {}
        for (let i = 0; i < regionArr.length; i++) {
          _region_map[regionArr[i]['id']] = regionArr[i]['name']
          allItemRegionList.push(regionArr[i])
        }
        commit('SET_REGION_MAP', _region_map)
        commit('SET_ALL_REGION_LIST', allItemRegionList)
        if (regionArr.length !== 0) {
          commit('SET_SHOW_REGION', true)
        }
        commit('SET_BASE_LOADED', true)
        resolve(baseInfo)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUserList({ commit }) {
    return new Promise((resolve, reject) => {
      getUsers().then(response => {
        commit('SET_USER_LIST', response.data)
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
