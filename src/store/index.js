import { createStore } from "vuex"
import getters from "@/store/getters";
import user from "@/store/modules/user";
import base from "@/store/modules/base";
import tree from "@/store/modules/design/tree";
import entity from "@/store/modules/design/entity";
import file from "@/store/modules/design/virfile";
import keyword from "@/store/modules/design/keyword";
import action from "@/store/modules/design/action";
import page from "@/store/modules/build/page";
import plan from "@/store/modules/build/plan";
import record from "@/store/modules/build/record";
import scalar from "@/store/modules/scalar";

const store = createStore({
    modules: {
      user,
      base,
      tree,
      entity,
      file,
      keyword,
      action,
      page,
      plan,
      record,
      scalar,
    },
    getters
})

export default store
