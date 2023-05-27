<template>
  <div class="build-plan">
    <quick-build v-if="showQuickBuild" />
    <plan-list v-else-if="showPlanList" />
    <record-list v-else-if="showRecordList" />
    <plan-new v-else-if="showPlanNew" />
    <plan-detail v-else-if="showPlanDetail" />
    <plan-edit v-else-if="showPlanEdit" />
    <record-detail v-else-if="showRecordDetail" />
  </div>
</template>

<script>
import PAGE from "@/constans/build";
import QuickBuild from "@/views/build/components/QuickBuild";
import PlanList from "@/views/build/plan/PlanList";
import RecordList from "@/views/build/record/RecordList";
import PlanNew from "@/views/build/plan/PlanNew";
import PlanDetail from "@/views/build/plan/PlanDetail";
import PlanEdit from "@/views/build/plan/PlanEdit";
import RecordDetail from "@/views/build/record/RecordDetail";

export default {
  name: 'BuildPlan',
  components: {
    QuickBuild,
    PlanList,
    RecordList,
    PlanNew,
    PlanDetail,
    PlanEdit,
    RecordDetail,
  },
  computed: {
    showQuickBuild() {
      return this.$store.state.page.detailPage === PAGE.PageType.QUICKBUILD
    },
    showPlanList() {
      return this.$store.state.page.detailPage === PAGE.PageType.PLANLIST
    },
    showRecordList() {
      return this.$store.state.page.detailPage === PAGE.PageType.RECORDLIST
    },
    showPlanNew() {
      return this.$store.state.page.detailPage === PAGE.PageType.CREATEPLAN
    },
    showPlanDetail() {
      return this.$store.state.page.detailPage === PAGE.PageType.PLANDETAIL
    },
    showPlanEdit() {
      return this.$store.state.plan.planPage === PAGE.PageType.EDITPLAN
    },
    showRecordDetail() {
      return this.$store.state.plan.planPage === PAGE.PageType.RECORDDETAIL
    }
  },
}
</script>

<style scoped>

</style>
