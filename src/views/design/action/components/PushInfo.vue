<template>
  <div class="push-info">
    <el-form
      ref="postForm"
      :rules="formRules"
      label-position="left"
      label-width="60px"
      :model="versionForm"
      style="max-width: 500px"
    >
      <el-form-item label="项目" prop="project">
        <el-input v-model="versionForm.project" disabled />
      </el-form-item>
      <el-form-item label="分支" prop="branch">
        <el-select
          style="width: 100%"
          v-model="versionForm.branch"
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="input or choose branch"
        >
          <el-option
            v-for="item in versionList"
            :key="item.id"
            :label="item.branch"
            :value="item.branch"
          >
            <span style="float: left">{{ item.branch }}</span>
            <span style="float: right; color: #909399ff;font-size: 13px;">{{ item['update_at'] }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input :rows="2" type="textarea" v-model="versionForm.remark" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="requestPostVersion">提交</el-button>
        <el-button @click="cancelDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchVersion, createVersion } from "@/api/version";

export default {
  name: 'PushInfo',
  data() {
    return {
      versionList: [],
      versionForm: {
        project: '',
        branch: '',
        remark: ''
      },
      formRules: {
        project: [
          {required: true, message: 'Get project error'},
        ],
        branch: [
          {required: true, message: 'Please input or choose branch', trigger: 'change'},
        ],
        remark: [
          {required: true, message: 'Please input remark', trigger: 'blur'},
        ]
      }
    }
  },
  created() {
    this.getVersionList()
    this.versionForm.project = this.$store.state.tree.projectName
  },
  methods: {
    getVersionList() {
      const projectId = this.$store.state.tree.projectId
      fetchVersion(projectId, 1).then(response => {
        this.versionList = response.data
      })
    },
    requestPostVersion () {
      this.$refs['postForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const versionInfo = {
          'project_id': this.$store.state.tree.projectId,
          'branch': this.versionForm.branch,
          'remark': this.versionForm.remark,
        }
        createVersion(versionInfo).then(() => {
          this.cancelDialog()
          this.$message.success('推送请求已发送')
        })
      })
    },
    cancelDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
