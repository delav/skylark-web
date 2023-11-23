<template>
  <div class="hook-detail">
    <div class="content">
      <el-descriptions :column="2">
        <el-descriptions-item label="Hook名称：">{{hookData['name']}}</el-descriptions-item>
        <el-descriptions-item label="Hook地址：">{{hookData['payload_url']}}</el-descriptions-item>
        <el-descriptions-item label="Hook类型：">{{hookData['hook_type']}}</el-descriptions-item>
        <el-descriptions-item label="创建用户：">{{hookData['update_by']}}</el-descriptions-item>
        <el-descriptions-item label="创建时间：">{{hookData['create_at']}}</el-descriptions-item>
        <el-descriptions-item label="Hook描述：">{{hookData['desc']}}</el-descriptions-item>
        <el-descriptions-item label="执行计划ID：" v-if="hookData['plan_list']">{{hookData['plan_list']}}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HookDetail',
  props: {
    hookData: Object
  },
}
</script>

<style lang="scss" scoped>

</style>
