<template>
  <div class="fixture">
    <div class="fixture-alter">
      <el-alert type="info" :closable="false" show-icon>
        <p>单个组件书写格式：【组件名称|参数1|参数2|...】，多个组件使用AND连接，书写格式：【组件名称1|参数1|参数2|AND|组件名称2|参数1|参数2|...】</p>
      </el-alert>
    </div>
    <div class="fixture-body">
      <el-form ref="form" :model="fixtureObject" label-width="80px">
        <el-form-item label="套件前置:">
          <el-input :disabled="inputDisabled" v-model="fixtureObject['suite_setup']"></el-input>
        </el-form-item>
        <el-form-item label="套件后置:">
          <el-input :disabled="inputDisabled" v-model="fixtureObject['suite_teardown']"></el-input>
        </el-form-item>
        <el-form-item label="用例前置:">
          <el-input :disabled="inputDisabled" v-model="fixtureObject['test_setup']"></el-input>
        </el-form-item>
        <el-form-item label="用例后置:">
          <el-input :disabled="inputDisabled" v-model="fixtureObject['test_teardown']"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="inputDisabled" type="primary" @click="editSetupTeardown">编辑</el-button>
          <el-button v-else type="primary" @click="cancelSetupTeardown">取消</el-button>
          <el-button type="primary" @click="saveSetupTeardown">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import { postSetupTeardown } from "@/api/fixture";

export default {
  name: 'Fixture',
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
      cateDocument: '',
      fixtureObject: {
        'suite_setup': '',
        'suite_teardown': '',
        'suite_setup_desc': '',
        'suite_teardown_desc': '',
        'test_setup': '',
        'test_teardown': '',
        'test_setup_desc': '',
        'test_teardown_desc': ''
      },
      fieldRules: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' },
        ],
      },
      inputDisabled: true,
      rawFixtureObject: ''
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const detailType = this.$store.state.tree.detailType
        const categories = [NODE.DetailType.DIR, NODE.DetailType.SUITE]
        if (categories.indexOf(detailType) === -1) return
        const cateInfo = this.$store.state.tree.selectedNode.meta
        this.fixtureObject = cateInfo['extra_data'][NODE.ExtraDataKey.FIXTURE]
      },
      immediate: true
    },
  },
  created() {
  },
  methods: {
    updateTreeNode(extraDataKey, extraDataValue) {
      const selectedNode = this.$store.state.tree.selectedNode
      selectedNode.meta['extra_data'][extraDataKey] = extraDataValue
      const treeId = this.$store.state.tree.treeId
      const treeObj = $.fn.zTree.getZTreeObj(treeId)
      treeObj.updateNode(selectedNode)
      this.$store.commit('tree/SET_SELECT_NODE', selectedNode)
    },
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
    editSetupTeardown() {
      this.inputDisabled = false
      this.rawFixtureObject = JSON.stringify(this.fixtureObject)
    },
    cancelSetupTeardown() {
      this.inputDisabled = true
      this.fixtureObject = JSON.parse(this.rawFixtureObject)
    },
    saveSetupTeardown() {
      const postData = this.fixtureObject
      if (!Object.prototype.hasOwnProperty.call(postData, 'module_id')) {
        const moduleInfo = this.getModuleInfo()
        postData['module_id'] = moduleInfo.id
        postData['module_type'] = moduleInfo.type
      }
      postSetupTeardown(postData).then(response => {
        this.inputDisabled = true
        this.fixtureObject = response.data
        this.updateTreeNode('fixtures', this.fixtureObject)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fixture {
  .fixture-alter {
    margin: 5px 0 20px 0;
  }
  .fixture-body {
  }
}
:deep(.el-input.is-disabled) {
  cursor: auto;
  .el-input__inner {
    cursor: auto;
  }
}
</style>
