import { createStore } from 'vuex'
import getters from './getters'
import user from './modules/user'
import tree from './modules/tree'
import project from './modules/project'
import entity from './modules/entity'
import keyword from './modules/keyword'
import action from './modules/action'

const store = createStore({
    modules: {
      user,
      tree,
      project,
      entity,
      keyword,
      action,
    },
    getters
})

export default store
