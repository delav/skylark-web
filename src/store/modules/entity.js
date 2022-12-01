const getEntityState = () => {
  return {
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
    const cpEntities = [].concat(JSON.parse(JSON.stringify(state.copiedEntities)))
    Object.assign(state, getEntityState())
    state.copiedEntities = cpEntities
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
