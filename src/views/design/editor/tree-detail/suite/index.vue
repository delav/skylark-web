<template>
  <div class="suite-detail">
    <div class="fixture-list">
      <fixture />
    </div>
    <div class="variable-list">
      <variable />
    </div>
  </div>
</template>

<script>
import Fixture from "@/views/design/editor/tree-detail/suite/components/Fixture";
import Variable from '@/views/design/editor/tree-detail/suite/components/Variable';

export default {
  name: 'SuiteDetail',
  components: {
    Fixture,
    Variable,
  },
}
</script>

<style lang="scss" scoped>
.suite-detail {
  width: 100%;
  height: 100%;
  padding: 5px;
  overflow-y: auto;
  .fixture-list {
    width: 100%;
  }
  .variable-list {
    width: 100%;
    margin-top: 15px;
  }
}
</style>
