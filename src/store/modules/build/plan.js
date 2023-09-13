import { fetchInstantlyPlans } from "@/api/plan";

const getPlanState = () => {
  return {
    planPage: 0,
    changeFlag: '',
    planData: {},
    instantlyPlans: []
  }
}

const state = getPlanState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getPlanState())
  },
  SET_PLAN_PAGE: (state, pageType) => {
    state.planPage = pageType
  },
  SET_CHANGE_FLAG: (state, flag) => {
    state.changeFlag = flag
  },
  SET_PLAN_DATA: (state, data) => {
    state.planData = data
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
