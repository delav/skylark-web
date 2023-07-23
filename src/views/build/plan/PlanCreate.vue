<template>
  <div class="plan-create">
    <div class="head">
      创建计划
    </div>
    <div class="body">
      <plan-form
        @confirmAction="createBuildPlan"
        @confirmAndBuildAction="createAndBuildPlan"
      />
    </div>
  </div>
</template>

<script>
import PAGE from "@/constans/build";
import PlanForm from "@/views/build/plan/components/PlanForm";
import { createPlan } from "@/api/plan";

export default {
  name: 'PlanCreate',
  components: {
    PlanForm,
  },
  methods: {
    createBuildPlan(planData) {
      createPlan(planData).then(() => {
        this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.LIST)
        this.$message.success('创建计划成功')
      })
    },
    createAndBuildPlan() {}
  }
}
</script>

<style lang="scss" scoped>
.plan-create {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  padding: 5px;
  max-width: 800px;
}
</style>
