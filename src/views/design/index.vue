<template>
  <div class="app-container">
    <action-bar />
    <design-area />
  </div>
</template>

<script>
import ActionBar from './components/ActionBar'
import DesignArea from './components/DesignArea'
export default {
  components: {
    ActionBar,
    DesignArea
  },
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
