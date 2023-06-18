<template>
  <div class="code-viewer">
    <el-input type="textarea" @blur="saveToStore" :disabled="editMode" v-model="content" rows="30"></el-input>
  </div>
</template>

<script>

export default {
  name: 'CodeViewer',
  data() {
    return {
      content: ''
    }
  },
  computed: {
    editMode() {
      return !this.$store.state.file.editMode
    }
  },
  methods: {
    saveToStore() {
      const fileObject = this.$store.state.file.fileContent
      fileObject['file_text'] = this.content
      this.$store.commit('file/SET_FILE_CONTENT', fileObject)
    }
  }
}
</script>

<style lang="scss" scoped>

:deep(.el-textarea.is-disabled) {
  cursor: auto;
  .el-textarea__inner {
    cursor: auto;
  }
}
</style>
