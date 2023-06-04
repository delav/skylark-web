import { fetchPriorities } from "@/api/priority";
import { fetchTagsByProject } from "@/api/tag";

const getScalarState = () => {
  return {
    projectTags: [],
    priorities: [],
    priorityMap: {}
  }
}

const state = getScalarState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getScalarState())
  },
  SET_PROJECT_TAGS: (state, tags) => {
    state.projectTags = tags
  },
  SET_CASE_PRIORITY: (state, priorities) => {
    state.priorities = priorities
  },
  SET_PRIORITY_MAP: (state, priorityDict) => {
    state.priorityMap = priorityDict
  }
}

const actions = {
  getPriorities({ commit }) {
    return new Promise((resolve, reject) => {
      fetchPriorities().then(response => {
        const priArr = response.data
        commit('SET_CASE_PRIORITY', priArr)
        let _map = {}
        for (let i = 0; i < priArr.length; i++) {
          _map[priArr[i]['id']] = priArr[i]['name']
        }
        commit('SET_PRIORITY_MAP', _map)
        resolve(priArr)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getProjectTags({ commit }, projectId) {
    return new Promise((resolve, reject) => {
      fetchTagsByProject(projectId).then(response => {
        const tagArr = response.data
        commit('SET_PROJECT_TAGS', tagArr)
        resolve(tagArr)
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
