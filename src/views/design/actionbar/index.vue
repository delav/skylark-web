<template>
  <div class="action-bar">
    <el-row>
      <el-col :span="4">
        <div class="project-list">
          <el-select
            v-model="currentPId"
            @change="handlerProject"
            placeholder="选择项目">
            <el-option
              v-for="(item, index) in projectList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :span="20">
        <svg-icon icon-class="run"></svg-icon>
        <svg-icon icon-class="stop"></svg-icon>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import { fetchProjectList } from '@/api/project'

export default {
  name: 'ActionBar',
  components: {
    SvgIcon
  },
  data() {
    return {
      projectList: [],
      currentPId: ''
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    getProjects() {
      fetchProjectList(1, 20).then(response => {
        this.projectList = response.data
      })
    },
    handlerProject() {
      this.$store.commit('tree/SET_CURRENT_PROJECT', this.currentPId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.scss";
@import "src/styles/element/selector.scss";

.action-bar {
  height: $toolbarHeight;
  background-color: $toolbarBg;

  .project-list {
    padding: 0 10px;
  }
  .svg-icon {
    width: 22px;
    height: 22px;
    margin-top: 4px;
    margin-left: 10px;
    color: #888888;
  }
}
</style>
