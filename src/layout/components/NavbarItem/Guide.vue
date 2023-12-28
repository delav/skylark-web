<template>
  <div class="guide">
    <el-link :underline="false" @click="routeToGuide">
      {{ $t('Navbar._guide') }}
      <el-icon style="margin-left: 2px"><Document /></el-icon>
    </el-link>
  </div>
</template>

<script>
export default {
  name: 'Guide',
  methods: {
    routeToGuide() {
      window.open('https://delav.github.io/skylark-doc/')
    }
  }
}
</script>

<style lang="scss" scoped>
.guide {
  min-width: 72px;
}
</style>
