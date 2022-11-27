<template>
  <div class="env-variable">
    <div class="env-head">
      <el-radio-group v-model="defaultEvn" @change="changeEnv">
        <el-radio v-for="item in envList" :key="item.id" :label="item.id">{{ item['env_name'] }}</el-radio>
      </el-radio-group>
      <div class="copy-env">
        Copy from
        <el-select style="width: 120px" v-model="selectCopyEnv" placeholder="Select" size="small">
          <template v-for="item in envList">
            <el-option :key="item.id" v-if="item.id !==defaultEvn" :label="item['env_name']" :value="item.id"/>
          </template>
        </el-select>
        <el-button style="margin-left: 5px" size="small" type="danger" @click="copyVariables">确定</el-button>
      </div>
    </div>
    <div class="env-body">
      <el-table :data="envVariables" border style="width: 100%">
        <el-table-column fixed prop="name" label="变量名" width="200px" sortable>
          <template #default="scope">
            <input type="text" v-model="scope.row.name" v-show="scope.row.isEditor" />
            <span v-show="!scope.row.isEditor">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="变量值" min-width="45%" show-overflow-tooltip>
          <template #default="scope">
            <input type="text" v-model="scope.row.value" v-show="scope.row.isEditor" />
            <span v-show="!scope.row.isEditor">{{scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="25%" show-overflow-tooltip>
          <template #default="scope">
            <input type="text" v-model="scope.row.remark" v-show="scope.row.isEditor" />
            <span v-show="!scope.row.isEditor">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template #header>
            <el-button size="small" type="primary" @click="showNewEnvDialog=true">新建变量</el-button>
          </template>
          <template #default="scope">
            <el-button-group>
              <el-button size="small" type="warning" v-if="!scope.row.isEditor" @click="editVariable(scope.row)">编辑</el-button>
              <el-button size="small" type="primary" v-else @click="cancelEdit(scope.row)">取消</el-button>
              <el-button size="small" type="success" @click="saveVariable(scope.row)">保存</el-button>
              <el-button size="small" type="danger" @click="delVariable(scope.row, scope.$index)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="create-dialog">
      <el-dialog
        width="50%"
        v-model="showNewEnvDialog"
        title="新建变量"
        :close-on-click-modal="false"
      >
        <div class="create-content">
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
          <el-button @click="showNewEnvDialog=false">取消</el-button>
          <el-button type="primary" @click="createEnvVariable">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchVariables, createVariable, updateVariable, deleteVariable } from '@/api/variable'

export default {
  name: 'EnvVariable',
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
      allVariables: {},
      envVariables: [],
      defaultEvn: '',
      showNewEnvDialog: false,
      variableForm: {
        name: '',
        value: '',
        remark: ''
      },
      fieldRules: {
        name: [
          {required: true, validator: validateName, trigger: 'blur' },
        ],
      },
      selectCopyEnv: '',
    }
  },
  props: ['projectId'],
  computed: {
    envList() {
      return this.$store.state.project.envList
    },
  },
  created() {
    this.defaultEvn = this.$store.state.project.currentEnv
    this.getEnvVariables()
  },
  methods: {
    changeVariableList(envId) {
      if (this.allVariables[envId] !== undefined) {
        this.envVariables = this.allVariables[envId]
      } else {
        this.envVariables = []
      }
    },
    addEditor (obj) {
      if (JSON.stringify(obj) === {}) {
        obj['isEditor'] = false
      }
      return obj
    },
    getEnvVariables() {
      if (this.projectId === '') return
      fetchVariables(this.projectId, 0).then(response => {
        const resList = response.data
        let variablesDict = {}
        for (let i = 0; i < resList.length; i++) {
          const item = this.addEditor(resList[i])
          const evnId = item['env']
          if (evnId !== null && variablesDict[evnId] !== undefined) {
            variablesDict[evnId].push(item)
          } else {
            variablesDict[evnId] = [item]
          }
        }
        this.allVariables = variablesDict
        this.changeVariableList(this.defaultEvn)
      })
    },
    createEnvVariable() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const proId = this.$store.state.project.projectId
        if (!proId) {
          this.$message.warning('请先选择项目')
          return
        }
        const defaultFields = {
          'module_id': proId,
          'module_type': 0,
          'name': '',
          'value': '',
          'remark': '',
          'env': this.defaultEvn,
        }
        let isExist = false
        for (let i = 0; i < this.envVariables.length; i++) {
          if (this.envVariables[i]['name'] === this.variableForm['name']) {
            isExist = true
            break
          }
        }
        if (isExist) {
          this.$message.warning('该变量名已存在')
          return
        }
        $.extend(true,defaultFields, this.variableForm)
        console.log(defaultFields)
        createVariable(defaultFields).then(response => {
          this.envVariables.push(this.addEditor(response.data))
          this.showNewEnvDialog = false
        })
      })
    },
    changeEnv(val) {
      this.$store.commit('project/SET_CURRENT_ENV', val)
      this.changeVariableList(val)
    },
    editVariable(row) {
      row.isEditor = true
    },
    cancelEdit(row) {
      row.isEditor = false
    },
    saveVariable(row) {
      updateVariable(row.id, row).then(() => {
        row.isEditor = false
      })
    },
    delVariable(row, index) {
      this.$messageBox.alert('删除可能会导致使用到该变量的用例执行失败，是否继续?', '删除变量', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then( () => {
        deleteVariable(row.id).then(() => {
          this.envVariables.splice(index, 1)
        })
      })
    },
    copyVariables() {
      const fromEnv = this.selectCopyEnv
      const toEnv = this.defaultEvn
      const fromEnvList = this.allVariables[fromEnv]
      this.envVariables = []
      this.allVariables[toEnv] = []
      for (let i = 0; i < fromEnvList.length; i++) {
        fromEnvList[i]['env'] = toEnv
        createVariable(fromEnvList[i]).then(response => {
          const item = this.addEditor(response.data)
          this.envVariables.push(item)
          this.allVariables[toEnv].push(item)
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.env-variable {
  width: 100%;
  height: 100%;
  .env-head {
    height: 50px;
    .copy-env {
      float: right;
    }
  }
  .env-body {

  }
  .create-dialog {
    .create-content {

    }
  }
}

</style>
