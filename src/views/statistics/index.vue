<template>
  <div class="statistics">
    <div class="header">
      <div class="header-item overview-button">
        <el-button type="primary" @click="routeOverview">总览</el-button>
      </div>
      <div class="header-item department-filter">
        <span class="item-label">部门：</span>
        <el-select
          v-model="queryParams.department_id"
          placeholder="选择部门"
        >
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            @click="changeDepartment(item.id)"
          />
        </el-select>
      </div>
      <div class="header-item department-filter">
        <span class="item-label">团队：</span>
        <el-select
          v-model="queryParams.group_id"
          placeholder="选择团队"
        >
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            @click="routeGroupStatistics(item.id)"
          />
        </el-select>
      </div>
      <div class="header-item department-filter">
        <span class="item-label">项目：</span>
        <el-select
          v-model="queryParams.project_id"
          placeholder="选择项目"
        >
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            @click="routeProjectStatistics(item.id)"
          />
        </el-select>
      </div>
    </div>
    <div class="body">
      <router-view :key="key"></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Statistics',
  computed: {
    key() {
      return this.$route.path
    },
    departmentList() {
      return this.$store.state.statistics.departmentList
    }
  },
  data() {
    return {
      queryParams: {
        department_id: '',
        group_id: '',
        project_id: '',
      },
      groupList: [],
      projectList: []
    }
  },
  created() {
    if (this.departmentList.length === 0) {
      this.$store.dispatch('statistics/getProjectInfo')
    } else {
      this.recoverSelectData()
    }
  },
  methods: {
    recoverSelectData() {
      const queryParams = this.$store.state.statistics.selectedInfo
      if (queryParams.project_id !== undefined && queryParams.project_id !== '') {
        this.changeDepartment(queryParams.department_id)
        this.changeGroup(queryParams.group_id)
        this.queryParams.project_id = queryParams.project_id
        return
      }
      if (queryParams.group_id !== undefined && queryParams.group_id !== '') {
        this.changeDepartment(queryParams.department_id)
        this.queryParams.group_id = queryParams.group_id
      }
    },
    changeDepartment(departmentId) {
      const allGroupList = this.$store.state.statistics.groupList
      this.groupList = allGroupList.filter((item) => {
        return item['department_id'] === departmentId
      })
      this.queryParams.department_id = departmentId
      this.queryParams.group_id = ''
      this.queryParams.project_id = ''
    },
    changeGroup(groupId) {
      const allProjectList = this.$store.state.statistics.projectList
      this.projectList = allProjectList.filter((item) => {
        return item['group_id'] === groupId
      })
      this.queryParams.group_id = groupId
      this.queryParams.project_id = ''
    },
    routeOverview() {
      this.$store.commit('statistics/SET_SELECT_INFO', this.queryParams)
      this.$router.push(`/statistics/overview`)
    },
    routeGroupStatistics() {
      const groupId = this.queryParams.group_id
      this.changeGroup(groupId)
      this.$store.commit('statistics/SET_SELECT_INFO', this.queryParams)
      this.$router.push(`/statistics/group/${groupId}`)
    },
    routeProjectStatistics(projectId) {
      this.queryParams.project_id = projectId
      this.$store.commit('statistics/SET_SELECT_INFO', this.queryParams)
      this.$router.push(`/statistics/project/${projectId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.statistics {
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    padding: 10px 0;
    margin-bottom: 10px;
    border: 1px solid #e4e7ed;
    overflow: hidden;
    .header-item {
      padding: 0 10px;
      .item-label {
        color: $textColor;
        font-size: 14px;
      }
    }
  }
}
</style>
