<template>
  <div class="record-list">
    <div class="operate-header">
      <div class="header-item project-filter">
        <span class="item-desc">项目：</span>
        <el-select
          v-model="queryParams.project_id"
          placeholder="选择项目"
          filterable
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
        <span class="item-desc">构建用户：</span>
        <el-select
          v-model="queryParams.create_by"
          placeholder="选择用户"
          filterable
          @change="filterRecords"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.email"
            :value="item.email"
          />
        </el-select>
      </div>
      <div class="header-item time-filter">
        <span class="item-desc">构建时间：</span>
        <el-date-picker
          v-model="queryParams.date_range"
          type="daterange"
          :disabled-date="disabledDate"
          value-format="YYYY-MM-DD"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="filterRecords"
        />
      </div>
    </div>
    <div class="item-body">
      <el-table
        v-loading="loading"
        :data="recordList"
        :header-cell-style="{fontSize:'13px', background: '#f4f5f7'}"
        :cell-style="{color: '#666', fontSize:'13px'}"
        border
        stripe
        style="width: 100%">
        <el-table-column prop="id" label="编号" width="70" />
        <el-table-column prop="desc" label="标题" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="plan_id" label="关联计划" width="80" min-width="80">
          <template #default="scope">
            <el-link @click="routeToPlanDetail(scope.row.plan_id)" :underline="false">{{ scope.row.plan_id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" min-width="100">
          <template #default="scope">
            <el-tag type="warning" v-if="scope.row.status===0">{{ scope.row.status_desc }}</el-tag>
            <el-tag type="success" v-if="scope.row.status===1">{{ scope.row.status_desc }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="env_list" label="环境" min-width="120" show-overflow-tooltip >
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
        <el-table-column prop="region_list" label="地区" min-width="120" show-overflow-tooltip v-if="showRegion">
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
        <el-table-column prop="create_by" label="构建用户" min-width="100" show-overflow-tooltip >
        </el-table-column>
        <el-table-column prop="create_at" label="构建时间" min-width="100" show-overflow-tooltip >
        </el-table-column>
        <el-table-column prop="periodic" label="定时构建" width="80" min-width="80">
          <template #default="scope">
            <el-tag size="small" type="success" v-if="scope.row.periodic">是</el-tag>
            <el-tag size="small" type="danger" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="90">
          <template #default="scope">
            <el-button type="primary" size="small" @click="routeToRecordDetail(scope.row.id)" link>详情</el-button>
            <el-button type="primary" @click="refreshRecord(scope.$index, scope.row.id)" link>
              <el-icon><RefreshRight /></el-icon>
            </el-button>
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
import { fetchRecords, queryRecordStatus } from "@/api/record";
import { deepCopy } from "@/utils/dcopy";

export default {
  name: 'PlanList',
  data() {
    return {
      loading: true,
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
        this.loading = false
        const result = response.data
        this.recordList = result.data
        this.total = result.total
      }).catch(() => {
        this.loading = false
      })
    },
    changePage(pageVal) {
      const params = deepCopy(this.queryParams)
      if (this.queryParams['project_id'] === 0) {
        delete params['project_id']
      }
      this.getRecordList(pageVal, params)
    },
    disabledDate(time) {
      return time.getTime() > Date.now() + 8.64e7 * 3
    },
    filterRecords() {
      const params = deepCopy(this.queryParams)
      if (this.queryParams['project_id'] === 0) {
        delete params['project_id']
      }
      if (this.queryParams.date_range) {
        params['s_date'] = this.queryParams.date_range[0]
        params['e_date'] = this.queryParams.date_range[1]
      }
      this.getRecordList(1, params)
    },
    refreshRecord(index, recordId) {
      queryRecordStatus(recordId).then(response => {
        this.recordList[index] = response.data
      })
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
@import "src/styles/variables.module.scss";

.record-list {
  width: 100%;
  height: 100%;
  padding: 0 5px;
  margin-bottom: 5px;
  overflow: auto;
  .operate-header {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    padding: 10px 0 0 10px;
    //box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border: 1px solid #e4e7ed;
    overflow: hidden;
    .header-item {
      padding: 0 10px 10px 0;
      .item-desc {
        color: $textColor;
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
