<template>
  <div class="const">
    <div class="header"></div>
    <div class="content">
      <code-viewer />
    </div>
  </div>
</template>

<script>
import CodeViewer from './components/CodeViewer'

export default {
  name: 'Const',
  components: {
    CodeViewer
  }
}
</script>

<style scoped>

</style>
