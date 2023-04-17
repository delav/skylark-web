<template>
  <div class="quick-build">
    <div class="quick-button">
      <el-button type="primary" @click="showQuickBuild=true">快速构建</el-button>
    </div>
    <div class="dialog">
      <el-dialog
        width="65%"
        v-model="showQuickBuild"
        title="快速执行构建"
        :close-on-click-modal="false"
      >
        <div class="content">
          <el-form
            ref="ruleFormRef"
            :model="formData"
            :rules="formRules"
            label-width="130px"
            status-icon
          >
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
            <el-form-item label="执行地区" prop="regions" v-show="showRegion">
              <el-select
                style="width: 100%"
                v-model="formData.regions"
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
            <el-form-item class="operate-button">
              <el-button type="primary" @click="createBuildPlan">构建</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickBuild',
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
      showQuickBuild: false,
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
        regions: [
          { required: true, validator: validateRegion, trigger: 'blur', type: 'array' },
        ],
        total_case: [
          { required: true, message: 'Please select test cases', type: 'number' },
        ]
      },
      showCaseTree: false,
      branchIndex: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.quick-build {
  height: 60px;
  width: 100%;
  .quick-button {
    float: right;
    padding: 5px 5px 0 0;
  }
}
</style>
