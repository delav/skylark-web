<template>
  <div class="action-bar">
    <svg-icon icon-class="run"></svg-icon>
    <svg-icon icon-class="stop"></svg-icon>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ActionBar',
  components: {
    SvgIcon
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.scss";

.action-bar {
  height: $toolbarHeight;
  background-color: $toolbarBg;
  text-align: center;
  .svg-icon {
    width: 22px;
    height: 22px;
    margin-top: 4px;
    margin-left: 10px;
    color: #888888;
  }
}
</style>
