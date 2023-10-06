<template>
  <div class="project-file">
    <p class="text-area">{{ fileObject.file_text }}</p>
  </div>
</template>

<script>
import { deepCopy } from "@/utils/dcopy";

export default {
  name: 'File',
  props: {
    fileInfo: Object
  },
  watch: {
    fileInfo: {
      handler(val) {
        this.handlerFileInfo(val)
      },
      deep: true,
      immediate: true
    },
  },
  data() {
    return {
      fileObject: {}
    }
  },
  methods: {
    handlerFileInfo(fileObj) {
      this.fileObject = deepCopy(fileObj)
    }
  }
}
</script>

<style lang="scss" scoped>
.project-file {
  padding: 5px;
  width: 100%;
  height: 100%;
  .text-area {
    margin: 0;
    white-space: pre-line;
    font-size: 14px;
    color: #606266;
  }
}
</style>
