<template>
  <div class="plan-edit">
    <div class="back-header">
      <el-icon class="back-icon" @click="backToPlanList"><Back /></el-icon>
    </div>
  </div>
</template>

<script>
import PAGE from '@/constans/build'

export default {
  name: 'PlanEdit',
  data() {
    return {

    }
  },
  methods: {
    backToPlanList () {
      this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.LIST)
    },
  }
}
</script>

<style scoped>

</style>
