<template>
  <div class="icon-item">
    <el-tooltip>
      <template #content>
        <span>{{ description }}</span>
      </template>
      <span class="icon-content">
        <svg-icon class="available" v-if="condition" :icon-class="iClass" @click="execute"></svg-icon>
        <svg-icon class="unavailable" v-else :icon-class="iClass"></svg-icon>
    </span>
    </el-tooltip>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'IconItem',
  components: {
    SvgIcon,
  },
  props: {
    condition: Boolean,
    iClass: String,
    description: String,
  },
  methods: {
    execute() {
      this.$emit('func')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.icon-item {
  height: 100%;
  float: left;
  .icon-content {
    font-size: 23px;
    line-height: $toolbarHeight;
    margin-left: 10px;
    cursor: pointer;
    .available {
      color: $availableIconColor;
    }
    .unavailable {
      color: $unavailableIconColor;
    }
  }
}
</style>
