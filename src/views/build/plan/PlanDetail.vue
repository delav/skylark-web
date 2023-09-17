<template>
  <div class="plan-detail">
    <div class="content">
      <div class="card-header">
        <span>计划详情</span>
      </div>
      <div class="card-body">
        <div class="detail">
          <el-descriptions>
            <el-descriptions-item label="计划名称：">{{planDetailData['title']}}</el-descriptions-item>
            <el-descriptions-item label="创建用户：">{{planDetailData['create_by']}}</el-descriptions-item>
            <el-descriptions-item label="创建时间：">{{planDetailData['create_at']}}</el-descriptions-item>
            <el-descriptions-item label="更新用户：">{{planDetailData['update_by']}}</el-descriptions-item>
            <el-descriptions-item label="更新时间：">{{planDetailData['update_at']}}</el-descriptions-item>
            <el-descriptions-item label="用例总数：">{{planDetailData['total_case']}}</el-descriptions-item>
            <el-descriptions-item label="定时任务：">
              <el-switch
                v-model="planDetailData['periodic_switch']"
                active-text="打开"
                inactive-text="关闭"
                disabled
              />
            </el-descriptions-item>
            <el-descriptions-item label="定时配置：">{{planDetailData['periodic_expr']}}</el-descriptions-item>
            <el-descriptions-item label="执行环境：">
              <el-tag
                v-for="(id, index) in planDetailData['env_list']"
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
                v-for="(id, index) in planDetailData['region_list']"
                :key="index"
                style="margin-left: 2px"
                type="info"
                size="small"
              >
                {{ regionMap[id] }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="关联项目：">{{planDetailData['project_name']}}</el-descriptions-item>
            <el-descriptions-item label="项目分支：">{{planDetailData['branch']}}</el-descriptions-item>
            <el-descriptions-item label="通知开关：">
              <el-switch
                v-model="planDetailData['notice_switch']"
                active-text="打开"
                inactive-text="关闭"
                disabled
              />
            </el-descriptions-item>
            <el-descriptions-item label="预期通过率：">
              <el-progress
                style="display: inline-flex;width: 180px;"
                :percentage="planDetailData['expect_pass']"
              />
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="related-record">
          <p class="record-desc">最近执行记录</p>
          <el-table
            :data="planDetailData['record']"
            :header-cell-style="{fontSize:'13px'}"
            :cell-style="{color: '#666', fontSize:'13px'}"
            border
            style="width: 100%">
            <el-table-column prop="id" label="编号" width="70" />
            <el-table-column prop="desc" label="描述" min-width="15%" show-overflow-tooltip>
              <template #default="scope">
                <el-link @click="routeToRecordDetail(scope.row.id)" :underline="false">{{ scope.row.desc }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="构建状态" width="100">
              <template #default="scope">
                <span v-if="scope.row.status===0">运行中</span>
                <span v-if="scope.row.status===1">已完成</span>
              </template>
            </el-table-column>
            <el-table-column prop="env_list" label="执行环境" min-width="10%" show-overflow-tooltip >
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
            <el-table-column prop="region_list" label="执行地区" min-width="10%" show-overflow-tooltip v-if="showRegion">
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
            <el-table-column prop="create_by" label="执行用户" min-width="10%" show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="create_at" label="执行时间" width="180" show-overflow-tooltip >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlanDetail } from "@/api/plan";

export default {
  name: 'PlanDetail',
  data() {
    return {
      planDetailData: {}
    }
  },
  computed: {
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
    const planId = this.$route.params.id
    this.getPlanDetailByPlanId(planId)
  },
  methods: {
    getPlanDetailByPlanId(planId) {
      getPlanDetail(planId).then(response => {
        this.planDetailData = response.data
      })
    },
    routeToRecordDetail(recordId) {
      this.$router.push(`/build/record/detail/${recordId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-detail {
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
      .related-record {
        .record-desc {
          font-size: 14px;
          margin: 20px 0 8px 0;
          color: #606060;
        }
      }
    }
  }
}
</style>
