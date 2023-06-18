<template>
  <div class="variable-conf">
    <div class="env-head">
      <el-radio-group v-model="selectEvn" size="small" @change="changeVariableList">
        <el-radio-button v-for="item in envList" :key="item.id" :label="item.id">{{ item['name'] }}</el-radio-button>
      </el-radio-group>
      <div class="copy-env">
        Copy from
        <el-select style="width: 120px" v-model="selectCopyEnv" placeholder="Select" size="small">
          <template v-for="item in envList">
            <el-option :key="item.id" v-if="item.id !==selectEvn" :label="item['name']" :value="item.id"/>
          </template>
        </el-select>
        <el-button style="margin-left: 5px" size="small" type="danger" @click="copyVariables">确定</el-button>
      </div>
      <div class="new-button">
        <el-button size="small" type="primary" @click="createVariableAction">新建变量</el-button>
      </div>
    </div>
    <div class="common-env" v-show="showCommon">
      <el-table
        :data="commonVariables"
        border
        style="width: 100%"
        :row-style="{height: '0'}"
        :cell-style="{padding: '3px'}"
        :header-cell-style="{ background: '#f4f5f7', color: '#606266', padding: '5px' }"
      >
        <el-table-column fixed prop="name" label="变量名" width="180" sortable>
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
            <el-button-group>
              <el-button size="small" type="warning" v-if="!scope.row.edit" @click="editVariable(scope.row)">编辑</el-button>
              <el-button size="small" type="primary" v-else @click="cancelEdit(scope.row, scope.$index, true)">取消</el-button>
              <el-button size="small" type="success" @click="saveVariable(scope.row, scope.$index, true)">保存</el-button>
              <el-button size="small" type="danger" @click="delVariable(scope.row, scope.$index, true)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="region-env" v-show="showRegion">
      <div class="region-head">
        <el-radio-group v-model="selectRegion" @change="changeRegionList">
          <el-radio v-for="item in regionList" :key="item.id" :label="item.id">{{ item['name'] }}</el-radio>
        </el-radio-group>
      </div>
      <div class="region-body">
        <el-table
          :data="regionVariables"
          border
          :show-header="!showCommon"
          style="width: 100%"
          :row-style="{height: '0'}"
          :cell-style="{padding: '3px'}"
          :header-cell-style="{ background: '#f4f5f7', color: '#606266', padding: '5px' }"
        >
          <el-table-column fixed prop="name" label="变量名" width="180" sortable>
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
              <el-button-group>
                <el-button size="small" type="warning" v-if="!scope.row.edit" @click="editVariable(scope.row)">编辑</el-button>
                <el-button size="small" type="primary" v-else @click="cancelEdit(scope.row, scope.$index, false)">取消</el-button>
                <el-button size="small" type="success" @click="saveVariable(scope.row, scope.$index, false)">保存</el-button>
                <el-button size="small" type="danger" @click="delVariable(scope.row, scope.$index, false)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="create-dialog">
      <el-dialog
        width="50%"
        v-model="showNewVarDialog"
        title="新建变量"
        :close-on-click-modal="false"
      >
        <div class="env-region">
          <span class="env-label">环境</span>
          <div class="env-body">
            <div class="env-select">
              <el-select v-model="variableForm.env" style="width: 100%" placeholder="env">
                <el-option
                  v-for="(item, index) in envList"
                  :key="index"
                  :label="item['name']"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div class="region-select" v-show="showRegion">
              <el-select v-model="variableForm.region" style="width: 100%" placeholder="region">
                <el-option
                  v-for="(item, index) in containNullRegionList"
                  :key="index"
                  :label="item['name']"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="form-content">
          <el-form
            ref="ruleForm"
            :model="variableForm"
            :rules="fieldRules"
            label-width="120px"
            status-icon
          >
            <el-form-item label="变量名" prop="name">
              <el-input v-model="variableForm.name" />
            </el-form-item>
            <el-form-item label="变量值" prop="value">
              <el-input v-model="variableForm.value" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="variableForm.remark" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button @click="cancelVariableAction">取消</el-button>
          <el-button type="primary" @click="createEnvVariable">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import { fetchVariables, copyVariableByEnv, updateVariable, deleteVariable, createVariable } from "@/api/variable";

export default {
  name: 'VariableConf',
  data() {
    const validateName = (rule, value, callback) => {
      const pattern = /\$\{.*\}/
      if (!value.match(pattern))  {
        callback(new Error('变量名格式: ${xxx}'))
      } else{
        callback()
      }
    }
    return {
      envVariables: {},
      commonVariables: [],
      regionVariables: [],
      selectEvn: '',
      selectCopyEnv: '',
      selectRegion: '',
      commonKey: 'common',
      showCommon: false,
      editRow: {},
      showNewVarDialog: false,
      newVariableInfo: {},
      variableForm: {
        name: '',
        value: '',
        remark: '',
        env: '',
        region: ''
      },
      containNullRegionList: [
        { id: 0, name: 'None', ext_name: 'None' }
      ],
      fieldRules: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    projectId() {
      return this.$store.state.tree.projectId
    },
    envList() {
      return this.$store.state.base.envList
    },
    regionList() {
      return this.$store.state.base.regionList
    },
    showRegion() {
      return this.$store.state.base.showRegion
    }
  },
  created() {
    const regions = this.$store.state.base.regionList
    this.containNullRegionList.push(...regions)
    this.getEnvVariables()
  },
  methods: {
    getEnvVariables() {
      this.selectEvn = this.envList[0]['id']
      for (let i = 0; i < this.envList.length; i ++) {
        const evnId = this.envList[i]['id']
        if (!this.envList[i]['default']) continue
        this.selectEvn = evnId
      }
      if (this.showRegion) {
        this.selectRegion = this.regionList[0]['id']
      }
      this.changeVariableList(this.selectEvn)
    },
    changeVariableList(envId) {
      this.selectCopyEnv = ''
      if (this.projectId === '') return
      let variablesDict = {}
      fetchVariables(this.projectId, NODE.ModuleType.PROJECT, envId).then(response => {
        const resList = response.data
        if (resList.length === 0) return
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
        this.showCommon = false
        if (this.commonKey in variablesDict) {
          this.showCommon = true
          this.commonVariables = variablesDict[this.commonKey]
        }
        if (this.showRegion) {
          this.regionVariables = variablesDict[this.selectRegion]
        }
        this.envVariables = variablesDict
      }).catch(() => {
        this.showCommon = false
        this.commonVariables = []
        this.regionVariables = []
      })
    },
    changeRegionList(regionId) {
      this.regionVariables = this.envVariables[regionId]
    },
    copyVariables() {
      const params = {
        'module_id': this.projectId,
        'module_type': NODE.ModuleType.PROJECT,
        'from_env_id': this.selectCopyEnv,
        'to_env_id': this.selectEvn,
      }
      copyVariableByEnv(params).then((response) => {
        const resList = response.data
        if (resList.length === 0) return
        let variablesDict = {}
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
          this.changeVariableList(this.selectEvn)
        }
      })
    },
    updateCacheVariables(envId, isCommon, index, data, action) {
      if (isCommon) {
        if (action === 'delete') {
          this.commonVariables.splice(index, 1)
          this.envVariables[this.commonKey].splice(index, 1)
        } else if (action === 'update') {
          this.commonVariables.splice(index, 1, data)
          this.envVariables[this.commonKey].splice(index, 1, data)
        } else if (action === 'create') {
          this.commonVariables.push(data)
          this.envVariables[this.commonKey].push(data)
        }
      } else {
        if (action === 'delete') {
          this.regionVariables.splice(index, 1)
          this.envVariables[envId].splice(index, 1)
        } else if (action === 'update') {
          this.regionVariables.splice(index, 1, data)
          this.envVariables[envId].splice(index, 1, data)
        } else if (action === 'create') {
          this.regionVariables.push(data)
          this.envVariables[envId].push(data)
        }
      }
    },
    editVariable(row) {
      this.editRow = JSON.stringify(row)
      row.edit = true
    },
    cancelEdit(row, index, isCommon) {
      if (row.edit === false) return
      row.edit = false
      this.updateCacheVariables(isCommon, index, JSON.parse(this.editRow), 'update')
    },
    saveVariable(row, index, isCommon) {
      if (row.edit === false) return
      const pattern = /\$\{.*\}/
      if (!row.name.match(pattern))  {
        this.$message.error('变量名格式: ${xxx}')
        return
      }
      updateVariable(row.id, row).then((response) => {
        row.edit = false
        this.updateCacheVariables(isCommon, index, response.data, 'update')
      })
    },
    delVariable(row, index, isCommon) {
      this.$messageBox.alert('删除可能会导致使用到该变量的用例执行失败，是否继续?', '删除变量', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then( () => {
        deleteVariable(row.id).then(() => {
          this.updateCacheVariables(isCommon, index, null, 'delete')
        })
      })
    },
    createVariableAction() {
      this.variableForm.env = this.selectEvn
      this.variableForm.region = this.selectRegion
      this.showNewVarDialog = true
    },
    cancelVariableAction() {
      this.showNewVarDialog = false
      Object.assign(this.$data.variableForm, this.$options.data().variableForm)
    },
    createEnvVariable() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const createData = {
          'name': this.variableForm['name'],
          'value': this.variableForm['value'],
          'remark': this.variableForm['remark'],
          'module_id': this.projectId,
          'module_type': NODE.ModuleType.PROJECT,
          'env_id':  this.variableForm.env
        }
        let isCommon = false
        if (this.variableForm.region !== 0) {
          isCommon = true
          createData['region_id'] = this.variableForm.region
        }
        if (this.variableNameExist(createData)) {
          this.$message.warning('该变量名已存在')
          return
        }
        createVariable(createData).then(response => {
          this.cancelVariableAction()
          this.updateCacheVariables(isCommon, 0, response.data, 'create')
        })
      })
    },
    variableNameExist (formData) {
      let isExist = false
      let validateVariableList = []
      let regionId = null
      if ('region_id' in formData) {
        regionId = formData['region_id']
        validateVariableList = this.envVariables[formData['env_id']]
      } else {
        validateVariableList = this.envVariables[this.commonKey]
      }
      for (let i = 0; i < validateVariableList.length; i++) {
        if (validateVariableList[i]['name'] === formData['name']
          && validateVariableList[i]['env_id'] === formData['env_id']
          && validateVariableList[i]['region_id'] === regionId) {
          isExist = true
          break
        }
      }
      return isExist
    },
  }
}
</script>

<style lang="scss" scoped>
.variable-conf {
  width: 100%;
  height: 100%;
  .env-head {
    height: 35px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .copy-env {
      flex: 5;
      text-align: right;
    }
    .new-button {
      flex: 1;
      text-align: right;
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
