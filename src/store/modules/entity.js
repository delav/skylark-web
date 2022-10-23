const getEntityState = () => {
  return {
    currentEntity: {},
    selectedEntities: [],
  }
}

const state = getEntityState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getEntityState())
  },

  SET_SELECTED_ENTITIES: (state, entity) => {
    state.currentEntity = entity
    let isExist = false
    let existIndex = 0
    for (let i = 0; i < state.selectedEntities.length; i++) {
      if (state.selectedEntities[i].id === entity.id) {
        existIndex = i
        isExist = true
      }
    }
    if (isExist) {
      state.selectedEntities.splice(existIndex, 1)
    } else {
      state.selectedEntities.append(entity)
    }
  },
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
