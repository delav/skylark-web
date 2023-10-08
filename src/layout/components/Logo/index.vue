<template>
  <div class="logo">
    <img class="navbar-logo" :src="logo" alt="">
  </div>
</template>

<script>
export default {
  name: 'Logo',
  computed: {
    logo() {
      return require('@/assets/logo.png')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.logo {
  width: $logoWidth;
  text-align: left;
  overflow: hidden;
  .navbar-logo {
    width: auto;
    height: 45px;
    margin-left: 5px;
  }
}
</style>
