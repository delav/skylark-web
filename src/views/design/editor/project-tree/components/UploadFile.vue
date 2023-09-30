<template>
  <div class="upload-file">
    <div class="message-tip">
      <el-alert title="上传文件大小不能超过5M，一次最多添加3个。" type="warning" :closable="false" show-icon/>
    </div>
    <el-upload
      ref="upload"
      action=""
      multiple
      :auto-upload="false"
      :limit="3"
      :on-change="handleChangeFile"
      :on-exceed="handleNumberLimit"
      :on-remove="handleRemoveFile"
      :file-list="uploadFiles"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
    </el-upload>
    <div class="upload-footer">
      <el-button @click="closeUpload">取消</el-button>
      <el-button type="primary" @click="submitUpload">确认</el-button>
    </div>
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
    handleChangeFile(file, fileList) {
      this.uploadFiles = fileList
      let imgSize = Number(file.size / 1024 / 1024)
      if (imgSize > 5) {
        const currIdx = this.uploadFiles.indexOf(file)
        this.uploadFiles.splice(currIdx, 1)
        this.$message.error('文件大小不能超过5MB，请重新上传。')
        return false
      }
    },
    handleRemoveFile(file, fileList) {
      this.uploadFiles = fileList
    },
    handleNumberLimit() {
      this.$message.error('超过可上传的最大文件数量')
    },
    closeUpload() {
      this.$emit('uploadClose')
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
      this.$emit('uploadCommit', rawFiles)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.upload-file {
  width: 100%;
  height: 100%;
  .message-tip {
    margin-bottom: 15px;
  }
  .upload-footer {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
