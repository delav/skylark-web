<template>
  <div class="group-form">
    <div class="content">
      <el-form
        ref="groupFormRef"
        :model="groupFromData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="groupFromData.name" />
        </el-form-item>
        <el-form-item label="关联项目" prop="plans" >
          <el-select
            style="width: 100%"
            v-model="groupFromData.project_id"
            placeholder="选择项目"
          >
            <el-option
              v-for="item in allProjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="group-footer">
        <el-button @click="cancelCreate">取消</el-button>
        <el-button type="primary" @click="confirmCreate">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deepCopy } from "@/utils/dcopy";

export default {
  name: 'GroupForm',
  computed: {
    allProjectList() {
      return this.$store.state.base.containAllProjectList
    }
  },
  data() {
    return {
      groupFromData: {},
      formRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    cancelCreate() {
      this.$emit('cancel')
    },
    confirmCreate() {
      this.$refs['groupFormRef'].validate((valid) => {
        if (!valid) {
          return
        }
        const params = deepCopy(this.groupFromData)
        if (this.groupFromData['project_id'] === 0) {
          delete params['project_id']
        }
        this.$emit('confirm', params)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.group-form {
  .content {
    .group-footer {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
