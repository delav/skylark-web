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
  margin-right: auto;
  position: absolute;
  border: 0;
  top: 0;
  left: 0;
  .navbar-logo {
    width: auto;
    height: 45px;
    margin-left: 5px;
  }
}
</style>
