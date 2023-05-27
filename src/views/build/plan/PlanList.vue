<template>
  <div class="plan-list">
    <div class="operate-header">
      <el-select
        v-model="searchForm.project_id"
        placeholder="Select"
        @change="getPlansByProject"
      >
        <el-option
          v-for="item in projectList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" @click="newPlan">新建计划</el-button>
    </div>
    <div class="item-body">
      <el-table :data="planList" border style="width: 100%">
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
        <el-table-column prop="total_case" label="用例总数" min-width="10%" show-overflow-tooltip >
          <template #default="scope">
            <span>{{scope.row.total_case}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="periodic_switch" label="定时开关" min-width="10%" show-overflow-tooltip>
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
        <el-table-column fixed="right" label="操作" width="230">
          <template #default="scope">
            <el-button style="margin-right: 15px" type="primary" size="small" @click="preBuild(scope.row)">
              <el-icon :size="20"><CaretRight /></el-icon>
            </el-button>
            <el-button-group>
              <el-button type="warning" size="small" @click="editPlan(scope.row)" link>编辑</el-button>
              <el-button type="primary" size="small" @click="getPlanDetail(scope.row)" link>详情</el-button>
              <el-button type="danger" size="small" @click="deletePlan(scope.row)" link>删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
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
import PAGE from "@/constans/build";
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
      pageSize: 10,
      searchForm: {
        project_id: 0,
      },
      showBuild: false,
    }
  },
  computed: {
    projectList() {
      const rawList = this.$store.state.base.projectList
      const allOption = {id: 0, name: '所有'}
      rawList.unshift(allOption)
      return rawList
    },
    showRegion() {
      return this.$store.state.base.showRegion
    },
    envMap() {
      return this.$store.state.base.envMap
    },
    regionMap() {
      return this.$store.state.base.regionMap
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
    newPlan() {
      this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.CREATEPLAN)
    },
    editPlan(planData) {
      this.$store.commit('plan/SET_PLAN_DATA', planData)
      this.$store.commit('plan/SET_CHANGE_FLAG', guid())
      this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.EDITPLAN)
    },
    getPlanDetail(planData) {
      this.$store.commit('plan/SET_PLAN_DATA', planData)
      this.$store.commit('plan/SET_CHANGE_FLAG', guid())
      this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.PLANDETAIL)
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
      const selectProject = this.searchForm.project_id
      if (selectProject === 0) {
        this.getPlanList(1)
      } else {
        this.getPlanList(1, selectProject)
      }
      this.getPlanList(pageVal)
    },
    getPlansByProject(projectId) {
      if (projectId === 0) {
        this.getPlanList(1)
      } else {
        this.getPlanList(1, projectId)
      }
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
