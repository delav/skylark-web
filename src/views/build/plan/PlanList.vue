<template>
  <div class="plan-list">
    <div class="operate-header">
      <div class="search-section">
        <el-select
          v-model="selectProjectId"
          placeholder="选择项目"
          @change="getPlansByProject"
        >
          <el-option
            v-for="item in allProjectList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="new-button">
        <el-button type="primary" @click="newPlan">新建计划</el-button>
      </div>
    </div>
    <div class="item-body">
      <el-table :data="planList" border stripe style="width: 100%">
        <el-table-column fixed prop="title" label="计划名称" min-width="15%" show-overflow-tooltip />
        <el-table-column prop="project_name" label="项目" min-width="10%" show-overflow-tooltip />
        <el-table-column prop="branch" label="分支" min-width="10%" show-overflow-tooltip  />
        <el-table-column prop="env_id" label="环境" min-width="10%" show-overflow-tooltip >
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
        <el-table-column prop="region_id" label="地区" min-width="10%" show-overflow-tooltip v-if="showRegion">
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
        <el-table-column prop="total_case" label="用例总数" width="90" show-overflow-tooltip >
          <template #default="scope">
            <span>{{scope.row.total_case}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="periodic_switch" label="定时开关" width="90" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.periodic_switch">开启</span>
            <span v-else>关闭</span>
          </template>
        </el-table-column>
        <el-table-column prop="periodic_expr" label="定时配置" min-width="10%" show-overflow-tooltip>
          <template #default="scope">
            <span>{{scope.row.periodic_expr}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
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
              <el-button type="warning" size="small" @click="editPlan(scope.row.id)" link>编辑</el-button>
              <el-button type="primary" size="small" @click="getPlanDetail(scope.row.id)" link>详情</el-button>
              <el-button type="danger" size="small" @click="deletePlan(scope.row)" link>删除</el-button>
            </el-button-group>
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
    <div class="builder">
      <el-dialog
        width="65%"
        v-model="showBuild"
        title="执行构建"
        :close-on-click-modal="false"
        @close="closeBuild"
      >
        <div class="content">
          <instant-build @successBuild="executeBuild" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import InstantBuild from "@/views/build/plan/components/InstantBuild";
import { guid } from "@/utils/other";
import { fetchPlans, deletePlan } from "@/api/plan";

export default {
  name: 'PlanList',
  components: {
    InstantBuild
  },
  data() {
    return {
      planList: [],
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
    this.getPlanList(1)
  },
  methods: {
    getPlanList(page, projectId=null) {
      fetchPlans(page, this.pageSize, projectId).then(response => {
        const result = response.data
        this.planList = result.data
        this.total = result.total
      })
    },
    getPlansByProject(projectId) {
      this.getPlanList(1, projectId)
    },
    newPlan() {
      this.$router.push('/build/plan/create')
    },
    editPlan(planId) {
      this.$router.push(`/build/plan/edit/${planId}`)
    },
    getPlanDetail(planId) {
      this.$router.push(`/build/plan/detail/${planId}`)
    },
    deletePlan(planData) {
      let warnInfo = `将删除计划【${planData.title}】，是否继续？`
      this.$messageBox.confirm(
        warnInfo,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deletePlan(planData.id).then(() => {
          this.getPlanList(1)
        })
      }).catch(() => {})
    },
    preBuild(planData) {
      this.$store.commit('plan/SET_PLAN_DATA', planData)
      this.$store.commit('plan/SET_CHANGE_FLAG', guid())
      this.showBuild = true
    },
    closeBuild() {
      this.$store.commit('plan/SET_PLAN_DATA', {})
    },
    executeBuild() {
      this.showBuild = false
      this.closeBuild()
      this.$message.success('构建请求已发送')
    },
    changePage(pageVal) {
      if (this.selectProjectId === 0) {
        this.getPlanList(pageVal)
      } else {
        this.getPlanList(pageVal, this.selectProjectId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-list {
  width: 100%;
  height: 100%;
  padding: 5px;
  .operate-header {
    width: 100%;
    height: 50px;
    display: flex;
    //align-items: center;
    //justify-content: center;
    .search-section {
    }
    .new-button {
      margin-left: auto;
    }
  }
}
</style>
