<template>
  <div class="new-project">
    <div class="project-info">
      <el-input placeholder="输入项目名称" v-model.trim="newProjectName"></el-input>
    </div>
    <div class="project-type">
      <span class="switch-text">是否公开项目
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="personalDesc"
          placement="top-start"
        >
          <el-icon style="vertical-align: -15%;cursor: pointer;margin-left: 3px" size="14px" color="#bfcbd9"><QuestionFilled /></el-icon>
        </el-tooltip>
      </span>
      <span class="switch-item">
          <el-switch
            v-model="isPublic"
            inline-prompt
            style="--el-switch-on-color: #00acc1; --el-switch-off-color: #9DA3A4FF"
            active-text="是"
            inactive-text="否"
          />
        </span>
    </div>
    <div class="copy-info">
      <p class="copy-switch">
        <span class="switch-text">是否复制已有项目</span>
        <span class="switch-item">
          <el-switch
            v-model="copySwitch"
            inline-prompt
            style="--el-switch-on-color: #00acc1; --el-switch-off-color: #9DA3A4FF"
            active-text="是"
            inactive-text="否"
          />
        </span>
        <span class="project-list" v-show="copySwitch">
          <el-select style="width: 320px" v-model="copyProject" placeholder="Select">
            <el-option
              v-for="(item, index) in projectList"
              :key="index"
              :value="item.name"
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
import { ElLoading } from "element-plus";
import { createProject } from "@/api/project";

export default {
  name: 'NewProject',
  data() {
    return {
      newProjectName: '',
      isPublic: false,
      copySwitch: false,
      copyProject: null,
      personalDesc: '公开的项目将允许与你同组的人员查看和编辑项目'
    }
  },
  computed: {
    projectList() {
      return this.$store.state.base.projectList
    },
  },
  mounted() {
  },
  methods: {
    createNewProject() {
      let createData = {}
      if (this.newProjectName === '') {
        this.$message.warning('项目名称不能为空')
        return
      }
      createData['name'] = this.newProjectName
      createData['personal'] = !this.isPublic
      if (this.copySwitch) {
        if (this.copyProject === null) {
          this.$message.warning('请选择复制的项目')
          return
        }
        createData['cname'] = this.copyProject
      }
      this.$emit('closeDialog')
      const loading = ElLoading.service({
        lock: true,
        text: '创建项目中，请稍后...',
        background: 'rgba(0, 0, 0, 0.8)',
      })
      createProject(createData).then(response => {
        loading.close()
        this.$emit('successAction', response.data)
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
  }
  .project-type {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: left;
    .switch-text {
      width: 125px;
    }
    .switch-item {
      width: 50px;
    }
  }
  .copy-info {
    width: 100%;
    height: 35px;
    margin-top: 20px;
    .copy-switch {
      margin: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: left;
      .switch-text {
        width: 125px;
      }
      .switch-item {
        width: 50px;
      }
      .project-list {
        margin-left: auto;
      }
    }
  }
  .new-button {
    width: 100%;
    margin-top: 40px;
  }
}

</style>
