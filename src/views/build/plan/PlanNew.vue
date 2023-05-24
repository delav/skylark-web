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
            placeholder="选择项目">
            <el-option
              v-for="(item, index) in projectList"
              :key="index"
              :label="item.name"
              :value="item.id"
              @click.native="changeProject(item)"
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
        <el-form-item label="执行环境" prop="env_list">
          <el-select
            style="width: 100%"
            v-model="formData.env_list"
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
        <el-form-item label="执行地区" prop="region_list">
          <el-select
            style="width: 100%"
            v-model="formData.region_list"
            multiple
            placeholder="选择地区">
            <el-option
              v-for="item in regionList"
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
        <el-form-item label="定时配置" prop="periodic_expr" v-show="formData.periodic_switch">
          <el-input v-model="formData.periodic_expr" />
        </el-form-item>
        <el-form-item label="期望通过率" prop="expect_pass">
          <drag-progress
            ref="cusChild"
            :width="500"
            :percent="formData.expect_pass"
            bgColor="#ddd"
            progressColor="#409EFF"
            :showPerText="true"
            :max="100"
            @percentChange="onPercentChange"
          />
        </el-form-item>
        <el-form-item class="operate-button">
          <el-button type="primary" @click="createBuildPlan">创建并构建</el-button>
          <el-button class="create-button" type="primary" @click="createBuildPlan">创建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="case-dialog">
      <el-dialog
        v-model="showCaseTree"
        title="选择执行用例"
        :close-on-click-modal="false"
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
import PAGE from "@/constans/build";
import CaseTree from "@/views/build/components/CaseTree";
import DragProgress from "@/components/DragProgress";
import { createPlan } from "@/api/plan";
import { fetchVersion } from "@/api/version";

export default {
  name: 'PlanNew',
  components: {
    CaseTree,
    DragProgress,
  },
  data() {
    const validateRegion = (rule, value, callback) => {
      if (!this.showRegion) {
        callback()
      }
      else if (value.length === 0) {
        callback(new Error('Please select region'))
      } else {
        callback()
      }
    }
    return {
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
        env_list: [
          { required: true, message: 'Please select env', trigger: 'blur', type: 'array' },
        ],
        region_list: [
          { required: true, validator: validateRegion, trigger: 'blur', type: 'array' },
        ],
        total_case: [
          { required: true, message: 'Please select test cases', type: 'number' },
        ]
      },
      showCaseTree: false,
      branchIndex: 0
    }
  },
  computed: {
    projectList() {
      return this.$store.state.base.projectList
    },
    envList() {
      return this.$store.state.base.envList
    },
    regionList() {
      return this.$store.state.base.regionList
    },
    showRegion() {
      return this.$store.state.base.showRegion
    }
  },
  created() {
  },
  methods: {
    backToPlanList () {
      this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.LIST)
    },
    changeProject(project) {
      this.versionList = []
      const projectId = project.id
      fetchVersion(projectId).then(response => {
        this.versionList = response.data
      })
      this.formData['project_name'] = project.name
    },
    setBranch(index) {
      this.branchIndex = index
    },
    getBranchContent () {
      const index = this.branchIndex
      return JSON.parse(this.versionList[index]['nodes'])
    },
    saveCheckedCase (caseInfo) {
      this.showCaseTree = false
      this.formData['total_case'] = caseInfo['count']
      this.formData['build_cases'] = caseInfo['cases']
      this.formData['extra_data'] = JSON.stringify(caseInfo['options'])
    },
    onPercentChange (num) {
      this.formData.expect_pass = num
    },
    createBuildPlan () {
      this.$refs['ruleFormRef'].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.formData['periodic_switch']) {
          if (!this.formData['periodic_expr']) {
            this.$message.warning('定时配置不能为空')
            return
          }
          this.formData['periodic_expr'] = this.formData['periodic_expr'].replace(/(^\s*)|(\s*$)/g, '')
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
        createPlan(this.formData).then(() => {
          this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.LIST)
          this.$message.success('创建计划成功')
        })
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
    .operate-button {
      float: right;
      margin-top: 20px;
      .create-button {
        margin-left: 25px;
      }
    }
  }
}
</style>
