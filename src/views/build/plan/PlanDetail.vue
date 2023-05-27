<template>
  <div class="plan-detail">
    <div class="head">
      <back-header title="计划详情" />
    </div>
    <div class="body">
      {{formData}}
    </div>
  </div>
</template>

<script>
import BackHeader from "@/views/build/components/BackHeader";

export default {
  name: 'PlanDetail',
  components: {
    BackHeader
  },
  data() {
    return {
      formData: {}
    }
  },
  watch: {
    '$store.state.plan.changeFlag': {
      handler() {
        this.formData = this.$store.state.plan.planData
      },
      immediate: true
    },
  },
  methods: {
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
