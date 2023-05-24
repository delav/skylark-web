<template>
  <div class="plan-edit">
    <div class="head">
      <back-header />
    </div>
    <div class="body">
      edit
    </div>
  </div>
</template>

<script>
import PAGE from "@/constans/build";
import BackHeader from "@/views/build/plan/components/BackHeader";

export default {
  name: 'PlanEdit',
  components: {
    BackHeader
  },
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
