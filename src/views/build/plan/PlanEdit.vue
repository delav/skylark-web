<template>
  <div class="create-plan">
    <div class="head">
      更新计划
    </div>
    <div class="body">
      <plan-form
        @confirmAction="updateBuildPlan"
        @confirmAndBuildAction="updateAndBuildPlan"
      />
    </div>
  </div>
</template>

<script>
import PAGE from "@/constans/build";
import PlanForm from "@/views/build/plan/components/PlanForm";
import { updatePlan } from "@/api/plan";

export default {
  name: 'PlanNew',
  components: {
    PlanForm,
  },
  methods: {
    updateBuildPlan(planData) {
      updatePlan(planData).then(() => {
        this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.LIST)
        this.$message.success('更新计划成功')
      })
    },
    updateAndBuildPlan() {}
  }
}
</script>

<style lang="scss" scoped>
.create-plan {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  padding: 5px;
  max-width: 800px;
}
</style>
