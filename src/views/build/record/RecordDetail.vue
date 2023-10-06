<template>
  <div class="record-detail">
    <div class="content">
      <div class="card-header">
        <span>记录详情</span>
      </div>
      <div class="card-body">
        <div class="detail">
          <el-descriptions>
            <el-descriptions-item label="关联计划ID：">
              <template #default="scope">
                <el-link @click="routeToPlanDetail(scope.row.plan_id)">{{recordDetailData['plan_id']}}</el-link>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间：">{{recordDetailData['create_at']}}</el-descriptions-item>
            <el-descriptions-item label="执行用户：">{{recordDetailData['create_by']}}</el-descriptions-item>
            <el-descriptions-item label="执行环境：">
              <el-tag
                v-for="(id, index) in recordDetailData['env_list']"
                :key="index"
                style="margin-left: 2px"
                type="info"
                size="small"
              >
                {{ envMap[id] }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="执行地区：" v-if="showRegion">
              <el-tag
                v-for="(id, index) in recordDetailData['region_list']"
                :key="index"
                style="margin-left: 2px"
                type="info"
                size="small"
              >
                {{ regionMap[id] }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="关联项目：">{{projectMap[recordDetailData['project_id']]}}</el-descriptions-item>
            <el-descriptions-item label="项目分支：">{{recordDetailData['branch']}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="related-history">
          <p class="history-desc">关联记录</p>
          <el-table
            :data="recordDetailData['history']"
            :header-cell-style="{fontSize:'13px'}"
            :cell-style="{color: '#666', fontSize:'13px'}"
            border
            style="width: 100%">
            <el-table-column prop="id" label="编号" width="70" />
            <el-table-column prop="status" label="运行状态" width="100">
              <template #default="scope">
                <span v-if="scope.row.status===-1">等待中</span>
                <span v-if="scope.row.status===0">执行中</span>
                <span v-if="scope.row.status===1">已完成</span>
                <span v-if="scope.row.status===2">已终止</span>
              </template>
            </el-table-column>
            <el-table-column prop="env_id" label="执行环境" min-width="100" show-overflow-tooltip >
              <template #default="scope">
                <el-tag
                  type="info"
                  size="small"
                >
                  {{ envMap[scope.row.env_id] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="region_id" label="执行地区" min-width="100" show-overflow-tooltip v-if="showRegion">
              <template #default="scope">
                <el-tag
                  size="small"
                  type="info"
                >
                  {{ regionMap[scope.row.region_id] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="total_case" label="总用例" width="100" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="failed_case" label="失败用例" width="100" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="failed_case" label="通过用例" width="100" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="skipped_case" label="跳过用例" width="100" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="start_time" label="开始时间" width="100" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="end_time" label="结束时间" width="100" show-overflow-tooltip >
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <el-button-group>
                  <el-button type="primary" size="small" @click="getReportFile(scope.row.id, 'log')" link>日志文件</el-button>
                  <el-button type="primary" size="small" @click="getReportFile(scope.row.id, 'report')" link>报告文件</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecordDetail } from "@/api/record";
import { getHistoryReport } from "@/api/history";

export default {
  name: 'RecordDetail',
  data() {
    return {
      recordDetailData: {}
    }
  },
  computed: {
    projectMap() {
      return this.$store.state.base.projectMap
    },
    envMap() {
      return this.$store.state.base.envMap
    },
    regionMap() {
      return this.$store.state.base.regionMap
    },
    showRegion() {
      return this.$store.state.base.showRegion
    }
  },
  mounted() {
    const recordId = this.$route.params.id
    this.getRecordDetailByRecordId(recordId)
  },
  methods: {
    getRecordDetailByRecordId(recordId) {
      getRecordDetail(recordId).then(response => {
        this.recordDetailData = response.data
      })
    },
    routeToPlanDetail(planId) {
      this.$router.push(`/build/plan/detail/${planId}`)
    },
    getReportFile(historyId, reportType) {
      getHistoryReport(historyId, reportType).then(response => {
        const fileUrl = window.URL.createObjectURL(new Blob([response.data]))
        window.open(fileUrl, '_blank')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.record-detail {
  width: 100%;
  height: 100%;
  .content {
    padding: 0 5px 5px 5px;
    height: 100%;
    border-radius: 2px;
    overflow: auto;
    .card-header {
      padding: 18px 20px;
      border-bottom: 1px solid #e4e7ed;
    }
    .card-body {
      padding: 20px;
      .detail {
      }
      .related-history {
        .history-desc {
          font-size: 14px;
          margin: 20px 0 8px 0;
          color: #606060;
        }
      }
    }
  }
}
</style>
