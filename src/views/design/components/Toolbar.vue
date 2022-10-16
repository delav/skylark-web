<template>
  <div class="actionbar">
    <svg-icon icon-class="run"></svg-icon>
    <svg-icon icon-class="stop"></svg-icon>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'ActionBar',
  components: { SvgIcon },
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.scss";

.actionbar {
  height: $toolbarHeight;
  background-color: $toolbarBg;
  .svg-icon {
    width: 22px;
    height: 22px;
    margin-top: 4px;
    margin-left: 10px;
    color: #888888;
  }
}
</style>
