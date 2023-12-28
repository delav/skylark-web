<template>
  <div class="hook-form">
    <div class="content">
      <el-form
        ref="buildHookRef"
        :model="hookFormData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="Hook名称" prop="name">
          <el-input v-model="hookFormData.name" />
        </el-form-item>
        <el-form-item label="构建计划ID" prop="plans" v-if="hookType===1">
          <el-input v-model="hookFormData.plans" />
        </el-form-item>
        <el-form-item label="Hook描述" prop="desc">
          <el-input type="textarea"  v-model="hookFormData.desc" :rows="2" />
        </el-form-item>
      </el-form>
      <div class="hook-footer">
        <el-button @click="cancelCreate">取消</el-button>
        <el-button type="primary" @click="confirmCreate">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HookForm',
  props: {
    hookType: Number
  },
  data() {
    return {
      hookFormData: {},
      formRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        plans: [
          { required: true, message: '请输入计划ID', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    cancelCreate() {
      this.$emit('cancel')
    },
    confirmCreate() {
      this.$refs['buildHookRef'].validate((valid) => {
        if (!valid) {
          return
        }
        const extraDataObj = {
          plan_list: this.hookFormData.plans
        }
        const params = {
          name: this.hookFormData.name,
          desc: this.hookFormData.desc,
          hook_type: this.hookType,
          extra_data: JSON.stringify(extraDataObj)
        }
        this.$emit('confirm', params)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hook-form {
  .content {
    .hook-footer {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
