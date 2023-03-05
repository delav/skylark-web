<template>
  <div class="new-project">
    <div class="project-info">
      <el-input class="project-name" placeholder="输入项目名称" type="text" v-model.trim="newProjectName"></el-input>
    </div>
    <div class="copy-info">
      <p class="copy-switch">
        <span class="switch-text">是否复制已有项目</span>
        <span class="switch-item">
          <el-switch
            v-model="openCopyProject"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #bdc6ce"
            active-text="是"
            inactive-text="否"
          />
        </span>
        <span class="project-list" v-show="openCopyProject">
          <el-select style="width: 280px" v-model="selectProjectId" placeholder="Select">
            <el-option
              v-for="(item, index) in projectList"
              :key="index"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </span>
      </p>
    </div>
    <el-button class="new-button" @click="createNewProject" type="primary">创建</el-button>
  </div>
</template>

<script>
import { ElLoading } from 'element-plus'
import { createProject } from '@/api/project'

export default {
  name: 'NewProject',
  data() {
    return {
      newProjectName: '',
      openCopyProject: false,
      selectProjectId: null,
    }
  },
  computed: {
    projectList() {
      return this.$store.state.project.projectList
    },
  },
  created() {
  },
  methods: {
    createNewProject() {
      let createData = {}
      createData['name'] = this.newProjectName
      if (this.openCopyProject && this.selectProjectId !== null) {
        createData['copy_pid'] = this.selectProjectId
      }
      this.$emit('closeDialog')
      const loading = ElLoading.service({
        lock: true,
        text: '创建项目中，请稍后...',
        background: 'rgba(0, 0, 0, 0.8)',
      })
      createProject(createData).then(response => {
        loading.close()
        const newProjectData = response.data
        this.$store.dispatch('project/getProjects')
        this.$emit('successAction', newProjectData)
      }).catch(() => {
        loading.close()
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.new-project {
  width: 100%;
  height: 100%;
  .project-info {
    width: 100%;
    height: 100%;
    .project-name {

    }
  }
  .copy-info {
    width: 100%;
    height: 100%;
    margin-top: 20px;
    .copy-switch {
      margin: 0;
      .switch-item {
        margin-left: 25px;
      }
      .project-list {
        float: right;
      }
    }
  }
  .new-button {
    width: 100%;
    margin-top: 40px;
  }
}

</style>
