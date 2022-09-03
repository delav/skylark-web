import { createStore } from 'vuex'
import getters from './getters'
import user from './modules/user'
import tree from './modules/tree'

const store = createStore({
    modules: {
      user,
      tree
    },
    getters
})

export default store
