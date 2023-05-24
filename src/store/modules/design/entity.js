import { deepCopy } from "@/utils/dcopy";
import { fetchEntities } from "@/api/entity";
import { guid } from "@/utils/other";

const getEntityState = () => {
  return {
    caseEntities: [],
    currentEntity: {},
    entityChange: false,
    copiedEntities: [],
    selectedEntities: [],
    syncEntityFlag: '',
  }
}

const state = getEntityState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getEntityState())
  },
  RELOAD_STATE: (state) => {
    if (state.copiedEntities.length === 0) {
      Object.assign(state, getEntityState())
    } else {
      const cpEntities = deepCopy(state.copiedEntities)
      Object.assign(state, getEntityState())
      state.copiedEntities = cpEntities
    }
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
  },
  SET_SYNC_ENTITY_FLAG: (state, flag) => {
    state.syncEntityFlag = flag
  },
}

const actions = {

  getEntities({ commit }, caseId) {
    commit('RELOAD_STATE')
    return new Promise((resolve, reject) => {
      fetchEntities(caseId).then(response => {
        const entityList = response.data
        for (let i = 0; i < entityList.length; i++) {
          entityList[i]['uuid'] = guid()
        }
        commit('SET_CASE_ENTITIES', entityList)
        commit('SET_SYNC_ENTITY_FLAG', guid())
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
