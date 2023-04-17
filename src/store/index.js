import { createStore } from 'vuex'
import getters from './getters'
import user from './modules/user'
import base from './modules/base'
import tree from './modules/design/tree'
import entity from './modules/design/entity'
import keyword from './modules/design/keyword'
import action from './modules/design/action'
import plan from './modules/build/plan'
import record from './modules/build/record'

const store = createStore({
    modules: {
      user,
      base,
      tree,
      entity,
      keyword,
      action,
      plan,
      record,
    },
    getters
})

export default store
