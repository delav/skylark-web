<template>
  <div class="build">
    <div class="mix-menu">
      <mix-menu />
    </div>
    <div class="page-route">
      <page-route />
    </div>
  </div>
</template>

<script>
import MixMenu from "@/views/build/common/MixMenu";
import PageRoute from "@/views/build/common/PageRoute";

export default {
  name: 'Build',
  components: {
    MixMenu,
    PageRoute,
  },
  created() {
    this.$store.dispatch('base/getBaseInfo')
  },
  unmounted() {
    this.$store.commit('page/RESET_STATE')
    this.$store.commit('plan/RESET_STATE')
    this.$store.commit('record/RESET_STATE')
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
  .mix-menu {
    height: 100%;
    width: 318px;
    border-right: 2px solid #000;
  }
  .page-route {
    height: 100%;
    width: calc(100% - 400px);
    min-width: 500px;
  }
}
</style>
