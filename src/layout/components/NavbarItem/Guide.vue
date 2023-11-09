<template>
  <div class="guide">
    <el-link :underline="false" @click="routeToGuide">
      使用手册<el-icon style="margin: 3px 0 0 2px"><Document /></el-icon>
    </el-link>
  </div>
</template>

<script>
export default {
  name: 'Guide',
  methods: {
    routeToGuide() {
      window.open('https://zephyer.top')
    }
  }
}
</script>

<style scoped>

</style>
