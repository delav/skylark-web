<template>
  <div class="keyword-detail">
    <div class="content">
      <el-descriptions :column="2">
        <el-descriptions-item label="组件名称：">{{keywordData['ext_name']}}</el-descriptions-item>
        <el-descriptions-item label="函数名：">{{keywordData['name']}}</el-descriptions-item>
        <el-descriptions-item label="创建时间：">{{keywordData['create_at']}}</el-descriptions-item>
        <el-descriptions-item label="修改时间：">{{keywordData['update_at']}}</el-descriptions-item>
        <el-descriptions-item label="所属分组：">{{keywordData['group_id']}}</el-descriptions-item>
        <el-descriptions-item label="组件功能：">{{keywordData['desc']}}</el-descriptions-item>
        <el-descriptions-item label="输入参数：">{{keywordData['input_params']}}</el-descriptions-item>
        <el-descriptions-item label="参数说明：">{{keywordData['input_desc']}}</el-descriptions-item>
        <el-descriptions-item label="返回值：">{{keywordData['output_params']}}</el-descriptions-item>
        <el-descriptions-item label="返回值说明：">{{keywordData['output_desc']}}</el-descriptions-item>
        <el-descriptions-item label="状态：">{{keywordData['status']}}</el-descriptions-item>
        <el-descriptions-item label="来源：">{{keywordData['source']}}</el-descriptions-item>
        <el-descriptions-item label="图标：">{{keywordData['image']}}</el-descriptions-item>
        <el-descriptions-item label="备注：">{{keywordData['mark']}}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeywordDetail',
  props: {
    keywordData: Object,
    keywordGroup: Array
  },
}
</script>

<style lang="scss" scoped>

</style>
