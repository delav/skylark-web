<template>
  <div class="actionbar">
    <svg-icon icon-class="table" class="btn-table"></svg-icon>
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
.actionbar {
  height: 28px;
  padding-left: 10px;
  background-color: #008489;
  .svg-icon {
    padding-top: 3px;
  }
}
</style>
