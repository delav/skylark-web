<template>
  <div class="tree-detail">
    <case v-if="detailType===1"></case>
    <category v-else-if="detailType===2"></category>
    <file v-else-if="detailType===3"></file>
  </div>
</template>

<script>
import Case from './Case'
import Category from './Category'
import File from './File'

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
  }
}
</script>

<style lang="scss" scoped>
.tree-detail {
  height: 100%;
}
</style>
