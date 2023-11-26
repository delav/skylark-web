<template>
  <div class="plan-form">
    <div class="body">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="计划标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="项目" prop="project_id">
          <el-select
            style="width: 100%"
            v-model="formData.project_id"
            placeholder="选择项目"
          >
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
            placeholder="选择分支"
          >
            <el-option
              v-for="(item, index) in versionList"
              :key="index"
              :label="item.branch"
              :value="item.branch"
              @click.native="setBranch(index)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="环境" prop="env_list">
          <el-select
            style="width: 100%"
            v-model="formData.env_list"
            multiple
            placeholder="选择环境"
          >
            <el-option
              v-for="item in envList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区" prop="region_list" v-if="showRegion">
          <el-select
            style="width: 100%"
            v-model="formData.region_list"
            multiple
            placeholder="选择地区"
          >
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
          <el-button style="float: left;margin-left: 20px" type="primary" @click="checkCase">选择用例</el-button>
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
        <el-form-item label="执行参数" prop="parameters">
          <el-select
            style="width: 100%"
            v-model="formData.parameters"
            placeholder="执行参数"
            filterable
            clearable
            allow-create
          >
            <el-option
              v-for="(item, index) in parameterList"
              :key="index"
              :label="item.parameters"
              :value="item.parameters"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="期望通过率" prop="expect_pass">
          <drag-progress
            :width="500"
            :percent="formData.expect_pass"
            :showPerText="true"
            :max="100"
            progressColor="#00acc1"
            @percentChange="onPercentChange"
          />
        </el-form-item>
      </el-form>
      <div class="form-footer">
        <el-button @click="cancelPlan">取消</el-button>
        <el-button class="create-button" type="primary" @click="confirmPlan">确定</el-button>
      </div>
    </div>
    <div class="case-dialog">
      <el-dialog
        width="700px"
        v-model="showCaseTree"
        title="选择执行用例"
        :close-on-click-modal="false"
      >
        <div class="case-content">
          <case-tree
            :project-id="formData.project_id"
            :tree-array="getBranchContent()"
            :checked-cases="formData.case_list"
            :auto-latest="formData.auto_latest"
            @cancel="cancelCheckCase"
            @confirm="saveCheckedCase"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CaseTree from "@/views/build/components/CaseTree";
import DragProgress from "@/components/DragProgress";
import { fetchVersion } from "@/api/version";
import { fetchParametersByProject } from "@/api/parameter";

export default {
  name: 'PlanForm',
  components: {
    CaseTree,
    DragProgress,
  },
  props: {
    planData: Object
  },
  data() {
    const validateRegion = (rule, value, callback) => {
      if (!this.showRegion) {
        callback()
      }
      else if (value.length === 0) {
        callback(new Error('请选择地区'))
      } else {
        callback()
      }
    }
    return {
      versionList: [],
      planList: [],
      parameterList: [],
      formData: {},
      formRules: {
        title: [
          { required: true, message: '请选择计划标题', trigger: 'blur' },
        ],
        project_id: [
          { required: true, message: '请选择项目', trigger: 'change' },
        ],
        branch: [
          { required: true, message: '请选择项目分支', trigger: 'change' },
        ],
        env_list: [
          { required: true, message: '请选择环境', trigger: 'blur', type: 'array' },
        ],
        region_list: [
          { required: true, validator: validateRegion, trigger: 'blur', type: 'array' },
        ],
        total_case: [
          { required: true, message: '请选择执行用例', type: 'number', min: 1 },
        ]
      },
      showCaseTree: false,
      branchIndex: 0,
    }
  },
  watch: {
    planData: {
      handler(val) {
        this.initData(val)
      },
      deep: true,
      immediate: true
    },
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
  mounted() {
  },
  unmounted() {
    this.$options.data()
  },
  methods: {
    initData(formData) {
      this.formData = formData
      if (formData['id'] === undefined) {
        return
      }
      this.getPlanRequiredData(formData['project_id'])
    },
    changeProject(project) {
      this.versionList = []
      this.parameterList = []
      this.getPlanRequiredData(project.id)
    },
    getPlanRequiredData(projectId) {
      fetchVersion(projectId).then(response => {
        this.versionList = response.data
      })
      fetchParametersByProject(projectId).then(response => {
        this.parameterList = response.data
      })
    },
    setBranch(index) {
      this.branchIndex = index
    },
    checkCase() {
      if (this.versionList.length === 0) {
        this.$message.warning('请选择分支')
        return
      }
      this.showCaseTree = true
    },
    getBranchContent() {
      const index = this.branchIndex
      return JSON.parse(this.versionList[index]['nodes'])
    },
    cancelCheckCase() {
      this.showCaseTree = false
    },
    saveCheckedCase(confirmData) {
      this.showCaseTree = false
      this.formData['case_list'] = confirmData['caseList']
      this.formData['auto_latest'] = confirmData['autoLatest']
      this.formData['total_case'] = confirmData['totalCase']
    },
    onPercentChange(num) {
      this.formData.expect_pass = num
    },
    cancelPlan() {
      this.$emit('cancel')
    },
    confirmPlan() {
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
        this.$emit('confirm', this.formData)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.plan-form {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
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
