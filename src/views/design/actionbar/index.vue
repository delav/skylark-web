<template>
  <div class="action-bar">
    <icon-item :condition="true" i-class="run" @func="run" description="执行用例"></icon-item>
    <icon-item :condition="true" i-class="stop" @func="stop" description="终止执行"></icon-item>
  </div>
</template>

<script>
import IconItem from './components/IconItem'

export default {
  name: 'ActionBar',
  components: {
    IconItem
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    run() {},
    stop() {},
    save() {},
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.action-bar {
  height: $toolbarHeight;
  background-color: $toolbarBg;
}
</style>
