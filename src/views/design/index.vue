<template>
  <div class="app-container">
    <toolbar />
    <construct />
  </div>
</template>

<script>
import Toolbar from './components/Toolbar'
import Construct from './components/Construct'
export default {
  components: {
    Toolbar,
    Construct
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
