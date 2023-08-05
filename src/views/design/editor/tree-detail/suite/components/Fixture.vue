<template>
  <div class="fixture">
    <div class="cate-document">
      <div class="item-content">
        <el-input
          v-model="cateDocument"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          :disabled="inputDisabled"
          placeholder="Document"
        />
      </div>
    </div>
    <div class="fixture-body">
      <el-collapse v-model="activeDetail" accordion>
        <el-collapse-item name="1">
          <template #title>
            <div class="collapse-title">编辑前置后置</div>
          </template>
          <div class="fixture-alter">
            <el-alert type="info" :closable="false" show-icon>
              <p>单个组件书写格式：【组件名称|参数1|参数2|...】，多个组件使用AND连接，书写格式：【组件名称1|参数1|参数2|AND|组件名称2|参数1|参数2|...】</p>
            </el-alert>
          </div>
          <div class="fixture-item">
            <p class="item-desc">套件前置
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="fixtureTip.suite_setup_tip"
                placement="top-start"
              >
                <el-icon class="icon-style" size="14px" color="#bfcbd9"><QuestionFilled /></el-icon>
              </el-tooltip>
            </p>
            <p class="item-value">
              <el-input :disabled="inputDisabled" v-model="fixtureObject['suite_setup']"></el-input>
            </p>
          </div>
          <div class="fixture-item">
            <p class="item-desc">套件后置
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="fixtureTip.suite_teardown_tip"
                placement="top-start"
              >
                <el-icon class="icon-style" size="14px" color="#bfcbd9"><QuestionFilled /></el-icon>
              </el-tooltip></p>
            <p class="item-value">
              <el-input :disabled="inputDisabled" v-model="fixtureObject['suite_teardown']"></el-input>
            </p>
          </div>
          <div class="fixture-item">
            <p class="item-desc">用例前置
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="fixtureTip.test_setup_tip"
                placement="top-start"
              >
                <el-icon class="icon-style" size="14px" color="#bfcbd9"><QuestionFilled /></el-icon>
              </el-tooltip></p>
            <p class="item-value">
              <el-input :disabled="inputDisabled" v-model="fixtureObject['test_setup']"></el-input>
            </p>
          </div>
          <div class="fixture-item">
            <p class="item-desc">用例后置
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="fixtureTip.test_teardown_tip"
                placement="top-start"
              >
                <el-icon class="icon-style" size="14px" color="#bfcbd9"><QuestionFilled /></el-icon>
              </el-tooltip></p>
            <p class="item-value">
              <el-input :disabled="inputDisabled" v-model="fixtureObject['test_teardown']"></el-input>
            </p>
          </div>
          <div class="fixture-footer">
            <el-button v-if="inputDisabled" type="primary" @click="editCateInfo">编辑</el-button>
            <el-button v-else type="primary" @click="cancelCateInfo">取消</el-button>
            <el-button style="margin-left: 20px" type="primary" @click="saveSetupTeardown">保存</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import { postSetupTeardown } from "@/api/fixture";
import {updateCase} from "@/api/case";

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
      rawCateDocument: '',
      activeDetail: '',
      fixtureTip: {
        'suite_setup_tip': '运行测试套件之前执行，可用于准备数据',
        'suite_teardown_tip': '运行测试套件之后执行，可用于数据清理和复原',
        'test_setup_tip': '测试套件下的每个测试用例运行之前执行，可用于每个用例重复相同的操作步骤',
        'test_teardown_tip': '测试套件下的每个测试用例运行之后执行，可用于每个用例重复数据清理和复原'
      },
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
        const nodeInfo = this.$store.state.tree.selectedNode
        if (JSON.stringify(nodeInfo) === '{}') return
        const cateInfo = nodeInfo['meta']
        this.cateDocument = cateInfo.document
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
    editCateInfo() {
      this.inputDisabled = false
      this.rawCateDocument = this.cateDocument
      this.rawFixtureObject = JSON.stringify(this.fixtureObject)
    },
    cancelCateInfo() {
      this.inputDisabled = true
      this.cateDocument = this.rawCateDocument
      this.fixtureObject = JSON.parse(this.rawFixtureObject)
    },
    saveCateInfo() {
      if (this.rawCateDocument !== this.cateDocument) {
        this.saveCateDocument()
      }
      if (JSON.stringify(this.fixtureObject) !== this.rawFixtureObject) {
        this.saveSetupTeardown()
      }
      this.inputDisabled = true
    },
    saveCateDocument() {
      const params = {'document': this.cateDocument}
      updateCase(this.caseInfo.id, params).then((response) => {
        this.cateDocument = response.data.document
        this.updateTreeNode()
      }).catch(error => {
        this.$message.error(error)
        this.inputDisabled = false
      })
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
        this.updateTreeNode('fixtures', this.fixtureObject)
      }).catch(error => {
        this.$message.error(error)
        this.inputDisabled = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fixture {
  .fixture-alter {
    margin-top: 10px;
  }
  .fixture-body {
    margin-top: 5px;
    .collapse-title {
      padding-left: 5px;
    }
    .fixture-item {
      margin-top: 10px;
      .item-desc {
        margin: 0 0 3px 0;
        font-size: 14px;
        color: #6b778c;
        .icon-style {
          vertical-align: -10%;
          cursor: pointer;
        }
      }
      .item-value {
        margin: 0;
      }
    }
  }
  .fixture-footer {
    margin-top: 25px;
    display: flex;
    align-items: flex-end;
    justify-content: right;
  }
}
:deep(.el-input.is-disabled) {
  cursor: auto;
  .el-input__inner {
    cursor: auto;
  }
}
:deep(.el-textarea.is-disabled) {
  cursor: auto;
  .el-textarea__inner {
    cursor: auto;
  }
}
:deep(.el-collapse-item__header) {
  background-color: #ebeef5;
  border-radius: 2px;
}
</style>
