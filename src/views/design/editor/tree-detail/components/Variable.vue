<template>
  <div class="variable">
    <div class="variable-body">
      <el-table
        :data="variableList"
        border
        style="width: 100%"
        :row-style="{height: '0'}"
        :cell-style="{padding: '4px', color: '#666', fontSize:'13px'}"
        :header-cell-style="{ color: '#606266', padding: '6px', fontWeight: 600, fontSize:'13px' }"
      >
        <el-table-column fixed prop="name" label="变量名" width="200" sortable>
          <template #default="scope">
            <el-input size="small" v-model="scope.row.name" v-show="scope.row.edit" />
            <span v-show="!scope.row.edit">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="变量值" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <el-input size="small" v-model="scope.row.value" v-show="scope.row.edit" />
            <span v-show="!scope.row.edit">{{scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="200" show-overflow-tooltip>
          <template #default="scope">
            <el-input size="small" v-model="scope.row.remark" v-show="scope.row.edit" />
            <span v-show="!scope.row.edit">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="135" align="center">
          <template #header>
            <el-button size="small" @click="showVarDialog" plain>新建变量</el-button>
          </template>
          <template #default="scope">
            <el-link type="warning" style="font-size: 12px" :underline="false" @click="editVariable(scope.row, scope.$index)">
              <el-icon><Edit /></el-icon>编辑
            </el-link>
            <el-link type="danger" style="margin-left: 8px; font-size: 12px" :underline="false" @click="delVariable(scope.row, scope.$index)">
              <el-icon><Delete /></el-icon>删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="create-dialog">
      <el-dialog
        width="600px"
        v-model="showNewVarDialog"
        title="新建变量"
        :close-on-click-modal="false"
        :destroy-on-close="true"
      >
        <div class="form-content">
          <el-form
            ref="ruleForm"
            :model="variableForm"
            :rules="fieldRules"
            label-width="80px"
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
          <el-button type="primary" @click="commitVariable">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import { createVariable, updateVariable, deleteVariable } from "@/api/variable";

export default {
  name: 'Variable',
  props: {
    variables: Array
  },
  watch: {
    variables: {
      handler(val) {
        this.variableList = val
      },
      deep: true,
      immediate: true
    }
  },
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
      variableForm: {
        name: '',
        value: '',
        remark: ''
      },
      editIndex: null,
      fieldRules: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' },
        ],
        value: [
          { required: true, trigger: 'blur', message: '变量值不能为空' }
        ]
      }
    }
  },
  methods: {
    getModuleInfo() {
      const selectedNode = this.$store.state.tree.selectedNode
      let moduleType = NODE.ModuleType.PROJECT
      if (selectedNode.desc === NODE.NodeDesc.SUITE) {
        moduleType = NODE.ModuleType.SUITE
      } else if (selectedNode.desc === NODE.NodeDesc.DIR) {
        moduleType = NODE.ModuleType.DIR
      }
      return {id: selectedNode.mid, type: moduleType}
    },
    showVarDialog() {
      this.showNewVarDialog = true
    },
    closeVarDialog() {
      this.showNewVarDialog = false
      this.variableForm = this.$options.data().variableForm
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
    editVariable(row, index) {
      this.editIndex = index
      this.variableForm = row
      this.showNewVarDialog = true
    },
    delVariable(row, index) {
      this.$messageBox.confirm(
        '删除变量可能会导致使用到该变量的用例执行失败，是否确定删除?',
        '删除变量',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
        }).then( () => {
        deleteVariable(row.id).then(() => {
          this.variableList.splice(index, 1)
          this.updateTreeNode(NODE.ExtraDataKey.VARIABLE, this.variableList)
        })
      })
    },
    commitVariable() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const moduleInfo = this.getModuleInfo()
        const commitData = {
          'name': this.variableForm['name'],
          'value': this.variableForm['value'],
          'remark': this.variableForm['remark'],
          'module_id':  moduleInfo.id,
          'module_type':  moduleInfo.type
        }
        if (this.variableForm.id !== undefined) {
          updateVariable(this.variableForm.id, commitData).then((response) => {
            this.variableForm = this.$options.data().variableForm
            this.showNewVarDialog = false
            if (this.editIndex !== null) {
              this.variableList.splice(this.editIndex, 1, response.data)
            }
            this.editIndex = this.$options.data().editIndex
            this.updateTreeNode(NODE.ExtraDataKey.VARIABLE, this.variableList)
          })
        } else {
          if (this.variableNameExist(this.variableForm['name'])) {
            this.$message.warning('该变量名已存在')
            return
          }
          createVariable(commitData).then(response => {
            this.variableList.push(response.data)
            this.variableForm = this.$options.data().variableForm
            this.showNewVarDialog = false
            this.updateTreeNode(NODE.ExtraDataKey.VARIABLE, this.variableList)
          })
        }
      })
    },
    updateTreeNode(extraDataKey, extraDataValue) {
      const selectedNode = this.$store.state.tree.selectedNode
      selectedNode.meta['extra_data'][extraDataKey] = extraDataValue
      const treeId = this.$store.state.tree.treeId
      const treeObj = $.fn.zTree.getZTreeObj(treeId)
      treeObj.updateNode(selectedNode)
      this.$store.commit('tree/SET_SELECT_NODE', selectedNode)
    },
  }
}
</script>

<style lang="scss" scoped>
.variable {
  width: 100%;
  height: 100%;
  .variable-body {
  }
  .create-dialog {
    .env-region {
      display: flex;
      margin-bottom: 15px;
      .env-label {
        width: 120px;
        text-align: right;
        padding: 0 12px 0 0;
        line-height: 32px;
        font-weight: 700;
      }
      .env-body {
        width: calc(100% - 120px);
        .env-select {
          width: 50%;
          float: left;
        }
        .region-select {
          width: 50%;
          float: left;
        }
      }
    }
    .form-content {}
  }
}

</style>
