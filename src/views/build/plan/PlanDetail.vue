<template>
  <div class="plan-detail">
    <div class="head">
      计划详情
    </div>
    <div class="body">
      {{formData}}
    </div>
  </div>
</template>

<script>
import { getPlanDetail } from "@/api/plan";

export default {
  name: 'PlanDetail',
  data() {
    return {
      formData: {}
    }
  },
  methods: {
    getPlanDetailByPlanId() {
      getPlanDetail(1).then(response => {
        this.formData = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-detail {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  padding: 5px;
  max-width: 800px;
  .head {
    height: 50px;
    padding: 5px 0;
    .back-icon {
      cursor: pointer;
      font-size: 23px;
    }
  }
  .body {
    width: 100%;
    .operate-button {
      float: right;
      margin-top: 20px;
      .create-button {
        margin-left: 25px;
      }
    }
  }
}
</style>
