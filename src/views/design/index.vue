<template>
  <div class="app-container">
    <action />
    <editor />
  </div>
</template>

<script>
import Action from "@/views/design/action";
import Editor from "@/views/design/editor";

export default {
  name: 'Design',
  components: {
    Action,
    Editor
  },
  mounted() {
    this.$store.dispatch('base/getBaseInfo')
  },
  unmounted() {
    this.$store.commit('action/RESET_STATE')
    this.$store.commit('tree/RESET_STATE')
    this.$store.commit('entity/RESET_STATE')
    this.$store.commit('file/RESET_STATE')
    this.$store.commit('base/RESET_STATE')
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
