<template>
  <div class="project-config">
    <div class="card-header">
      <span class="item-label">项目：</span>
      <el-select
        class="project-selector"
        v-model="selectProjectId"
        placement="bottom-start"
        placeholder="选择项目"
        :popper-append-to-body="false"
        @change="changeProject"
      >
        <el-option
          v-for="(item, index) in projectList"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="card-body"></div>
  </div>
</template>

<script>
export default {
  name: 'Project',
  computed: {
    projectList() {
      return this.$store.state.base.projectList
    },
  },
  watch: {
    '$store.state.base.baseLoaded': {
      handler() {
        if (this.projectList.length !== 0 && this.selectProjectId === '') {
          const globalProject = this.$store.state.base.globalProject
          if (globalProject !== '') {
            this.changeProject(globalProject)
          } else {
            this.changeProject(this.projectList[0]['id'])
          }
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      selectProjectId: ''
    }
  },
  methods: {
    changeProject() {}
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.project-config {
  width: 100%;
  height: 100%;
  padding: 0 5px;
  .card-header {
    padding: 10px 0;
    margin-bottom: 10px;
    border: 1px solid #e4e7ed;
    overflow: hidden;
    .item-label {
      font-size: 14px;
      padding-left: 10px;
      color: $textColor;
    }
    .project-selector {
      padding-left: 5px;
    }
  }
}
</style>
