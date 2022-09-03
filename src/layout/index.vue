<template>
  <div class="app-wrapper">
    <div class="navbar-container">
      <navbar />
    </div>
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain } from './components'
export default {
  name: 'Layout',
  components: {
    Navbar,
    AppMain,
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
