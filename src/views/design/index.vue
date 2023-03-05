<template>
  <div class="app-container">
    <action-bar />
    <design-editor />
  </div>
</template>

<script>
import ActionBar from './actionbar'
import DesignEditor from './editor'

export default {
  name: 'Design',
  components: {
    ActionBar,
    DesignEditor
  },
  created() {
    this.$store.dispatch('project/setenv')
    this.$store.dispatch('project/getProjects')
  },
  unmounted() {
    this.$store.commit('action/RESET_STATE')
    this.$store.commit('tree/RESET_STATE')
    this.$store.commit('entity/RESET_STATE')
    this.$store.commit('project/RESET_STATE')
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
