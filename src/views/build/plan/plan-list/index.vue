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
    <div class="item-body"></div>
  </div>
</template>

<script>
import { fetchPlans } from '@/api/plan'

export default {
  name: 'PlanList',
  data() {
    return {
      planList: [],
      projectId: '',
    }
  },
  computed: {
    projectList() {
      return this.$store.state.project.projectList
    }
  },
  created() {
    // this.getPlanList()
  },
  methods: {
    getPlanList() {
      fetchPlans(1, 10).then(response => {
        this.planList = response.data
      })
    },
    gotoCreatePlan () {
      this.$store.commit('build/SET_RIGHT_PAGE', 3)
    }
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
