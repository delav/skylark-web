<template>
  <div class="record-list">
    <div class="operate-header">
      <div class="header-item project-filter">
        <span class="item-desc">项目：</span>
        <el-select
          v-model="queryParams.project_id"
          placeholder="Select"
          @change="filterRecords"
        >
          <el-option
            v-for="item in allProjectList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="header-item user-filter">
        <span class="item-desc">执行用户：</span>
        <el-select
          v-model="queryParams.create_by"
          placeholder="Select"
          @change="filterRecords"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="header-item time-filter">
        <span class="item-desc">执行时间：</span>
        <el-date-picker
          v-model="queryParams.date_range"
          type="daterange"
          unlink-panels
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
        />
      </div>
    </div>
    <div class="item-body">
      <el-table
        :data="recordList"
        :header-cell-style="{fontSize:'13px'}"
        :cell-style="{color: '#666', fontSize:'13px'}"
        border
        style="width: 100%">
        <el-table-column prop="id" label="编号" width="70" />
        <el-table-column prop="desc" label="描述" show-overflow-tooltip>
          <template #default="scope">
            <el-link type="primary" @click="routeToRecordDetail(scope.row.id)" :underline="false">{{ scope.row.desc }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="plan_id" label="计划编号" width="80">
          <template #default="scope">
            <el-link @click="routeToPlanDetail(scope.row.plan_id)" :underline="false">{{ scope.row.plan_id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="执行状态" width="90">
          <template #default="scope">
            <el-tag type="warning" v-if="scope.row.status===0">运行中</el-tag>
            <el-tag type="success" v-if="scope.row.status===1">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="env_list" label="执行环境" width="160" min-width="120" show-overflow-tooltip >
          <template #default="scope">
            <el-tag
              v-for="(id, index) in scope.row.env_list"
              :key="index"
              style="margin-left: 2px"
              type="info"
              size="small"
            >
              {{ envMap[id] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="region_list" label="执行地区" width="120" min-width="100" show-overflow-tooltip v-if="showRegion">
          <template #default="scope">
            <el-tag
              v-for="(id, index) in scope.row.region_list"
              :key="index"
              style="margin-left: 2px"
              size="small"
              type="info"
            >
              {{ regionMap[id] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_by" label="执行用户" width="180" show-overflow-tooltip >
        </el-table-column>
        <el-table-column prop="create_at" label="执行时间" width="170" show-overflow-tooltip >
        </el-table-column>
        <el-table-column prop="periodic" label="定时执行" width="80" min-width="80">
          <template #default="scope">
            <el-tag size="small" type="success" v-if="scope.row.periodic">是</el-tag>
            <el-tag size="small" type="danger" v-else>否</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        small
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
      queryParams: {
        project_id: 0,
        create_by: '',
        date_range: []
      }
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
    },
    userList() {
      return this.$store.state.base.userList
    }
  },
  mounted() {
    this.getRecordList(1, {})
  },
  methods: {
    getRecordList(page, params) {
      fetchRecords(page, this.pageSize, params).then(response => {
        const result = response.data
        this.recordList = result.data
        this.total = result.total
      })
    },
    changePage(pageVal) {
      this.getRecordList(pageVal, this.queryParams)
    },
    filterRecords() {
      this.getRecordList(1, this.queryParams)
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
  overflow: auto;
  .operate-header {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    .header-item {
      padding-bottom: 10px;
      padding-right: 15px;
      .item-desc {
        color: #666;
        font-size: 14px;
      }
    }
    .project-filter {

    }
    .user-filter {

    }
    .time-filter {

    }
  }
}
</style>
