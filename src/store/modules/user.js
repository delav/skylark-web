import { login, register, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import { setLang, getLang } from "@/utils/local";

const getUserState = () => {
  return {
    token: getToken(),
    name: '',
    info: {},
    lang: getLang()
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
  },
  SET_LANG: (state, lang) => {
    setLang(lang)
    state.lang = lang
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      const data = {
        'username': username,
        'password': password
      }
      login(data).then(response => {
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
  register({ commit }, userInfo) {
    const { username, password, confirmPassword } = userInfo
    return new Promise((resolve, reject) => {
      const data = {
        'username': username.trim(),
        'password': password,
        'confirm_password': confirmPassword
      }
      register(data).then(response => {
        const data = response.data
        commit('SET_NAME', data.username)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
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
  logout({ commit }) {
    removeToken()
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    removeToken()
    commit('RESET_STATE')
  }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
