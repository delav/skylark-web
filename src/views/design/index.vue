<template>
  <div class="app-container">
    <action />
    <editor />
  </div>
</template>

<script>
import Action from './action'
import Editor from './editor'

export default {
  name: 'Design',
  components: {
    Action,
    Editor
  },
  created() {
    this.$store.dispatch('project/getProjects')
    this.$store.dispatch('project/getEnvironments')
    this.$store.dispatch('project/getRegions')
  },
  unmounted() {
    this.$store.commit('action/RESET_STATE')
    this.$store.commit('tree/RESET_STATE')
    this.$store.commit('entity/RESET_STATE')
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
