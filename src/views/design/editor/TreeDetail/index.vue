<template>
  <div class="tree-detail">
    <case v-if="isCase(detailType)"></case>
    <category v-else-if="isCategory(detailType)"></category>
    <file v-else-if="isFile(detailType)"></file>
  </div>
</template>

<script>
import Case from './Case'
import Category from './Category'
import File from './File'
import CONSTANT from '../ProjectTree/mixins/constant'

export default {
  name: 'TreeDetail',
  components: {
    Case,
    Category,
    File,
  },
  computed: {
    detailType() {
      return this.$store.state.tree.detailType
    }
  },
  methods: {
    isCase(type) {
      return type === CONSTANT.DetailType.CASE
    },
    isCategory(type) {
      const category = [
        CONSTANT.DetailType.ROOT,
        CONSTANT.DetailType.DIR,
        CONSTANT.DetailType.SUITE
      ]
      return category.indexOf(type) !== -1
    },
    isFile(type) {
      return type === CONSTANT.DetailType.FILE
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-detail {
  height: 100%;
}
</style>
