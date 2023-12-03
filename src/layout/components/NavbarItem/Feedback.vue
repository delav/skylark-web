<template>
  <div class="feedback">
    <el-link :underline="false" @click="feedbackShow=true">
      {{ $t('Navbar._feedback') }}
      <el-icon style="margin-left: 2px"><EditPen /></el-icon>
    </el-link>
    <el-dialog
      class="feedback-dialog"
      width="700px"
      v-model="feedbackShow"
      title="意见反馈"
    >
      <el-form
        ref="feedbackRef"
        :model="feedbackForm"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="feedbackForm.title" />
        </el-form-item>
        <el-form-item label="模块" prop="module">
          <el-select v-model="feedbackForm.module" placeholder="选择模块">
            <el-option
              v-for="(item, index) in routes"
              :key="index"
              :label="$t(item.meta.title)"
              :value="$t(item.meta.title)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="feedbackForm.content" :rows="5" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            v-model="fileList"
            class="uploadPicture"
            action=""
            accept=".jpg,.png,.jpeg,.gif"
            :auto-upload="false"
            :limit="3"
            :on-change="handleChangeFile"
            :on-remove="handleRemoveFile"
            :on-exceed="handleNumberLimit"
          >
<!--            <el-button type="primary">选择图片</el-button>-->
            <template #trigger>
              <el-button style="margin-top: 6px" type="primary" link><el-icon><Upload /></el-icon>选择图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                仅支持上传.jpg, .png, .jpeg, .gif格式文件，文件大小不能超过5M，一次最多添加3个。
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
            <el-button @click="feedbackShow=false">取消</el-button>
            <el-button type="primary" @click="commitFeedback">提交</el-button>
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { userFeedback } from "@/api/system";

export default {
  name: 'Feedback',
  computed: {
    routes() {
      const navbarRoutes = []
      const allRoutes = this.$router.getRoutes()
      allRoutes.forEach(item => {
        if (item.meta['navbar']) {
          navbarRoutes.push(item)
        }
      })
      return navbarRoutes
    },
  },
  data() {
    return {
      feedbackShow: false,
      feedbackForm: {
        'title': '',
        'module': '',
        'content': ''
      },
      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
      },
      fileList: []
    }
  },
  methods: {
    handleChangeFile(file, fileList) {
      this.fileList = fileList
      let imgSize = Number(file.size / 1024 / 1024)
      if (imgSize > 5) {
        const currIdx = this.uploadFiles.indexOf(file)
        this.fileList.splice(currIdx, 1)
        this.$message.error('文件大小不能超过5MB，请重新上传。')
        return false
      }
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList
    },
    handleNumberLimit() {
      this.$message.error('超过可上传的最大文件数量')
    },
    commitFeedback() {
      this.$refs['feedbackRef'].validate((valid) => {
        if (!valid) {
          return
        }
        let formData = new FormData()
        formData.append('info_type', 2)
        formData.append('extra_data', JSON.stringify(this.feedbackForm))
        for (let i = 0; i < this.fileList.length; i++) {
          formData.append('file', this.fileList[i].raw)
        }
        userFeedback(formData).then(() => {
          this.feedbackShow = false
          this.$message.success('提交反馈成功')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.feedback {
  min-width: 72px;
}
</style>
