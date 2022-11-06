<template>
  <div class="case-config">
    <el-collapse>
      <el-collapse-item title="Consistency" name="1">
        <template slot="title">
          <span class="collapse-title"></span>
        </template>
        <div>
          Consistent with real life: in line with the process and logic of real
          life, and comply with languages and habits that the users are used to;
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such
          as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'CaseConfig'
}
</script>

<style lang="scss" scoped>
@import "src/styles/element/collapse.scss";
.case-config {
  width: 100%;
}
</style>
