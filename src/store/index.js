import { createStore } from 'vuex'
import getters from './getters'
import user from './modules/user'
import tree from './modules/tree'
import project from './modules/project'

const store = createStore({
    modules: {
      user,
      tree,
      project,
    },
    getters
})

export default store
