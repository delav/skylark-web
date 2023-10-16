<template>
  <div class="plan-list">
    <div class="operate-header">
      <div class="header-item project-filter">
        <span class="item-label">项目：</span>
        <el-select
          v-model="queryParams.project_id"
          placeholder="选择项目"
          @change="filterPlans"
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
        <span class="item-label">创建用户：</span>
        <el-select
          v-model="queryParams.create_by"
          placeholder="选择用户"
          @change="filterPlans"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.email"
            :value="item.email"
          />
        </el-select>
      </div>
      <div class="header-item new-button">
        <el-button type="primary" @click="newPlan">新建计划</el-button>
      </div>
    </div>
    <div class="item-body">
      <el-table
        v-loading="loading"
        :data="planList"
        :header-cell-style="{fontSize:'13px', background: '#f4f5f7'}"
        :cell-style="{color: '#666', fontSize:'13px'}"
        border
        stripe
        style="width: 100%">
        <el-table-column prop="id" label="编号" width="70" />
        <el-table-column prop="title" label="计划标题" min-width="150" show-overflow-tooltip />
        <el-table-column prop="project_id" label="项目" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <span>{{projectMap[scope.row.project_id]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="branch" label="分支" min-width="100" show-overflow-tooltip  />
        <el-table-column prop="env_id" label="环境" min-width="120" show-overflow-tooltip >
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
        <el-table-column prop="region_id" label="地区" min-width="120" show-overflow-tooltip v-if="showRegion">
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
        <el-table-column prop="total_case" label="用例总数" width="80" min-width="80" show-overflow-tooltip >
          <template #default="scope">
            <span>{{scope.row.total_case}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="periodic_switch" label="定时开关" width="80" min-width="80" show-overflow-tooltip>
          <template #default="scope">
            <el-tag size="small" type="success" v-if="scope.row.periodic_switch">开</el-tag>
            <el-tag size="small" type="danger" v-else>关</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="periodic_expr" label="定时配置" min-width="100" show-overflow-tooltip>
          <template #default="scope">
            <span>{{scope.row.periodic_expr}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="145">
<!--          <template #header>-->
<!--            <el-button style="height: 28px" type="primary" @click="newPlan">新建计划</el-button>-->
<!--          </template>-->
          <template #default="scope">
            <el-button
              style="margin-right: 10px;width: 20px;height: 20px"
              type="primary"
              size="small"
              @click="preBuild(scope.row)"
              circle
            >
              <el-icon :size="18"><CaretRight /></el-icon>
            </el-button>
            <el-button-group>
              <el-button type="warning" size="small" @click="editPlan(scope.row)" link>编辑</el-button>
              <el-button type="primary" size="small" @click="gotoPlanDetail(scope.row.id)" link>详情</el-button>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                :hide-icon="true"
                :hide-after="50"
                title="确定删除该计划？"
                @confirm="confirmDeletePlan(scope.row.id)"
              >
                <template #reference>
                  <el-button type="danger" size="small" link>删除</el-button>
                </template>
              </el-popconfirm>
            </el-button-group>
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
    <div class="dialog-area">
      <div class="plan-edit">
        <el-dialog
          width="700px"
          v-model="showPlanEdit"
          :title="editTitle"
          :close-on-click-modal="false"
          destroy-on-close
        >
          <div class="content">
            <plan-form
              :plan-data="planData"
              @cancel="cancelEdit"
              @confirm="confirmSavePlan"
            />
          </div>
        </el-dialog>
      </div>
      <div class="plan-build">
        <el-dialog
          width="600px"
          v-model="showBuild"
          title="执行构建"
          :close-on-click-modal="false"
          destroy-on-close
        >
          <div class="content">
            <instant-build
              :build-data="buildData"
              @cancel="cancelBuild"
              @confirm="executeBuild"
            />
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import PlanForm from "@/views/build/plan/components/PlanForm";
import InstantBuild from "@/views/build/plan/components/InstantBuild";
import { fetchPlans, deletePlan, updatePlan, createPlan } from "@/api/plan";
import { buildInstantTest } from "@/api/builder";
import {deepCopy} from "@/utils/dcopy";

export default {
  name: 'PlanList',
  components: {
    PlanForm,
    InstantBuild
  },
  data() {
    return {
      loading: true,
      planList: [],
      total: 0,
      pageSize: 12,
      showBuild: false,
      showPlanEdit: false,
      editTitle: '',
      planData: {},
      buildData: {},
      queryParams: {
        project_id: 0,
        create_by: ''
      }
    }
  },
  computed: {
    projectMap() {
      return this.$store.state.base.projectMap
    },
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
    this.getPlanList(1, {})
  },
  methods: {
    getPlanList(page, params) {
      const validParams = Object.keys(params)
        .filter((key) => params[key] !== 0 && params[key] !== '' && params[key] !== null && params[key] !== undefined)
        .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {})
      fetchPlans(page, this.pageSize, validParams).then(response => {
        this.loading = false
        const result = response.data
        this.planList = result.data
        this.total = result.total
      }).catch(() => {
        this.loading = false
      })
    },
    filterPlans() {
      const params = deepCopy(this.queryParams)
      if (this.queryParams['project_id'] === 0) {
        delete params['project_id']
      }
      this.getPlanList(1, this.queryParams)
    },
    newPlan() {
      this.planData = {}
      this.editTitle = '新建计划'
      this.showPlanEdit = true
    },
    editPlan(plan) {
      this.planData = plan
      this.editTitle = '更新计划'
      this.showPlanEdit = true
    },
    confirmSavePlan(params) {
      const planId = params['id']
      if (planId === undefined) {
        createPlan(params).then(() => {
          this.showPlanEdit = false
          this.getPlanList(1, this.queryParams)
        })
      } else {
        delete params['id']
        updatePlan(planId, params).then(() => {
          this.showPlanEdit = false
          this.getPlanList(1, this.queryParams)
        })
      }
    },
    gotoPlanDetail(planId) {
      this.$router.push(`/build/plan/detail/${planId}`)
    },
    confirmDeletePlan(planId) {
      deletePlan(planId).then(() => {
        this.getPlanList(1, this.queryParams)
      })
    },
    preBuild(planData) {
      this.buildData = planData
      this.showBuild = true
    },
    cancelEdit() {
      this.showPlanEdit = false
    },
    cancelBuild() {
      this.showBuild = false
    },
    executeBuild(params) {
      buildInstantTest(params).then(() => {
        this.showBuild = false
        this.$router.push('/build/record/list')
      }).catch(() => (
        this.showBuild = false
      ))
    },
    changePage(pageVal) {
      this.getPlanList(pageVal, this.queryParams)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.plan-list {
  width: 100%;
  height: 100%;
  padding: 0 5px;
  margin-bottom: 5px;
  overflow: auto;
  .operate-header {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    padding: 10px 0;
    //box-shadow: 0 0 5px rgba(0, 0, 0, 0.10);
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
    .project-filter {

    }
    .user-filter {

    }
    .time-filter {

    }
    .new-button {
      margin-left: auto;
    }
  }
}
</style>
