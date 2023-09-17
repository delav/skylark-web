<template>
  <div class="fixture">
<!--    <div class="fixture-alter">-->
<!--      <el-alert type="info" :closable="false" show-icon>-->
<!--        <p>单个组件书写格式：【组件名称|参数1|参数2|...】，多个组件使用AND连接，书写格式：【组件名称1|参数1|参数2|AND|组件名称2|参数1|参数2|...】</p>-->
<!--      </el-alert>-->
<!--    </div>-->
    <div class="fixture-body">
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
    </div>
    <div class="fixture-footer">
      <el-button v-if="inputDisabled" type="primary" @click="editFixture">编辑</el-button>
      <el-button v-else @click="cancelEdit">取消</el-button>
      <el-button style="margin-left: 20px" type="primary" @click="saveFixture">保存</el-button>
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import { saveSetupTeardown} from "@/api/fixture";

export default {
  name: 'Fixture',
  props: {
    cateFixture: Object
  },
  watch: {
    cateFixture: {
      handler(val) {
        this.fixtureObject = val
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      fixtureTip: {
        'suite_setup_tip': '运行测试套件之前执行，可用于准备数据',
        'suite_teardown_tip': '运行测试套件之后执行，可用于数据清理和复原',
        'test_setup_tip': '测试套件下的每个测试用例运行之前执行，可用于每个用例重复相同的操作步骤',
        'test_teardown_tip': '测试套件下的每个测试用例运行之后执行，可用于每个用例重复数据清理和复原'
      },
      fixtureObject: {},
      inputDisabled: true,
      rawFixtureObject: ''
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
    editFixture() {
      this.inputDisabled = false
      this.rawFixtureObject = JSON.stringify(this.fixtureObject)
    },
    cancelEdit() {
      this.inputDisabled = true
      this.fixtureObject = JSON.parse(this.rawFixtureObject)
    },
    saveFixture() {
      const postData = this.fixtureObject
      if (!Object.prototype.hasOwnProperty.call(postData, 'module_id')) {
        const moduleInfo = this.getModuleInfo()
        postData['module_id'] = moduleInfo.id
        postData['module_type'] = moduleInfo.type
      }
      saveSetupTeardown(postData).then(response => {
        this.inputDisabled = true
        this.fixtureObject = response.data
        this.updateTreeNode(NODE.ExtraDataKey.FIXTURE, this.fixtureObject)
      }).catch(error => {
        this.$message.error(error)
        this.inputDisabled = false
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
.fixture {
  .fixture-alter {
    margin-top: 10px;
  }
  .fixture-body {
    .fixture-item {
      margin-top: 12px;
      .item-desc {
        margin: 0 0 4px 0;
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
    margin-top: 20px;
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
</style>
