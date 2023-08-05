<template>
  <div class="plan-create">
    <div class="content">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>创建计划</span>
          </div>
        </template>
        <div class="card-body">
          <plan-form
            @confirmAction="createBuildPlan"
            @confirmAndBuildAction="createAndBuildPlan"
          />
        </div>
      </el-card>
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
  width: 100%;
  height: 100%;
  padding: 5px;
  .content {
    height: 100%;
    min-height: 600px;
    min-width: 500px;
    .box-card {
      height: 100%;
    }
  }
}
</style>
