<template>
  <div class="build-plan">
    <plan-list v-if="showPlanList" />
    <plan-new v-else-if="showPlanNew" />
    <plan-detail v-else-if="showPlanDetail" />
    <plan-edit v-else-if="showPlanEdit" />
  </div>
</template>

<script>
import PAGE from "@/constans/build";
import PlanList from "@/views/build/plan/PlanList";
import PlanNew from "@/views/build/plan/PlanNew";
import PlanDetail from "@/views/build/plan/PlanDetail";
import PlanEdit from "@/views/build/plan/PlanEdit";

export default {
  name: 'BuildPlan',
  components: {
    PlanList,
    PlanNew,
    PlanDetail,
    PlanEdit,
  },
  computed: {
    showPlanList() {
      return this.$store.state.plan.planPage === PAGE.PageType.LIST
    },
    showPlanNew() {
      return this.$store.state.plan.planPage === PAGE.PageType.CREATE
    },
    showPlanDetail() {
      return this.$store.state.plan.planPage === PAGE.PageType.DETAIL
    },
    showPlanEdit() {
      return this.$store.state.plan.planPage === PAGE.PageType.UPDATE
    }
  },
}
</script>

<style scoped>

</style>
