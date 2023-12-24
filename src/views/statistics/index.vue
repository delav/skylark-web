<template>
  <div class="statistics">
    <div class="header">
      <div class="header-item">
        <span class="item-label">部门：</span>
        <el-select
          v-model="queryParams.department_id"
          placeholder="选择部门"
          @change="changeDepartment"
        >
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="header-item">
        <span class="item-label">团队：</span>
        <el-select
          v-model="queryParams.group_id"
          placeholder="选择团队"
          @change="changeGroup"
        >
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="header-item">
        <span class="item-label">项目：</span>
        <el-select
          v-model="queryParams.project_id"
          placeholder="选择项目"
          @change="changeProject"
        >
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
<!--      <div class="header-item">-->
<!--        <span class="item-label">环境：</span>-->
<!--        <el-select-->
<!--          v-model="queryParams.env_id"-->
<!--          placeholder="选择环境"-->
<!--          @change="changeProject"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in envList"-->
<!--            :key="item.id"-->
<!--            :label="item.name"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
<!--      </div>-->
      <div class="header-item overview-button">
        <el-button type="primary" @click="routeOverview">重置</el-button>
      </div>
    </div>
    <div class="body">
<!--      <router-view :key="key"></router-view>-->
      <component :is="component"></component>
    </div>
  </div>
</template>

<script>
import Overview from "@/views/statistics/overview";
import GroupView from "@/views/statistics/group";
import ProjectView from "@/views/statistics/project";
import { fetchProjectInfo } from "@/api/base";

export default {
  name: 'Statistics',
  components: {
    Overview,
    GroupView,
    ProjectView
  },
  computed: {
    overviewPath() {
      return '/statistics/overview'
    },
    envList() {
      return this.$store.state.base.envList
    }
  },
  data() {
    return {
      component: 'Overview',
      componentType: {
        overview: 0,
        group: 1,
        project: 2
      },
      queryParams: {
        department_id: '',
        group_id: '',
        project_id: '',
      },
      departmentList: [],
      allGroupList: [],
      allProjectList: [],
      groupList: [],
      projectList: []
    }
  },
  created() {
    this.getProjectInfo()
  },
  mounted() {
    this.$store.dispatch('base/getBaseInfo')
  },
  methods: {
    setComponent(t) {
      if (t === this.componentType.group) {
        this.component = 'GroupView'
      } else if (t === this.componentType.project) {
        this.component = 'ProjectView'
      } else {
        this.component = 'Overview'
      }
    },
    getProjectInfo() {
      fetchProjectInfo().then(response => {
        const projectInfo = response.data
        this.departmentList = projectInfo['department_list']
        this.allGroupList = projectInfo['group_list']
        this.allProjectList = projectInfo['project_list']
        this.initQueryParams()
      })
    },
    initQueryParams() {
      let itemId = this.$route.query.id
      let itemType = this.$route.query.type
      if (itemId === undefined || itemType === undefined) {
        return
      }
      itemId = itemId.replace(/[^0-9]/ig, '')
      itemType = itemType.replace(/[^0-9]/ig, '')
      if (itemId === '' || itemType === '') {
        return
      }
      itemId = parseInt(itemId)
      itemType = parseInt(itemType)
      const initQueryParams = {
        department_id: '',
        group_id: '',
        project_id: ''
      }
      if (itemType === this.componentType.project) {
        for (let i = 0; i < this.allProjectList.length; i++) {
          if (this.allProjectList[i]['id'] === itemId) {
            initQueryParams.project_id = itemId
            initQueryParams.group_id = this.allProjectList[i]['group_id']
            break
          }
        }
        if (initQueryParams.project_id === '') {
          return
        }
        for (let j = 0; j < this.allGroupList.length; j++) {
          if (this.allGroupList[j]['id'] === initQueryParams.group_id) {
            initQueryParams.department_id = this.allGroupList[j]['department_id']
            break
          }
        }
        this.groupList = this.allGroupList.filter((item) => {
          return item['department_id'] === initQueryParams.department_id
        })
        this.projectList = this.allProjectList.filter((item) => {
          return item['group_id'] === initQueryParams.group_id
        })
        this.queryParams = initQueryParams
        this.setComponent(itemType)
      } else if (itemType === this.componentType.group) {
        for (let j = 0; j < this.allGroupList.length; j++) {
          if (this.allGroupList[j]['id'] === itemId) {
            initQueryParams.group_id = itemId
            initQueryParams.department_id = this.allGroupList[j]['department_id']
            break
          }
        }
        if (initQueryParams.department_id === '') {
          return
        }
        this.groupList = this.allGroupList.filter((item) => {
          return item['department_id'] === initQueryParams.department_id
        })
        this.projectList = this.allProjectList.filter((item) => {
          return item['group_id'] === initQueryParams.group_id
        })
        this.queryParams = initQueryParams
        this.setComponent(itemType)
      } else {
        this.routeOverview()
      }
    },
    changeDepartment(departmentId) {
      this.queryParams.group_id = ''
      this.queryParams.project_id = ''
      this.groupList = this.allGroupList.filter((item) => {
        return item['department_id'] === departmentId
      })
    },
    changeGroup(groupId) {
      this.queryParams.project_id = ''
      this.projectList = this.allProjectList.filter((item) => {
        return item['group_id'] === groupId
      })
      // this.$router.push({
      //   path: this.overviewPath,
      //   query:{type : this.componentType.group, id: groupId}
      // })
      // this.setComponent(this.componentType.group)
    },
    changeProject(projectId) {
      this.$router.push({
        path: this.overviewPath,
        query:{type : this.componentType.project, id: projectId}
      })
      this.setComponent(this.componentType.project)
    },
    routeOverview() {
      Object.assign(this.$data, this.$options.data())
      fetchProjectInfo().then(response => {
        const projectInfo = response.data
        this.departmentList = projectInfo['department_list']
        this.allGroupList = projectInfo['group_list']
        this.allProjectList = projectInfo['project_list']
      })
      this.$router.push(this.overviewPath)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.statistics {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  .header {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    padding: 10px 0;
    margin-bottom: 10px;
    //border: 1px solid #e4e7ed;
    overflow: hidden;
    //border: 1px solid rgba(0, 0, 0, .08);
    //border-radius: 5px;
    //box-shadow: 0 2px 5px rgba(0, 0, 0, .12);
    .header-item {
      padding: 0 10px;
      .item-label {
        color: $textColor;
        font-size: 14px;
      }
    }
    .overview-button {
      margin-left: auto;
    }
  }
}
</style>
