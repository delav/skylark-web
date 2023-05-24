<template>
  <div class="back-header">
    <div class="content">
      <el-icon class="back-icon" @click="backToPlanList"><Back /></el-icon>
    </div>
  </div>
</template>

<script>
import PAGE from "@/constans/build";

export default {
  name: 'BackHeader',
  methods: {
    backToPlanList () {
      this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.LIST)
    },
  }
}
</script>

<style lang="scss" scoped>
.back-header {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  padding: 5px;
  max-width: 800px;
  .content {
    height: 50px;
    padding: 5px 0;
    .back-icon {
      cursor: pointer;
      font-size: 23px;
    }
  }
}
</style>
