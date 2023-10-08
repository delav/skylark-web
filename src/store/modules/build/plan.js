import { fetchInstantlyPlans } from "@/api/plan";

const getPlanState = () => {
  return {
    instantlyPlans: []
  }
}

const state = getPlanState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getPlanState())
  },
  SET_INSTANTLY_PLANS: (state, planArr) => {
    state.instantlyPlans = planArr
  }
}

const actions = {
  getInstantlyPlanList({ commit }) {
    return new Promise((resolve, reject) => {
      fetchInstantlyPlans(10).then(response => {
        commit('SET_INSTANTLY_PLANS', response.data)
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
