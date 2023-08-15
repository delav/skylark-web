<template>
  <div class="text-tooltip">
    <el-tooltip
      effect="dark"
      :hide-after="5"
      :disabled="isShowTooltip"
      :content="content"
      :placement="placement"
    >
      <p class="over-flow" @mouseover="onMouseOver(refName)">
        <span :style="{fontSize: fontSize}" :ref="refName">{{content}}</span>
      </p>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'TextTooltip',
  props: {
    content: {
      type: String,
      default: () => {
        return ''
      }
    },
    placement: {
      type: String,
      default: () => {
        return 'top'
      }
    },
    fontSize: {
      type: String,
      default: () => {
        return '13px'
      }
    },
    refName: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      isShowTooltip: true
    }
  },
  methods: {
    onMouseOver(str) {
      const tag = this.$refs[str]
      const parentWidth = tag.parentNode.offsetWidth
      const contentWidth = tag.offsetWidth
      this.isShowTooltip = contentWidth <= parentWidth
    }
  }
}
</script>

<style lang="scss" scoped>

.over-flow {
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
