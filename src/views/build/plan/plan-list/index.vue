<template>
  <div class="plan-list">
    <div class="operate-header">
      <el-select v-model="projectId" placeholder="Select">
        <el-option
          v-for="item in projectList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" @click="gotoCreatePlan">新建计划</el-button>
    </div>
    <div class="item-body">
      <el-table :data="planList" border style="width: 100%">
        <el-table-column fixed prop="title" label="计划名称" min-width="15%" show-overflow-tooltip />
        <el-table-column prop="project_id" label="项目名称" min-width="10%" show-overflow-tooltip >
          <template #default="scope">
            <span>{{projectMap[scope.row.project_id]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="project_id" label="执行环境" min-width="10%" show-overflow-tooltip >
          <template #default="scope">
            <span>{{projectMap[scope.row.project_id]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="project_id" label="执行地区" min-width="10%" show-overflow-tooltip >
          <template #default="scope">
            <span>{{projectMap[scope.row.project_id]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="25%" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="180">
          <el-button-group>
            <el-button type="warning" :icon="Star" circle />
          </el-button-group>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>
  </div>
</template>

<script>
import {fetchPlans} from '@/api/plan'

export default {
  name: 'PlanList',
  data() {
    return {
      planList: [],
      projectId: '',
      projectMap: {},
      envMap: {}
    }
  },
  computed: {
    projectList() {
      return this.$store.state.project.projectList
    },
    envList() {
      return this.$store.state.project.envList
    }
  },
  created() {
    this.getPlanList()
    this.transferList2Map()
  },
  methods: {
    getPlanList() {
      fetchPlans(1, 10).then(response => {
        this.planList = response.data
      })
    },
    transferList2Map () {
      for (let i = 0; i < this.projectList.length; i++) {
        const projectId = this.projectList[i]['id']
        this.projectMap[projectId] = this.projectList[i]['name']
      }
      for (let i = 0; i < this.envList.length; i++) {
        const envId = this.envList[i]['id']
        this.envMap[envId] = this.envList[i]['name']
      }
    },
    transferIdString () {

    },
    gotoCreatePlan () {
      this.$store.commit('build/SET_RIGHT_PAGE', 3)
    },
    executeBuild () {}
  }
}
</script>

<style lang="scss" scoped>
.plan-list {
  width: 100%;
  height: 100%;
  .operate-header {
    width: 100%;
    height: 100px;
  }
}
</style>
