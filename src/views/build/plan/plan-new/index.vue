<template>
  <div class="create-plan">
    <div class="back-header">
      <el-icon class="back-icon" @click="backToPlanList"><Back /></el-icon>
    </div>
    <div class="create-body">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="formRules"
        label-width="130px"
        status-icon
      >
        <el-form-item label="计划标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="project_id">
          <el-select
            style="width: 100%"
            v-model="formData.project_id"
            @change="changeProject"
            placeholder="选择项目">
            <el-option
              v-for="(item, index) in projectList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目分支" prop="branch">
          <el-select
            style="width: 100%"
            v-model="formData.branch"
            placeholder="选择分支">
            <el-option
              v-for="(item, index) in versionList"
              :key="index"
              :label="item.branch"
              :value="item.branch"
              @click.native="setBranch(index)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="执行环境" prop="envs">
          <el-select
            style="width: 100%"
            v-model="formData.envs"
            multiple
            placeholder="选择环境">
            <el-option
              v-for="item in envList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行用例" prop="total_case">
          <el-input
            style="float: left;width: 120px"
            v-model="formData.total_case"
            disabled
          >
          </el-input>
          <el-button style="float: left;margin-left: 20px" type="primary" @click="showCaseTree=true">选择用例</el-button>
        </el-form-item>
        <el-form-item label="定时开关" prop="periodic_switch">
          <el-switch
            v-model="formData.periodic_switch"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item label="定时配置" prop="periodic_expr">
          <el-input v-model="formData.periodic_expr" type="textarea" />
        </el-form-item>
        <el-form-item label="期望通过率" prop="expect_pass">
          <el-progress :percentage="formData.expect_pass" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createBuildPlan">创建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="case-dialog">
      <el-dialog
        v-model="showCaseTree"
        title="选择执行用例"
        :close-on-click-modal="false"
        :destroy-on-close="true"
      >
        <div class="case-content">
          <case-tree
            :project-id="formData.project"
            :tree-array="getBranchContent()"
            @confirmAction="saveCheckedCase"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CaseTree from '../components/CaseTree'
import { deepCopy } from '@/utils/dcopy'
import { fetchEnvs } from '@/api/env'
import { fetchProjectList } from '@/api/project'
import { createPlan } from '@/api/plan'
import { fetchVersion } from '@/api/version'

export default {
  name: 'PlanNew',
  components: {
    CaseTree
  },
  data() {
    return {
      envList: [],
      projectList: [],
      versionList: [],
      planList: [],
      formData: {
        'expect_pass': 90
      },
      formRules: {
        title: [
          { required: true, message: 'Please input plan title', trigger: 'blur' },
        ],
        project_id: [
          { required: true, message: 'Please select project', trigger: 'change' },
        ],
        branch: [
          { required: true, message: 'Please select branch', trigger: 'change' },
        ],
        envs: [
          { required: true, message: 'Please select env', trigger: 'blur', type: 'array' },
        ],
        total_case: [
          { required: true },
        ]
      },
      selectEnvs: [],
      showCaseTree: false,
      branchIndex: 0
    }
  },
  created() {
    this.getProjectList()
    this.getEnvList()
  },
  methods: {
    backToPlanList () {
      this.$store.commit('build/SET_RIGHT_PAGE', 1)
    },
    getEnvList() {
      fetchEnvs().then(response => {
        this.envList = response.data
      })
    },
    getProjectList() {
      fetchProjectList().then(response => {
        this.projectList = response.data
      })
    },
    changeProject(projectId) {
      fetchVersion(projectId).then(response => {
        this.versionList = response.data
      })
    },
    setBranch(index) {
      this.branchIndex = index
    },
    getBranchContent () {
      const index = this.branchIndex
      return JSON.parse(this.versionList[index]['content'])
    },
    saveCheckedCase (caseInfo) {
      this.showCaseTree = false
      this.formData['total_case'] = caseInfo['count']
      this.formData['build_cases'] = caseInfo['cases']
      this.formData['extra_data'] = JSON.stringify(caseInfo['options'])
    },
    createBuildPlan () {
      this.formData['periodic_expr'] = this.formData['periodic_expr'].replace(/(^\s*)|(\s*$)/g, '')
      if (this.formData['periodic_switch']) {
        if (this.formData['periodic_expr'] === '') {
          this.$message.warning('定时配置不能为空')
          return
        }
        try {
          const cronParse = require('cron-parser')
          cronParse.parseExpression(this.formData['periodic_expr'])
        } catch (err) {
          this.$message.warning('定时表达式错误')
          return
        }
      }
      const postData = deepCopy(this.formData)
      postData['envs'] = postData['envs'].join(',')
      createPlan(postData).then(() => {
        this.$store.commit('build/SET_RIGHT_PAGE', 1)
        this.$message.success('Create plan success!')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.create-plan {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  padding: 5px;
  max-width: 800px;
  .back-header {
    height: 50px;
    padding: 5px 0;
    .back-icon {
      cursor: pointer;
      font-size: 23px;
    }
  }
  .create-body {
    width: 100%;
  }
}
</style>
