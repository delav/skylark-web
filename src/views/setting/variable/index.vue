<template>
  <div class="variable-config">
    <div class="variable-header">
      <span class="item-label">项目：</span>
      <el-select
        class="project-selector"
        v-model="selectProjectId"
        placement="bottom-start"
        placeholder="选择项目"
        :popper-append-to-body="false"
        @change="changeProject"
      >
        <el-option
          v-for="(item, index) in projectList"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="variable-body">
      <div class="card-header">
        <div class="env-radio">
          <el-radio-group v-model="selectEvnId" @change="changeVariableList">
            <el-radio-button v-for="item in envList" :key="item.id" :label="item.id">{{ item['name'] }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="variable-search">
          <el-input
            style="width: 100%"
            v-model="searchKey"
            placeholder="输入关键字搜索"
            @keyup.enter.native="searchVariable"
          >
          </el-input>
        </div>
        <div class="operate-button">
          <el-button type="primary" @click="copyVariableAction">复制变量</el-button>
          <el-button type="primary" @click="createVariableAction">新建变量</el-button>
        </div>
      </div>
      <div class="card-body">
        <el-empty
          v-if="commonVariables.length===0 && regionVariables.length===0"
          description="找不到该项目的变量"
        />
        <div class="common-env" v-show="commonVariables.length>0">
          <el-table
            :data="commonVariables"
            border
            stripe
            style="width: 100%"
            :row-style="{height: '0'}"
            :cell-style="{padding: '4px'}"
            :header-cell-style="{ background: '#f4f5f7', fontSize:'13px', color: '#606266', padding: '6px' }"
          >
            <el-table-column fixed prop="name" label="变量名" width="250" sortable>
              <template #default="scope">
                <el-input size="small" v-model="scope.row.name" v-show="scope.row.edit" />
                <span v-show="!scope.row.edit">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="变量值" min-width="45%" show-overflow-tooltip>
              <template #default="scope">
                <el-input size="small" v-model="scope.row.value" v-show="scope.row.edit" />
                <span v-show="!scope.row.edit">{{scope.row.value}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="25%" show-overflow-tooltip>
              <template #default="scope">
                <el-input size="small" v-model="scope.row.remark" v-show="scope.row.edit" />
                <span v-show="!scope.row.edit">{{scope.row.remark}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="175" align="center">
              <template #default="scope">
                <el-link type="warning" style="font-size: 13px" :underline="false" v-if="!scope.row.edit" @click="editVariableAction(scope.row)">
                  <el-icon><Edit /></el-icon>编辑
                </el-link>
                <el-link type="danger" style="font-size: 13px;margin-left: 10px" :underline="false" @click="delVariableAction(scope.row)">
                  <el-icon><Delete /></el-icon>删除
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="region-env" v-show="regionVariables.length>0">
          <div class="region-head">
            <el-radio-group v-model="selectRegionId" @change="changeRegionList">
              <el-radio v-for="item in regionList" :key="item.id" :label="item.id">{{ item['name'] }}</el-radio>
            </el-radio-group>
          </div>
          <div class="region-body">
            <el-table
              :data="regionVariables"
              border
              stripe
              :show-header="commonVariables.length===0"
              style="width: 100%"
              :row-style="{height: '0'}"
              :cell-style="{padding: '4px'}"
              :header-cell-style="{ background: '#f4f5f7', fontSize:'13px', color: '#606266', padding: '6px' }"
            >
              <el-table-column fixed prop="name" label="变量名" width="250" sortable>
                <template #default="scope">
                  <el-input size="small" v-model="scope.row.name" v-show="scope.row.edit" />
                  <span v-show="!scope.row.edit">{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="变量值" min-width="45%" show-overflow-tooltip>
                <template #default="scope">
                  <el-input size="small" v-model="scope.row.value" v-show="scope.row.edit" />
                  <span v-show="!scope.row.edit">{{scope.row.value}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="25%" show-overflow-tooltip>
                <template #default="scope">
                  <el-input size="small" v-model="scope.row.remark" v-show="scope.row.edit" />
                  <span v-show="!scope.row.edit">{{scope.row.remark}}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="175" align="center">
                <template #default="scope">
                  <el-link type="warning" style="font-size: 13px" :underline="false" v-if="!scope.row.edit" @click="editVariableAction(scope.row)">
                    <el-icon><Edit /></el-icon>编辑
                  </el-link>
                  <el-link type="danger" style="font-size: 13px;margin-left: 10px" :underline="false" @click="delVariableAction(scope.row)">
                    <el-icon><Delete /></el-icon>删除
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
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
          @commitAction="commitSaveVariable"
          @cancelAction="cancelSaveVariable"
        />
      </el-dialog>
    </div>
    <div class="copy-dialog">
      <el-dialog
        width="700px"
        v-model="showCopyDialog"
        title="复制变量"
        :close-on-click-modal="false"
        :destroy-on-close="true"
      >
        <variable-copy
          :module-info="moduleInfo"
          @commitAction="commitCopyVariable"
          @cancelAction="cancelCopyVariable"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import VariableCopy from "@/views/setting/variable/components/VariableCopy";
import VariableSave from "@/views/setting/variable/components/VariableSave";
import NODE from "@/constans/node";
import { fetchVariables, deleteVariable } from "@/api/variable";

export default {
  name: 'Variable',
  components: {
    VariableSave,
    VariableCopy
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
  },
  watch: {
    '$store.state.base.baseLoaded': {
      handler() {
        if (this.projectList.length !== 0 && this.selectProjectId === '') {
          const globalProject = this.$store.state.base.globalProject
          if (globalProject !== '') {
            this.changeProject(globalProject)
          } else {
            this.changeProject(this.projectList[0]['id'])
          }
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      loading: true,
      selectProjectId: '',
      selectEvnId: '',
      selectRegionId: '',
      envVariables: {},
      commonVariables: [],
      regionVariables: [],
      commonKey: 'common',
      showSaveDialog: false,
      saveDialogTitle: '',
      showCopyDialog: false,
      searchKey: '',
      variableForm: {},
      moduleInfo: {},
    }
  },
  methods: {
    changeProject(projectId) {
      Object.assign(this.$data, this.$options.data())
      this.selectProjectId = projectId
      if (this.envList.length !== 0) {
        this.selectEvnId = this.envList[0]['id']
      }
      if (this.showRegion && this.regionList.length !== 0) {
        this.selectRegionId = this.regionList[0]['id']
      }
      if (!this.selectEvnId) {
        return
      }
      this.changeVariableList(this.selectEvnId)
    },
    changeVariableList(envId) {
      if (this.selectProjectId === '') {
        this.$message.warning('请先选择项目')
        return
      }
      let variablesDict = {}
      fetchVariables(this.selectProjectId, NODE.ModuleType.PROJECT, envId).then(response => {
        const resList = response.data
        if (resList.length === 0) {
          return
        }
        for (let i = 0; i < resList.length; i++) {
          const regionId = resList[i]['region_id']
          let regionKey = ''
          if (!regionId) {
            regionKey = this.commonKey
          } else {
            regionKey = resList[i]['region_id']
          }
          if (regionKey in variablesDict) {
            variablesDict[regionKey].push(resList[i])
          } else {
            variablesDict[regionKey] = [resList[i]]
          }
        }
        if (this.commonKey in variablesDict) {
          this.commonVariables = variablesDict[this.commonKey]
        }
        if (this.showRegion) {
          this.regionVariables = variablesDict[this.selectRegionId]
        }
        this.loading = false
        this.envVariables = variablesDict
      }).catch(() => {
        this.commonVariables = []
        this.regionVariables = []
      })
    },
    changeRegionList(regionId) {
      this.regionVariables = this.envVariables[regionId]
    },
    copyVariableAction() {
      if (this.selectProjectId === '') {
        this.$message.warning('请先选择项目')
        return
      }
      this.moduleInfo = {
        id: this.selectProjectId,
        type: NODE.ModuleType.PROJECT
      }
      this.showCopyDialog = true
    },
    createVariableAction() {
      if (this.selectProjectId === '') {
        this.$message.warning('请先选择项目')
        return
      }
      this.saveDialogTitle = '新建变量'
      this.variableForm = {
        module_id: this.selectProjectId,
        module_type: NODE.ModuleType.PROJECT,
        name: '',
        value: '',
        remark: '',
        env_id: this.selectEvnId,
        region_id: 0,
      }
      if (this.showRegion) {
        this.variableForm.region_id = this.selectRegionId
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
      this.changeVariableList(this.selectEvnId)
    },
    cancelSaveVariable() {
      this.showSaveDialog = false
    },
    commitCopyVariable(envId) {
      this.selectEvnId = envId
      this.showCopyDialog = false
      this.changeVariableList(this.selectEvnId)
    },
    cancelCopyVariable() {
      this.showCopyDialog = false
    },
    delVariableAction(row) {
      this.$messageBox.confirm('删除可能会导致使用到该变量的用例执行失败，是否继续?', '删除变量', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then( () => {
        deleteVariable(row.id).then(() => {
          this.changeVariableList(this.selectEvnId)
        })
      })
    },
    searchVariable() {}
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.variable-config {
  width: 100%;
  height: 100%;
  padding: 0 5px;
  .variable-header {
    padding: 10px 0;
    margin-bottom: 10px;
    border: 1px solid #e4e7ed;
    overflow: hidden;
    .item-label {
      font-size: 14px;
      padding-left: 10px;
      color: $textColor;
    }
    .project-selector {
      padding-left: 5px;
    }
  }
  .variable-body {
    //box-shadow: 0 0 5px rgba(0, 0, 0, 0.10);
    //border: 1px solid #e4e7ed;
    overflow: hidden;
    .card-header {
      padding: 10px 0;
      display: flex;
      align-content: flex-start;
      .env-radio {
      }
      .variable-search {
        margin-left: auto;
        width: 300px;
        min-width: 150px;
      }
      .operate-button {
        margin-left: auto;
        text-align: right;
        min-width: 200px;
      }
    }
  }
}

</style>
