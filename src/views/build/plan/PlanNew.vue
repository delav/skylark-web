<template>
  <div class="create-plan">
    <div class="head">
      <back-header title="创建计划" />
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
import BackHeader from "@/views/build/components/BackHeader";
import PlanForm from "@/views/build/plan/components/PlanForm";
import { createPlan } from "@/api/plan";

export default {
  name: 'PlanNew',
  components: {
    BackHeader,
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
.create-plan {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  padding: 5px;
  max-width: 800px;
}
</style>
