<template>
  <div class="fixture">
    <div class="fixture-body">
      <el-form ref="form" :model="fixtureObject" label-width="80px">
        <el-form-item label="套件前置:">
          <el-input v-model="fixtureObject['suite_setup']"></el-input>
        </el-form-item>
        <el-form-item label="套件后置:">
          <el-input v-model="fixtureObject['suite_teardown']"></el-input>
        </el-form-item>
        <el-form-item label="用例前置:">
          <el-input v-model="fixtureObject['test_setup']"></el-input>
        </el-form-item>
        <el-form-item label="用例后置:">
          <el-input v-model="fixtureObject['test_teardown']"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSetupTeardown">保存</el-button>
        </el-form-item>
        <el-alert type="info" :closable="false" show-icon>
          <p>单个组件书写格式：【组件名称|参数1|参数2|...】，多个组件使用AND连接，书写格式：【组件名称1|参数1|参数2|AND|组件名称2|参数1|参数2|...】</p>
        </el-alert>
      </el-form>
    </div>
  </div>
</template>

<script>
import { postSetupTeardown } from '@/api/fixture'
import NODE from "@/constans/node";

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
          {required: true, validator: validateName, trigger: 'blur' },
        ],
      }
    }
  },
  props: {
    fixtures: Object
  },
  watch: {
    fixtures: {
      handler(value) {
        if (JSON.stringify(value) !== '{}') {
          this.fixtureObject = value
        } else {
          this.fixtureObject = this.$options.data().fixtureObject
        }
      },
      deep: true,
    },
  },
  created() {
  },
  methods: {
    updateZTreeNode(extraDataKey, extraDataValue) {
      const selectedNode = this.$store.state.tree.selectedNode
      selectedNode.meta['extra_data'][extraDataKey] = extraDataValue
      this.$store.commit('tree/SET_SELECT_NODE', selectedNode)
      const treeId = this.$store.state.tree.treeId
      const treeObj = $.fn.zTree.getZTreeObj(treeId)
      treeObj.updateNode(selectedNode)
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
    saveSetupTeardown() {
      const postData = this.fixtureObject
      if (!Object.prototype.hasOwnProperty.call(postData, 'module_id')) {
        const moduleInfo = this.getModuleInfo()
        postData['module_id'] = moduleInfo.id
        postData['module_type'] = moduleInfo.type
      }
      postSetupTeardown(postData).then(response => {
        this.fixtureObject = response.data
        this.updateZTreeNode('fixtures', this.fixtureObject)
      })
    }
  }
}
</script>

<style scoped>

</style>
