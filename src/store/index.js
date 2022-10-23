import { createStore } from 'vuex'
import getters from './getters'
import user from './modules/user'
import tree from './modules/tree'
import project from './modules/project'
import entity from './modules/entity'

const store = createStore({
    modules: {
      user,
      tree,
      project,
      entity,
    },
    getters
})

export default store
