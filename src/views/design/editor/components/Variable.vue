<template>
  <div class="variable">
    <div class="variable-body">
      <el-table :data="variableList" border style="width: 100%">
        <el-table-column fixed prop="name" label="变量名" width="180" sortable>
          <template #default="scope">
            <input type="text" v-model="scope.row.name" v-show="scope.row.edit" />
            <span v-show="!scope.row.edit">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="变量值" min-width="45%" show-overflow-tooltip>
          <template #default="scope">
            <input type="text" v-model="scope.row.value" v-show="scope.row.edit" />
            <span v-show="!scope.row.edit">{{scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="25%" show-overflow-tooltip>
          <template #default="scope">
            <input type="text" v-model="scope.row.remark" v-show="scope.row.edit" />
            <span v-show="!scope.row.edit">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template #header>
            <el-button size="small" type="primary" @click="showVarDialog">新建变量</el-button>
          </template>
          <template #default="scope">
            <el-button-group>
              <el-button size="small" type="warning" v-if="!scope.row.edit" @click="editVariable(scope.row)">编辑</el-button>
              <el-button size="small" type="primary" v-else @click="cancelEdit(scope.row, scope.$index)">取消</el-button>
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
        v-model="showNewVarDialog"
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
          <el-button @click="closeVarDialog">取消</el-button>
          <el-button type="primary" @click="createEnvVariable">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import NODE from '@/constans/node'
import { createVariable, updateVariable, deleteVariable } from '@/api/variable'

export default {
  name: 'Variable',
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
      variableList: [],
      showNewVarDialog: false,
      editRow: {},
      variableForm: {
        name: '',
        value: '',
        remark: ''
      },
      fieldRules: {
        name: [
          {required: true, validator: validateName, trigger: 'blur' },
        ],
      }
    }
  },
  props: {
    variables: {
      type: Array,
    },
    moduleFrom: {
      type: String,
    }
  },
  watch: {
    variables: {
      handler(value) {
        this.variableList = value
      },
      deep: true,
    }
  },
  created() {
  },
  methods: {
    showVarDialog() {
      this.showNewVarDialog = true
    },
    closeVarDialog() {
      this.showNewVarDialog = false
      this.variableForm = {}
    },
    isFromNode () {
      return this.moduleFrom === 'node'
    },
    getModuleInfo() {
      if (this.isFromNode) {
        return this.getModuleInfoFromNode()
      }
      return this.getModuleInfoFromProject()
    },
    getModuleInfoFromNode() {
      const selectedNode = this.$store.state.tree.selectedNode
      let moduleType = NODE.ModuleType.PROJECT
      if (selectedNode.desc === NODE.NodeDesc.SUITE) {
        moduleType = NODE.ModuleType.SUITE
      } else if (selectedNode.desc === NODE.NodeDesc.DIR) {
        moduleType = NODE.ModuleType.DIR
      }
      return {id: selectedNode.mid, type: moduleType, env: null}
    },
    getModuleInfoFromProject() {
      return {
        id: this.$store.state.project.projectId,
        type: NODE.ModuleType.PROJECT,
        env: this.$store.state.project.currentEnv
      }
    },
    variableNameExist (name) {
      let isExist = false
      for (let i = 0; i < this.variableList.length; i++) {
        if (this.variableList[i]['name'] === name) {
          isExist = true
          break
        }
      }
      return isExist
    },
    updateZTreeNode(extraDataKey, extraDataValue) {
      const selectedNode = this.$store.state.tree.selectedNode
      selectedNode.meta['extra_data'][extraDataKey] = extraDataValue
      this.$store.commit('tree/SET_SELECT_NODE', selectedNode)
      const treeId = this.$store.state.tree.treeId
      const treeObj = $.fn.zTree.getZTreeObj(treeId)
      treeObj.updateNode(selectedNode)
    },
    createEnvVariable() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.variableNameExist(this.variableForm['name'])) {
          this.$message.warning('该变量名已存在')
          return
        }
        const moduleInfo = this.getModuleInfo()
        const createData = {
          'module_id': moduleInfo.id,
          'module_type': moduleInfo.type,
          'name': this.variableForm['name'],
          'value': this.variableForm['value'],
          'remark': this.variableForm['remark'],
          'env': moduleInfo.env
        }
        createVariable(createData).then(response => {
          this.variableList.push(response.data)
          this.variableForm = {}
          this.showNewVarDialog = false
          if (this.isFromNode()) {
            this.updateZTreeNode('variables', this.variableList)
          }
        })
      })
    },
    editVariable(row) {
      this.editRow = JSON.stringify(row)
      row.edit = true
    },
    cancelEdit(row, index) {
      if (row.edit === false) return
      row.edit = false
      this.variableList.splice(index, 1, JSON.parse(this.editRow))
    },
    saveVariable(row) {
      if (row.edit === false) return
      const pattern = /\$\{.*\}/
      if (!row.name.match(pattern))  {
        this.$message.error('变量名格式: ${xxx}')
        return
      }
      updateVariable(row.id, row).then(() => {
        row.edit = false
        if (this.isFromNode()) {
          this.updateZTreeNode('variables', this.variableList)
        }
      })
    },
    delVariable(row, index) {
      this.$messageBox.alert('删除可能会导致使用到该变量的用例执行失败，是否继续?', '删除变量', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then( () => {
        deleteVariable(row.id).then(() => {
          this.variableList.splice(index, 1)
          if (this.isFromNode()) {
            this.updateZTreeNode('variables', this.variableList)
          }
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.variable {
  width: 100%;
  height: 100%;
  .variable-head {

  }
}

</style>
