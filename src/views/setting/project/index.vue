<template>
  <div class="project-config">
    <el-card>
      <template #header>
        <div class="card-header">
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
      </template>
      <div class="card-body"></div>
    </el-card>
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
          this.selectProjectId = this.projectList[0]['id']
          this.changeProject()
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
.project-config {
  width: 100%;
  height: 100%;
  padding: 5px;
}
</style>
