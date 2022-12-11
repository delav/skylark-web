<template>
  <div>{{ cateInfo }}</div>
</template>

<script>
export default {
  name: 'Category',
  data() {
    return {
      cateInfo: {}
    }
  },
  watch: {
    '$store.state.tree.selectedNode': {
      handler() {
        this.cateInfo = this.$store.state.tree.selectedNode.meta
      },
      deep: true,
    },
  }
}
</script>

<style scoped>

</style>
