<template>
  <div class="node-action">
    <el-form ref="newForm" :model="changeFrom" label-width="110px">
      <el-form-item
        prop="name"
        :label="changeFrom.label"
        :rules="[{ required: true, message: 'name is required' }]"
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
      changeFrom: this.dialogForm
    }
  },
  methods: {
    clickCancel() {
      this.$emit('closeDialogAction')
    },
    clickCommit() {
      this.$refs['newForm'].validate((valid) => {
        if (!valid) {
          return
        }
        this.$emit('commitDialogAction', this.changeFrom.name)
      })
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
