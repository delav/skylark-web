<template>
  <div class="plan-list">
    <div class="operate-header">
      <el-select v-model="searchForm.project_id" placeholder="Select">
        <el-option
          v-for="item in projectList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="searchForm.env_id" placeholder="Select">
        <el-option
          v-for="item in envList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="searchForm.region_id" placeholder="Select">
        <el-option
          v-for="item in regionList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary" @click="searchPlans">查询</el-button>
      <el-button type="primary" @click="gotoCreatePlan">新建计划</el-button>
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
              effect="dark"
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
              effect="dark"
              size="small"
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
            <span>{{transferSwitch(scope.row.periodic_switch)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="periodic_expr" label="定时配置" min-width="10%" show-overflow-tooltip>
          <template #default="scope">
            <span>{{scope.row.periodic_expr}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="230">
          <template #default="scope">
            <el-button type="warning" size="small" @click="preBuild(scope.row)" circle >
              <el-icon :size="20"><CaretRight /></el-icon>
            </el-button>
            <el-button type="warning" size="small" >编辑</el-button>
            <el-button type="primary" size="small" @click="gotoPlanDetail">详情</el-button>
            <el-button type="danger" size="small" @click="gotoPlanDetail">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="1000" />
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
import PAGE from '@/constans/build'
import InstantBuild from './components/InstantBuild'
import { guid } from '@/utils/other'
import { fetchPlans } from '@/api/plan'

export default {
  name: 'PlanList',
  components: {
    InstantBuild
  },
  data() {
    return {
      planList: [],
      searchForm: {
        project_id: '',
        env_id: '',
        region_id: ''
      },
      showBuild: false,
    }
  },
  computed: {
    projectList() {
      return this.$store.state.base.projectList
    },
    envList() {
      return this.$store.state.base.envList
    },
    regionList() {
      return this.$store.state.base.regionList
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
    this.getPlanList()
  },
  methods: {
    getPlanList() {
      fetchPlans(1, 10).then(response => {
        this.planList = response.data
      })
    },
    // transferIdString(idString, type) {
    //   let map = {}
    //   if (type === 'env') {
    //     map = this.envMap
    //   } else {
    //     map = this.regionMap
    //   }
    //   let nameString = ''
    //   const sep = ','
    //   idString = idString + sep
    //   let index = 0
    //   for (let i = 0; i < idString.length; i++) {
    //     if (idString[i] !== sep) {
    //       continue
    //     }
    //     const valStr = idString.substring(index, i)
    //     const id = parseInt(valStr)
    //     const name = map[id]
    //     if (i === idString.length - 1) {
    //       nameString += name
    //     } else {
    //       nameString += name + sep
    //     }
    //     index = i + 1
    //   }
    //   return nameString
    // },
    transferSwitch(bool) {
      if (bool) {
        return '开启'
      }
      return '关闭'
    },
    searchPlans() {},
    gotoCreatePlan() {
      this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.CREATE)
    },
    gotoPlanDetail() {
      this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.DETAIL)
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
