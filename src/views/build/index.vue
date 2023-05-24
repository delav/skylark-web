<template>
  <div class="build">
    <div class="record">
      <build-record />
    </div>
    <div class="plan">
      <build-plan />
    </div>
  </div>
</template>

<script>
import BuildRecord from "@/views/build/record";
import BuildPlan from "@/views/build/plan";


export default {
  name: 'Build',
  components: {
    BuildRecord,
    BuildPlan,
  },
  created() {
    this.$store.dispatch('base/getBaseInfo')
  },
  unmounted() {
    this.$store.commit('base/RESET_STATE')
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.build {
  width: 100%;
  height: 100%;
  display: flex;
  .record {
    height: 100%;
    width: 298px;
    border-right: 2px solid #000;
  }
  .plan {
    height: 100%;
    width: calc(100% - 300px);
    min-width: 500px;
  }
}
</style>
