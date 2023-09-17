<template>
  <div class="variable-save">
    <div class="env-region">
      <span class="env-label"><span style="color:#f56c6c;">* </span>环境</span>
      <div class="env-body">
        <div class="env-select">
          <el-select
            :disabled="postVariableForm.id!==undefined"
            v-model="postVariableForm.env_id"
            style="width: 275px"
          >
            <el-option
              v-for="(item, index) in envList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="region-select" v-show="showRegion">
          <el-select
            :disabled="postVariableForm.id!==undefined"
            v-model="postVariableForm.region_id"
            style="width: 275px"
          >
            <el-option
              v-for="(item, index) in allRegionList"
              :key="index"
              :label="item.name"
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
      <el-button @click="createSave">取消</el-button>
      <el-button type="primary" @click="confirmSave">确定</el-button>
    </div>
  </div>
</template>

<script>

import {createVariable, updateVariable} from "@/api/variable";

export default {
  name: 'VariableSave',
  computed: {
    projectList() {
      return this.$store.state.base.projectList
    },
    envList() {
      return this.$store.state.base.envList
    },
    allEnvList() {
      return this.$store.state.base.containAllEnvList
    },
    allRegionList() {
      return this.$store.state.base.containAllRegionList
    },
    showRegion() {
      return this.$store.state.base.showRegion
    },
  },
  props: {
    variableForm: Object
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
      fieldRules: {
        name: [
          { required: true, validator: validateName, trigger: 'blur', message: '变量名不能为空' },
        ],
        value: [
          { required: true, trigger: 'blur', message: '变量值不能为空' }
        ]
      },
      postVariableForm: this.variableForm,
    }
  },
  methods: {
    createSave() {
      this.$emit('cancelAction')
    },
    confirmSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.postVariableForm['id']) {
          updateVariable(this.postVariableForm['id'], this.postVariableForm).then(() => {
            this.$emit('commitAction')
          })
        } else {
          if (this.postVariableForm['region_id'] === 0) {
            delete this.postVariableForm['region_id']
          }
          createVariable(this.postVariableForm).then(() => {
            this.$emit('commitAction')
          })
        }
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
        margin-left: 10px;
      }
    }
  }
  .action-footer {
    display: flex;
    justify-content: right;
  }
}
</style>
