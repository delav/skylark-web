import { createStore } from 'vuex'
import getters from './getters'
import user from './modules/user'
import project from './modules/project'
import tree from './modules/design/tree'
import entity from './modules/design/entity'
import keyword from './modules/design/keyword'
import action from './modules/design/action'
import build from './modules/builder/build'

const store = createStore({
    modules: {
      user,
      project,
      tree,
      entity,
      keyword,
      action,
      build,
    },
    getters
})

export default store
