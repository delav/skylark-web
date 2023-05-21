<template>
  <div>{{ content }}</div>
</template>

<script>
export default {
  name: 'File',
  data() {
    return {
      content: {}
    }
  },
  watch: {
    '$store.state.file.syncFileFlag': {
      handler() {
        this.content = this.$store.state.file.fileContent
      }
    }
  },
}
</script>

<style scoped>

</style>
