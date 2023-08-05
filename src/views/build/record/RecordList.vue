<template>
  <div class="record-list">
    <div class="operate-header">
      <el-select
        v-model="selectProjectId"
        placeholder="Select"
        @change="getRecordsByProject"
      >
        <el-option
          v-for="item in allProjectList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="item-body">
      <el-table :data="recordList" border style="width: 100%">
        <el-table-column fixed prop="desc" label="描述" min-width="15%" show-overflow-tooltip>
          <template #default="scope">
            <el-link @click="routeToRecordDetail" :underline="false">{{ scope.row.desc }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="plan_id" label="关联计划" min-width="10%">
          <template #default="scope">
            <el-link @click="routeToPlanDetail" :underline="false">{{ scope.row.plan_id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100px">
          <template #default="scope">
            <span v-if="scope.row.status===0">运行中</span>
            <span v-if="scope.row.status===1">已完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="envs" label="执行环境" min-width="10%" show-overflow-tooltip >
          <template #default="scope">
            <el-tag
              v-for="(id, index) in scope.row.envs.split(',')"
              :key="index"
              style="margin-left: 2px"
              type="info"
              size="small"
            >
              {{ envMap[id] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="regions" label="执行地区" min-width="10%" show-overflow-tooltip v-if="showRegion">
          <template #default="scope">
            <el-tag
              v-for="(id, index) in scope.row.regions.split(',')"
              :key="index"
              style="margin-left: 2px"
              size="small"
              type="info"
            >
              {{ regionMap[id] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_by" label="创建用户" min-width="10%" show-overflow-tooltip >
        </el-table-column>
        <el-table-column prop="create_at" label="创建时间" width="180px" show-overflow-tooltip >
        </el-table-column>
        <el-table-column prop="periodic" label="定时任务" width="90px">
          <template #default="scope">
            <span v-if="scope.row.periodic">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { fetchRecords } from "@/api/record";

export default {
  name: 'PlanList',
  data() {
    return {
      projectList: [],
      recordList: [],
      total: 0,
      pageSize: 12,
      selectProjectId: 0,
      showBuild: false,
    }
  },
  computed: {
    showRegion() {
      return this.$store.state.base.showRegion
    },
    envMap() {
      return this.$store.state.base.envMap
    },
    regionMap() {
      return this.$store.state.base.regionMap
    },
    allProjectList() {
      return this.$store.state.base.containAllProjectList
    }
  },
  created() {
    this.getRecordList(1)
  },
  methods: {
    getRecordList(page, projectId=null) {
      fetchRecords(page, this.pageSize, projectId).then(response => {
        const result = response.data
        this.recordList = result.data
        this.total = result.total
      })
    },
    changePage(pageVal) {
      if (this.selectProjectId === 0) {
        this.getRecordList(pageVal)
      } else {
        this.getRecordList(pageVal, this.selectProjectId)
      }
    },
    getRecordsByProject(projectId) {
      if (projectId === 0) {
        this.getRecordList(1)
      } else {
        this.getRecordList(1, projectId)
      }
    },
    routeToRecordDetail(recordId) {
      this.$router.push(`/build/record/detail/${recordId}`)
    },
    routeToPlanDetail(planId) {
      this.$router.push(`/build/plan/detail/${planId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.record-list {
  width: 100%;
  height: 100%;
  padding: 5px;
  .operate-header {
    width: 100%;
    height: 50px;
    display: flex;
  }
}
</style>
