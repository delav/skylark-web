<template>
  <div class="keyword-form">
    <div class="body">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="组件名称" prop="ext_name">
          <el-input v-model="formData.ext_name"></el-input>
        </el-form-item>
        <el-form-item label="函数名称" prop="name">
          <el-input v-model="formData.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="分组" prop="group_id">
          <el-select
            style="width: 100%"
            v-model="formData.group_id"
            placeholder="选择分组"
          >
            <el-option
              v-for="item in keywordGroup"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件功能" prop="desc">
          <el-input :rows="3" type="textarea" v-model="formData.desc"></el-input>
        </el-form-item>
        <el-form-item label="参数" prop="input_params">
          <el-input v-model="formData.input_params" disabled></el-input>
        </el-form-item>
        <el-form-item label="参数说明" prop="input_desc">
          <el-input v-model="formData.input_desc"></el-input>
        </el-form-item>
        <el-form-item label="返回值" prop="output_params">
          <el-input v-model="formData.output_params" disabled></el-input>
        </el-form-item>
        <el-form-item label="返回值说明" prop="output_desc">
          <el-input v-model="formData.output_desc"></el-input>
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="formData.source" disabled></el-input>
        </el-form-item>
        <el-form-item label="组件图标">
          <el-upload
            v-model="iconList"
            class="upload-icon"
            action=""
            accept=".png"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleChangeFile"
          >
            <template #trigger>
              <el-button type="primary" link><el-icon><Upload /></el-icon>上传</el-button>
            </template>
            <span style="margin-left: 25px" v-if="iconList.length!==0">
              <el-tag type="info" @close="handleRemoveFile" closable>
                {{ iconList[0].name}}
              </el-tag>
            </span>
            <template #tip>
              <div class="el-upload__tip">
                仅支持上传png格式图标，文件大小不能超过1M。
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="form-footer">
        <el-button @click="cancelConfirm">取消</el-button>
        <el-button class="create-button" type="primary" @click="confirmSave">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'KeywordForm',
  props: {
    keywordData: Object,
    keywordGroup: Array
  },
  data() {
    return {
      formData: {},
      formRules: {
        ext_name: [
          { required: true, message: '请填写组件名称', trigger: 'blur' },
        ],
        group_id: [
          { required: true, message: '请选择分组', trigger: 'change' },
        ],
      },
      iconList: [],
    }
  },
  watch: {
    keywordData: {
      handler(val) {
        this.formData = val
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    handleChangeFile(file) {
      this.iconList = [file]
      let imgSize = Number(file.size / 1024 / 1024)
      if (imgSize > 1) {
        const currIdx = this.uploadFiles.indexOf(file)
        this.iconList.splice(currIdx, 1)
        this.$message.error('文件大小不能超过1MB，请重新上传。')
        return false
      }
    },
    handleRemoveFile() {
      this.iconList = []
    },
    cancelConfirm() {
      this.$emit('cancel')
    },
    confirmSave() {
      this.$refs['ruleFormRef'].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.iconList.length !== 0) {
          let file_str = ''
          const reader = new FileReader()
          reader.readAsDataURL(this.iconList[0].raw)
          reader.onload = function () {
            file_str = this.result
          }
          this.formData['image'] = file_str
        }
        this.$emit('confirm', this.formData)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.keyword-form {
  width: 100%;
  height: 100%;
  max-width: 800px;
  .head {
  }
  .body {
    width: 100%;
    .form-footer {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
