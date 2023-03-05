<template>
  <div class="text-tooltip">
    <el-tooltip
      effect="dark"
      :disabled="isShowTooltip"
      :content="content"
      :placement="placement"
    >
      <p class="over-flow" :class="className" @mouseover="onMouseOver(refName)">
        <span :ref="refName">{{content||'-'}}</span>
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
    className: {
      type: String,
      default: () => {
        return ''
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
      console.log('ref-name:' + str)
      console.log(this.content)
      let parentWidth = this.$refs[str].parentNode.offsetWidth
      let contentWidth = this.$refs[str].offsetWidth
      console.log(this.$refs[str].parentNode)
      console.log(this.$refs[str])
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
