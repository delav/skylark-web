<template>
  <div class="node-action">
    <el-form ref="newForm" :model="changeFrom" label-width="110px">
      <el-form-item
        prop="name"
        :label="changeFrom.label"
        :rules="formRules"
      >
        <el-input v-model="changeFrom.name" />
      </el-form-item>
    </el-form>
    <div class="action-button">
      <el-button @click="clickCancel">取消</el-button>
      <el-button class="commit-button" type="primary" @click="clickCommit">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodeAction',
  props: {
    dialogForm: Object
  },
  data() {
    return {
      changeFrom: this.dialogForm,
      formRules: [
        { required: true, message: '名称不能为空' }
      ]
    }
  },
  methods: {
    clickCancel() {
      this.$emit('actionClose')
    },
    clickCommit() {
      this.$refs['newForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const info = this.validateRules(this.changeFrom)
        if (!info.pass) {
          this.$message.warning(info.msg)
          return
        }
        this.$emit('actionCommit', this.changeFrom.name)
      })
    },
    validateRules(changeFrom) {
      let result = {pass: true, msg: ''}
      if ('suffix' in changeFrom.rules) {
        const suffixList = changeFrom.rules.suffix
        if (!Array.isArray(suffixList)) {
          return result
        }
        if (suffixList.length === 0) {
          return result
        }
        const nameSuffix = '.' + changeFrom.name.split('.').pop()
        if (suffixList.indexOf(nameSuffix) === -1) {
          result.pass = false
          result.msg = `后缀名必须为【${suffixList}】`
        }
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.node-action {
  .action-button {
    text-align: right;
    margin-top: 30px;
    .commit-button {
      margin-left: 15px;
    }
  }
}
</style>
