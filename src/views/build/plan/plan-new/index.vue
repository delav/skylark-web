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
        <el-form-item label="项目名称" prop="project">
          <el-select
            style="width: 100%"
            v-model="formData.project"
            placeholder="选择项目">
            <el-option
              v-for="(item, index) in projectList"
              :key="index"
              :label="item.name"
              :value="item.id"
              @click.native="getProjectVersion(item.id)"
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
              :value="item.id"
              @click.native="setBranchIndex(index)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="执行环境" prop="envs">
          <el-select
            style="width: 100%"
            v-model="selectEnvs"
            multiple
            collapse-tags
            placeholder="选择环境">
            <el-option
              v-for="item in envList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用例个数" prop="total_case">
          <el-input
            style="float: left;width: 120px"
            v-model="formData.total_case"
            disabled
          >
          </el-input>
          <el-button style="float: left;margin-left: 20px" type="primary" @click="showCaseTree=true">选择用例</el-button>
        </el-form-item>
        <el-form-item label="定时开关" prop="timer_switch">
          <el-switch
            v-model="formData.timer_switch"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item label="定时配置" prop="timer">
          <el-input v-model="formData.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">
            Create
          </el-button>
          <el-button>Reset</el-button>
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
          <case-tree :tree-array="getBranchData()" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CaseTree from '../components/CaseTree'
import { fetchEnvs } from '@/api/env'
import { fetchProjectList } from '@/api/project'
import { getPlansByProject } from '@/api/build'
import {fetchVersion} from "@/api/version";

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
      branchIndex: 0,
      planList: [],
      formData: {},
      formRules: {
        title: [
          {
            required: true,
            message: 'Please input plan title',
            trigger: 'blur',
          },
        ],
        project: [
          {
            required: true,
            message: 'Please select project',
            trigger: 'change',
          },
        ],
        branch: [
          {
            required: true,
            message: 'Please select branch',
            trigger: 'change',
          },
        ],
        envs: [
          {
            required: true,
            message: 'Please select env',
            trigger: 'change',
            type: 'array',
          },
        ],
        total_case: [
          {
            required: true,
          },
        ]
      },
      selectEnvs: [],
      showCaseTree: false,
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
    getProjectVersion(projectId) {
      this.branchIndex = 0
      fetchVersion(projectId).then(response => {
        this.versionList = response.data
      })
    },
    setBranchIndex (index) {
      this.branchIndex = index
    },
    getProjectPlan(projectId) {
      getPlansByProject(projectId).then(response => {
        this.planList = response.data
      })
    },
    getBranchData() {
      const treeNodesText = this.versionList[this.branchIndex]['content']
      return JSON.parse(treeNodesText)
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
