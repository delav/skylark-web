<template>
  <div class="quick-build">
    <div class="content">
      <div class="card-header">
        <span>快速构建</span>
      </div>
      <div class="card-body">
        <el-form
          ref="ruleFormRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          status-icon
        >
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
                v-for="(item, index) in branchList"
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
          <el-form-item label="执行地区" prop="region_list" v-if="showRegion">
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
            <el-button style="float: left;margin-left: 20px" type="primary" @click="openCheckCase">选择用例</el-button>
          </el-form-item>
          <el-form-item label="执行参数" prop="parameters">
            <el-input v-model="formData.parameters" />
          </el-form-item>
        </el-form>
        <div class="build-footer">
          <el-button type="primary" @click="createQuickBuild">立即构建</el-button>
        </div>
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
import { buildQuickTest } from "@/api/builder";
import { fetchVersion } from "@/api/version";

export default {
  name: 'QuickBuild',
  components: {
    CaseTree
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
      formData: {
        project_id: null,
        branch: '',
        env_list: [],
        region_list: [],
        case_list: [],
        total_case: 0,
        auto_latest: false
      },
      formRules: {
        project_id: [
          { required: true, message: '请选择项目', trigger: 'change' },
        ],
        branch: [
          { required: true, message: '请选择项目分支', trigger: 'change' },
        ],
        env_list: [
          { required: true, message: '请选择环境', trigger: 'change', type: 'array' },
        ],
        region_list: [
          { required: true, validator: validateRegion, trigger: 'change', type: 'array' },
        ],
        total_case: [
          { required: true, message: '请选择执行的用例', type: 'number', min: 1 },
        ]
      },
      branchList: [],
      branchIndex: 0,
      showCaseTree: false
    }
  },
  methods: {
    changeProject(project) {
      // Object.assign(this.$data, this.$options.data())
      this.$refs['ruleFormRef'].resetFields()
      this.branchList = []
      this.formData['project_id'] = project.id
      fetchVersion(project.id).then(response => {
        this.branchList = response.data
      })
      this.formData['project_name'] = project.name
    },
    setBranch(index) {
      this.branchIndex = index
    },
    getBranchContent () {
      const index = this.branchIndex
      if (index >= this.branchList.length) {
        return []
      }
      return JSON.parse(this.branchList[index]['nodes'])
    },
    openCheckCase() {
      if (this.formData.branch === '') {
        this.$message.warning('请先选择分支')
        return
      }
      if (this.branchList.length === 0) {
        this.$message.warning('获取分支数据失败')
        return
      }
      this.showCaseTree = true
    },
    cancelCheckCase() {
      this.showCaseTree = false
    },
    saveCheckedCase (confirmData) {
      this.showCaseTree = false
      this.formData['case_list'] = confirmData['caseList']
      this.formData['auto_latest'] = confirmData['autoLatest']
      this.formData['total_case'] = confirmData['totalCase']
    },
    createQuickBuild() {
      this.$refs['ruleFormRef'].validate((valid) => {
        if (!valid) {
          return
        }
        buildQuickTest(this.formData).then(response => {
          console.log(response.data)
          this.$router.push('/build/record/list')
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.quick-build {
  width: 100%;
  height: 100%;
  .content {
    padding: 0 5px 5px 5px;
    height: 100%;
    border-radius: 2px;
    overflow: auto;
    .card-header {
      padding: 18px 20px;
      border-bottom: 1px solid #e4e7ed;
    }
    .card-body {
      margin-top: 20px;
      padding: 20px;
      max-width: 900px;
      .build-footer {
        margin-top: 30px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
}
</style>
