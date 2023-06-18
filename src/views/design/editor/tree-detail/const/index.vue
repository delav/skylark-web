<template>
  <div class="const">
    <div class="header">
      <const-config />
    </div>
    <div class="content">
      <code-viewer />
    </div>
  </div>
</template>

<script>
import ConstConfig from "@/views/design/editor/tree-detail/const/components/ConstConfig";
import CodeViewer from "@/views/design/editor/tree-detail/const/components/CodeViewer";

export default {
  name: 'Const',
  components: {
    ConstConfig,
    CodeViewer
  }
}
</script>

<style lang="scss" scoped>
.const {
  width: 100%;
  height: 100%;
}
</style>
