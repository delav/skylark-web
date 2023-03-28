<template>
  <div class="build">
    <div class="build-list">
      <build-list />
    </div>
    <div class="plan">
      <build-detail v-show="rightPage===2" />
      <plan-list v-show="rightPage===1" />
      <plan-new v-show="rightPage===3" />
    </div>
  </div>
</template>

<script>
import BuildList from './list'
import BuildDetail from './detail'
import PlanList from './plan/plan-list'
import PlanNew from './plan/plan-new'

export default {
  name: 'Build',
  components: {
    BuildList,
    BuildDetail,
    PlanList,
    PlanNew,
  },
  computed: {
    rightPage() {
      return this.$store.state.build.rightPage
    }
  },
  created() {
    this.$store.dispatch('project/getProjects')
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.build {
  width: 100%;
  height: 100%;
  display: flex;
  .build-list {
    height: 100%;
    width: 298px;
    border-right: 2px solid #000;
  }
  .plan {
    height: 100%;
    width: calc(100% - 300px);
  }
}
</style>
