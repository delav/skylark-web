import { fetchProjectInfo } from "@/api/base";

const getStatisticsState = () => {
  return {
    departmentList: [],
    groupList: [],
    projectList: [],
    selectedInfo: {}
  }
}

const state = getStatisticsState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getStatisticsState())
  },
  SET_DEPARTMENT_LIST: (state, departmenArr) => {
    state.departmentList = departmenArr
  },
  SET_GROUP_LIST: (state, groupArr) => {
    state.groupList = groupArr
  },
  SET_PROJECT_LIST: (state, projectArr) => {
    state.projectList = projectArr
  },
  SET_SELECT_INFO: (state, info) => {
    state.selectedInfo = info
  }
}

const actions = {
  getProjectInfo({ commit }) {
    return new Promise((resolve, reject) => {
      fetchProjectInfo().then(response => {
        const projectInfo = response.data
        commit('SET_DEPARTMENT_LIST', projectInfo['department_list'])
        commit('SET_GROUP_LIST', projectInfo['group_list'])
        commit('SET_PROJECT_LIST', projectInfo['project_list'])
        resolve(projectInfo)
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
