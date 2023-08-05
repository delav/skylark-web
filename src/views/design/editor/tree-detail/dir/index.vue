<template>
  <div class="dir-detail">
    <div class="fixture-list">
      <fixture />
    </div>
  </div>
</template>

<script>
import Fixture from "@/views/design/editor/tree-detail/dir/components/Fixture";

export default {
  name: 'DirDetail',
  components: {
    Fixture,
  },
}
</script>

<style lang="scss" scoped>
.dir-detail {
  width: 100%;
  height: 100%;
  padding: 5px;
  .fixture-list {
    width: 100%;
    min-height: 600px;
  }
}
</style>
