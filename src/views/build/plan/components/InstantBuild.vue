<template>
  <div class="instant-build">
    <div class="build-body">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="formRules"
        label-width="130px"
        status-icon
      >
        <el-form-item label="项目名称" prop="project_name">
          <el-input v-model="formData.project_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目分支" prop="branch">
          <el-input v-model="formData.branch" disabled></el-input>
        </el-form-item>
        <el-form-item label="执行环境" prop="envs">
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
        <el-form-item label="执行地区" prop="regions">
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
        </el-form-item>
        <el-form-item label="期望通过率" prop="expect_pass">
          <el-input v-model="formData.expect_pass" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="float: right" type="primary" @click="createInstantBuild">构建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { buildInstantTest } from "@/api/builder";

export default {
  name: 'InstantBuild',
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
      formData: {},
      formRules: {
        env_list: [
          { required: true, message: 'Please select env', trigger: 'blur', type: 'array' },
        ],
        region_list: [
          { required: true, validator: validateRegion, trigger: 'blur', type: 'array' },
        ],
      },
    }
  },
  watch: {
    '$store.state.plan.changeFlag': {
      handler() {
        this.formData = this.$store.state.plan.planData
      },
      immediate: true
    },
  },
  computed: {
    envList() {
      return this.$store.state.base.envList
    },
    regionList() {
      return this.$store.state.base.regionList
    },
    showRegion() {
      return this.$store.state.base.showRegion
    },
  },
  created() {
  },
  methods: {
    createInstantBuild () {
      this.$refs['ruleFormRef'].validate((valid) => {
        if (!valid) {
          return
        }
        buildInstantTest(this.formData).then(response => {
          console.log(response.data)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.instant-build {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  padding: 5px;
  max-width: 800px;
  .build-body {
    width: 100%;
  }
}
</style>
