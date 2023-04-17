<template>
  <div class="build-record">
    <quick-build />
    <record-list />
  </div>
</template>

<script>
import QuickBuild from './components/QuickBuild'
import RecordList from './RecordList'

export default {
  name: 'BuildRecord',
  components: {
    QuickBuild,
    RecordList,
  }
}
</script>

<style scoped>

</style>
