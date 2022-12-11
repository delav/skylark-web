import { deepCopy } from '@/utils/dcopy'
import { fetchEntities } from '@/api/entity'
import { guid } from '@/utils/other'

const getEntityState = () => {
  return {
    initEntities: [],
    caseEntities: [],
    currentEntity: {},
    entityChange: false,
    copiedEntities: [],
    selectedEntities: [],
  }
}

const state = getEntityState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getEntityState())
  },
  SER_INIT_ENTITIES: (state, entities) => {
    state.initEntities = entities
  },
  SET_CASE_ENTITIES: (state, entities) => {
    state.caseEntities = entities
  },
  SET_CURRENT_ENTITY: (state, entity) => {
    state.currentEntity = entity
  },
  SET_ENTITY_CHANGE: (state, changeFlag) => {
    state.entityChange = changeFlag
  },
  SET_COPY_ENTITIES: (state, entities) => {
    state.copiedEntities = entities
  },
  SET_SELECTED_ENTITIES: (state, entities) => {
    state.selectedEntities = entities
  }
}

const actions = {

  getEntities({ commit, state }, caseId) {
    if (state.copiedEntities.length === 0) {
      commit('RESET_STATE')
    } else {
      const cpEntities = deepCopy(state.copiedEntities)
      commit('RESET_STATE')
      state.copiedEntities = cpEntities
    }
    return new Promise((resolve, reject) => {
      fetchEntities(caseId).then(response => {
        const entityList = response.data
        for (let i = 0; i < entityList.length; i++) {
          entityList[i]['uuid'] = guid()
        }
        commit('SER_INIT_ENTITIES', entityList)
        resolve()
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
