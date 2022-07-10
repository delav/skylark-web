<template>
  <section class="app-main">
    <router-view :key="key" v-slot="{ Component }" class="app-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100vh - 55px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
