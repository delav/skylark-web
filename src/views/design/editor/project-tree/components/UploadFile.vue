<template>
  <div class="upload-file">
    <el-upload
      ref="upload"
      action=""
      multiple
      :on-exceed="handleExceed"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :auto-upload="false"
      :file-list="uploadFiles"
    >
      <template #trigger>
        <el-button type="warning">选择文件</el-button>
      </template>
      <el-button class="ml-3" type="primary" @click="submitUpload">上传</el-button>
      <template #tip>
        <div class="el-upload__tip text-red">
          limit 1 file, new file will cover the old file
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  data() {
    return {
      uploadFiles: []
    }
  },
  methods: {
    handleExceed() {},
    handleChange(file, fileList) {
      this.uploadFiles = fileList
    },
    handleRemove(file, fileList) {
      this.uploadFiles = fileList
    },
    submitUpload() {
      if (this.uploadFiles.length === 0) {
        this.$message.warning('请先选择文件')
        return
      }
      let rawFiles = []
      for (let i = 0; i < this.uploadFiles.length; i++) {
        rawFiles.push(this.uploadFiles[i].raw)
      }
      this.$emit('uploadFileAction', rawFiles)
    }
  }
}
</script>

<style scoped>

</style>
