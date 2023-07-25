<template>
  <div class="variable-save">
    <div class="env-region">
      <span class="env-label"><span style="color:#f56c6c;">* </span>环境</span>
      <div class="env-body">
        <div class="env-select">
          <el-select v-model="postVariableForm.env_id" style="width: 100%">
            <el-option
              v-for="(item, index) in envList"
              :key="index"
              :label="item['name']"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="region-select" v-show="showRegion">
          <el-select v-model="postVariableForm.region_id" style="width: 100%">
            <el-option
              v-for="(item, index) in containNullRegionList"
              :key="index"
              :label="item['name']"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="form-content">
      <el-form
        ref="ruleForm"
        :model="postVariableForm"
        :rules="fieldRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="变量名" prop="name">
          <el-input v-model="postVariableForm.name" />
        </el-form-item>
        <el-form-item label="变量值" prop="value">
          <el-input type="textarea" :autosize="{ maxRows: 6 }" v-model="postVariableForm.value"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="postVariableForm.remark" />
        </el-form-item>
      </el-form>
    </div>
    <div class="action-footer">
      <el-button @click="cancelVariableAction">取消</el-button>
      <el-button type="primary" @click="createVariableAction">确定</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'VariableSave',
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
    },
  },
  props: {
    variableForm: {
      type: Object,
      default() {
        return {
          module_id: '',
          module_type: '',
          name: '',
          value: '',
          remark: '',
          env_id: '',
          region_id: '',
        }
      }
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      const pattern = /\$\{.*\}/
      if (!value.match(pattern))  {
        callback(new Error('变量名格式: ${xxx}'))
      } else{
        callback()
      }
    }
    return {
      containNullRegionList: [
        { id: 0, name: 'None', ext_name: 'None' }
      ],
      fieldRules: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' },
        ],
        value: [
          { required: true, trigger: 'blur', message: '变量值不能为空' }
        ]
      },
      postVariableForm: this.variableForm,
    }
  },
  created() {
    const regions = this.$store.state.base.regionList
    this.containNullRegionList.push(...regions)
  },
  methods: {
    cancelVariableAction() {
      this.$emit('cancelAction')
    },
    createVariableAction() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return
        }
        this.$emit('commitAction', this.postVariableForm)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.variable-save {
  width: 100%;
  height: 100%;
  .env-region {
    display: flex;
    margin-bottom: 18px;
    .env-label {
      width: 80px;
      line-height: 32px;
      text-align: right;
      padding-right: 12px;
    }
    .env-body {
      display: flex;
      align-items: center;
      .env-select {
      }
      .region-select {
        margin-left: 15px;
      }
    }
  }
  .action-footer {
    display: flex;
    justify-content: right;
  }
}
</style>
