<template>
  <div class="variable-conf">
    <div class="env-head">
      <div class="env-radio">
        <el-radio-group v-model="selectEvn" @change="changeVariableList">
          <el-radio-button
            v-for="item in envList"
            :key="item.id"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="filter-search">
        <el-input
          with="100%"
          v-model="searchKey"
          @change="filterVariable"
          placeholder="搜索">
        </el-input>
      </div>
      <div class="new-button">
        <el-button type="primary" @click="createVariableAction">新建变量</el-button>
      </div>
    </div>
    <div class="common-env">
      <el-table
        :data="envVariables"
        v-loading="varLoading"
        border
        style="width: 100%"
        :row-style="{height: '0'}"
        :cell-style="{color: '#666', fontSize:'13px', padding: '4px 0'}"
        :header-cell-style="{ background: '#f4f5f7', color: '#606266', padding: '6px 0', fontWeight: 500, fontSize:'13px' }"
      >
        <el-table-column fixed prop="name" label="变量名" width="180" sortable>
          <template #default="scope">
            <el-input size="small" v-model="scope.row.name" v-show="scope.row.edit" />
            <span v-show="!scope.row.edit">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="变量值" min-width="100" show-overflow-tooltip>
          <template #default="scope">
            <el-input size="small" v-model="scope.row.value" v-show="scope.row.edit" />
            <span v-show="!scope.row.edit">{{scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="region_id" label="地区" width="120" v-if="showRegion" sortable>
          <template #default="scope">
            <span>{{ getRegionNameById(scope.row.region_id) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="200" show-overflow-tooltip>
          <template #default="scope">
            <el-input size="small" v-model="scope.row.remark" v-show="scope.row.edit" />
            <span v-show="!scope.row.edit">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="125" align="center">
          <template #default="scope">
            <el-link type="warning" style="font-size: 12px" :underline="false" @click="editVariableAction(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-link>
            <el-link type="danger" style="margin-left: 8px; font-size: 12px" :underline="false" @click="delVariableAction(scope.row.id, scope.$index)">
              <el-icon><Delete /></el-icon>删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="create-dialog">
      <el-dialog
        width="600px"
        v-model="showSaveDialog"
        :title="saveDialogTitle"
        :close-on-click-modal="false"
        :destroy-on-close="true"
      >
        <variable-save
          :variable-form="variableForm"
          @confirm="commitSaveVariable"
          @cancel="cancelSaveVariable"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import VariableSave from "@/views/setting/variable/components/VariableSave";
import { fetchVariables, deleteVariable } from "@/api/variable";

export default {
  name: 'VariableConf',
  components: {
    VariableSave
  },
  computed: {
    projectId() {
      return this.$store.state.tree.projectId
    },
    envList() {
      return this.$store.state.base.envList
    },
    showRegion() {
      return this.$store.state.base.showRegion
    }
  },
  watch: {
    searchKey: {
      handler() {
        this.filterVariable()
      }
    }
  },
  data() {
    return {
      varLoading: true,
      envVariables: [],
      selectEvn: '',
      envVariablesCache: '',
      searchKey: '',
      saveDialogTitle: '',
      showSaveDialog: false,
      variableForm: {}
    }
  },
  mounted() {
    this.getEnvVariables()
  },
  methods: {
    getEnvVariables() {
      this.selectEvn = this.envList[0]['id']
      this.changeVariableList(this.selectEvn)
    },
    changeVariableList(envId) {
      fetchVariables(this.projectId, NODE.ModuleType.PROJECT, envId).then(response => {
        this.varLoading = false
        this.envVariables = response.data
        this.envVariablesCache = JSON.stringify(this.envVariables)
        this.filterVariable()
      }).catch(() => {
        this.envVariables = []
        this.varLoading = false
        this.$message.error('获取项目变量异常')
      })
    },
    getRegionNameById(regionId) {
      const regionMap = this.$store.state.base.regionMap
      if (regionId in regionMap) {
        return regionMap[regionId]
      }
      return 'ALL'
    },
    filterVariable() {
      const envArray = JSON.parse(this.envVariablesCache)
      if (this.searchKey.trim() === '') {
        this.envVariables = envArray
        return
      }
      let newVariables = []
      const searchStr = this.searchKey.trim().toLowerCase()
      for (let i = 0; i < envArray.length; i++) {
        const itemStr = Object.values(envArray[i]).join('').toLowerCase()
        if (itemStr.indexOf(searchStr) !== -1) {
          newVariables.push(envArray[i])
        }
      }
      this.envVariables = newVariables
    },
    delVariableAction(variableId, index) {
      this.$messageBox.confirm(
        '删除变量可能会导致使用到该变量的用例执行失败，是否继续?',
        '删除变量',
        {
          autofocus: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteVariable(variableId).then(() => {
          this.envVariables.splice(index, 1)
        })
      })
    },
    cancelVariableAction() {
      this.showSaveDialog = false
      Object.assign(this.$data.variableForm, this.$options.data().variableForm)
    },
    createVariableAction() {
      this.saveDialogTitle = '新建变量'
      this.variableForm = {
        module_id: this.projectId,
        module_type: NODE.ModuleType.PROJECT,
        name: '',
        value: '',
        remark: '',
        env_id: this.selectEvn,
        region_id: 0,
      }
      this.showSaveDialog = true
    },
    editVariableAction(row) {
      this.variableForm = row
      this.saveDialogTitle = '更新变量'
      this.showSaveDialog = true
    },
    commitSaveVariable() {
      this.showSaveDialog = false
      this.changeVariableList(this.selectEvn)
    },
    cancelSaveVariable() {
      this.showSaveDialog = false
    },
  }
}
</script>

<style lang="scss" scoped>
.variable-conf {
  width: 100%;
  height: 100%;
  //max-height: 500px;
  min-height: 500px;
  .env-head {
    height: 35px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .env-radio {
      text-align: left;
    }
    .filter-search {
      width: 300px;
      margin-left: auto;
      min-width: 150px;
    }
    .new-button {
      text-align: right;
      margin-left: auto;
    }
  }
  .common-env {

  }
  .region-env {
    margin-top: 15px;
  }
  .create-dialog {
    .create-content {

    }
  }
}

</style>
