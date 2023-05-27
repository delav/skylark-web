<template>
  <div class="back-header">
    <div class="content">
      <el-page-header @back="backToPlanList">
        <template #content>
          <span class="text-large font-600 mr-3"> {{ title }} </span>
        </template>
      </el-page-header>
    </div>
  </div>
</template>

<script>
import PAGE from "@/constans/build";

export default {
  name: 'BackHeader',
  props: {
    title: String
  },
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
  padding: 10px 0 30px 0;
  max-width: 800px;
  .content {
    height: 50px;
    .back-icon {
      cursor: pointer;
      font-size: 23px;
    }
    .title-text {
      font-size: 16px;
      color: #1fb496;
      text-align: center;
    }
  }
}
</style>
