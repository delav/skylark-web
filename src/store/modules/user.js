import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getUserState = () => {
  return {
    token: getToken(),
    name: '',
    info: {}
  }
}

const state = getUserState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getUserState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_INFO: (state, info) => {
    state.info = info
  }
}

const actions = {
    // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const data = response.data
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.username)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const uid = state.info.id
      getInfo(uid).then(response => {
        const data = response.data
        commit('SET_NAME', data.username)
        const extraData = {
          id: data.id,
          email: data.email
        }
        commit('SET_INFO', extraData)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
