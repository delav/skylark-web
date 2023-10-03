<template>
  <div class="fixture">
<!--    <div class="fixture-alter">-->
<!--      <el-alert type="info" :closable="false" show-icon>-->
<!--        <p>单个组件书写格式：【组件名称|参数1|参数2|...】，多个组件使用AND连接，书写格式：【组件名称1|参数1|参数2|AND|组件名称2|参数1|参数2|...】</p>-->
<!--      </el-alert>-->
<!--    </div>-->
    <div class="fixture-body">
      <div class="fixture-item" v-for="(item, index1) in fixtureHelpShow" :key="index1">
        <p class="item-desc">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="item[2]"
            placement="top-start"
          >
            <el-icon class="help-icon" size="14px" color="#bfcbd9"><QuestionFilled /></el-icon>
          </el-tooltip>
          {{ item[1] }}
          <el-icon class="edit-icon" @click="editFixtureItem(index1)"><Edit /></el-icon>
        </p>
        <p class="item-value">
          <el-tag
            style="margin: 3px 0 0 5px"
            v-for="(value, index2) in fixtureObject[item[0]]"
            :key="index2"
          >
            {{ value }}
          </el-tag>
        </p>
      </div>
    </div>
    <div class="fixture-editor">
      <el-dialog
        width="50%"
        v-model="showFixtureEdit"
        :title="editTitle"
      >
        <div class="content">
          <div class="fixture-keyword">
            <p class="item" v-for="(value, index) in fixtureKeywords" :key="index">
              <el-tag
                @close="removeKeywordFromFixture(index)"
                closable
              >
                {{ value }}
              </el-tag>
            </p>
          </div>
          <div class="keyword-select">
            <div class="keyword-item">
              <el-select
                style="width: calc(100% - 65px)"
                v-model="currentKeyword"
                placement="bottom-start"
                placeholder="选择组件"
                :popper-append-to-body="false"
                filterable
              >
                <el-option
                  v-for="(item, index) in keywordList"
                  :key="index"
                  :label="item.ext_name"
                  :value="item.ext_name"
                  @click="changeKeyword(item)"
                />
              </el-select>
              <el-button style="margin-left: 5px" @click="addKeywordToFixture">添加</el-button>
            </div>
            <div class="keyword-params">
              <p class="param-desc" v-if="showParams">组件参数
                <el-button
                  v-if="showOperateButton"
                  size="small"
                  @click="addParam"
                  plain
                >
                  <el-icon><Plus /></el-icon>添加
                </el-button>
                <el-button
                  v-if="showOperateButton"
                  size="small"
                  @click="deleteParam"
                  plain
                >
                  <el-icon><Delete /></el-icon>删除
                </el-button>
              </p>
              <p class="param-item" v-for="(value, index) in keywordParams" :key="index">
                <el-input v-model="keywordParams[index]"></el-input>
              </p>
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showFixtureEdit=false">取消</el-button>
            <el-button type="primary" @click="saveFixture">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import KEYWORD from "@/constans/keyword";
import { deepCopy } from "@/utils/dcopy";
import { saveSetupTeardown} from "@/api/fixture";

export default {
  name: 'Fixture',
  props: {
    cateFixture: Object
  },
  computed: {
    keywordList() {
      const allKeywordList = Object.values(this.$store.state.keyword.keywordObjects)
      const showKeywords = allKeywordList.filter(item => {
        return item.category !== KEYWORD.KeywordCategory.RESERVED
      })
      return Object.values(showKeywords)
    },
  },
  watch: {
    cateFixture: {
      handler(val) {
        if (JSON.stringify(val) === '{}') {
          return
        }
        this.handlerFixture(val)
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      fixtureJoinSep: '|AND|',
      fixtureHelpShow: [
        ['suite_setup', '套件前置', '运行测试套件之前执行，可用于准备数据'],
        ['suite_teardown', '套件后置', '运行测试套件之前执行，可用于准备数据'],
        ['test_setup', '用例前置', '运行测试套件之前执行，可用于准备数据'],
        ['test_teardown', '用例后置', '运行测试套件之前执行，可用于准备数据'],
      ],
      fixtureObject: {
        'suite_setup': [],
        'suite_teardown': [],
        'suite_setup_desc': '',
        'suite_teardown_desc': '',
        'test_setup': [],
        'test_teardown': [],
        'test_setup_desc': '',
        'test_teardown_desc': ''
      },
      inputDisabled: true,
      showFixtureEdit: false,
      editTitle: '',
      editField: '',
      currentKeyword: '',
      fixtureKeywords: [],
      showParams: false,
      keywordParams: [],
      showOperateButton: false
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
    handlerFixture(fixtures) {
      const newFixtures = deepCopy(fixtures)
      const handlerFields = ['suite_setup', 'suite_teardown', 'test_setup', 'test_teardown']
      for (let i = 0; i < handlerFields.length; i++) {
        const field = handlerFields[i]
        const value = fixtures[field]
        if (value === null || value === '' || value === undefined) {
          newFixtures[field] = []
        } else if (value.indexOf(this.fixtureJoinSep) !== -1) {
          newFixtures[field] = value.split(this.fixtureJoinSep)
        } else {
          newFixtures[field] = [value]
        }
      }
      this.fixtureObject = newFixtures
    },
    editFixtureItem(showIndex) {
      this.editField = this.fixtureHelpShow[showIndex][0]
      this.editTitle = this.fixtureHelpShow[showIndex][1]
      this.fixtureKeywords = deepCopy(this.fixtureObject[this.editField])
      this.showFixtureEdit = true
    },
    cancelEditFixtureItem() {
      this.editField = ''
      this.showFixtureEdit = false
    },
    changeKeyword(keyword) {
      this.keywordParams = []
      this.showOperateButton = false
      if (keyword['input_type'] === KEYWORD.KeywordArgType.NONE) {
        this.showParams = false
        return
      } else if (keyword['input_type'] === KEYWORD.KeywordArgType.SINGLE) {
        this.keywordParams.push(keyword['input_params'])
      } else if (keyword['input_type'] === KEYWORD.KeywordArgType.MULTI) {
        this.keywordParams = keyword['input_params'].split('|')
      } else if (keyword['input_type'] === KEYWORD.KeywordArgType.LIST
        || keyword['input_type'] === KEYWORD.KeywordArgType.DICT) {
        this.keywordParams.push('')
        this.showOperateButton = true
      }
      this.showParams = true
    },
    saveFixture() {
      if (this.fixtureKeywords.length === 0) {
        return
      }
      const valueStr = this.fixtureKeywords.join(this.fixtureJoinSep)
      const postData = {[this.editField]: valueStr}
      const moduleInfo = this.getModuleInfo()
      postData['module_id'] = moduleInfo.id
      postData['module_type'] = moduleInfo.type
      saveSetupTeardown(postData).then(response => {
        this.showFixtureEdit = false
        this.handlerFixture(response.data)
        this.updateTreeNode(NODE.ExtraDataKey.FIXTURE, response.data)
      }).catch(error => {
        this.$message.error(error)
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
    addParam() {
      this.keywordParams.push('')
    },
    deleteParam() {
      this.keywordParams.pop()
    },
    addKeywordToFixture() {
      const keywordMsg = this.currentKeyword + '|' + this.keywordParams.join('|')
      this.fixtureKeywords.push(keywordMsg)
    },
    removeKeywordFromFixture(index) {
      this.fixtureKeywords.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.fixture {
  .fixture-alter {
    margin-top: 10px;
  }
  .fixture-body {
    margin-bottom: 15px;
    .fixture-item {
      margin-top: 12px;
      .item-desc {
        margin: 0 0 4px 0;
        font-size: 14px;
        color: #6b778c;
        .help-icon {
          cursor: pointer;
          vertical-align: -10%;
        }
        .edit-icon {
          margin-left: 5px;
          font-size: 16px;
          cursor: pointer;
          vertical-align: -20%;
          &:hover {
            color: $mainColor;
          }
        }
      }
      .item-value {
        margin: 0;
        padding: 2px 0 5px 0;
        min-height: 34px;
        //border: 1px solid #dcdfe6;
        box-shadow: 0 0 0 1px #dcdfe6 inset;
        border-radius: 4px;
      }
    }
  }
  .fixture-footer {
    margin-top: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: right;
  }
  .fixture-editor {
    .content {
      .fixture-keyword {
        padding: 2px 0 5px 0;
        min-height: 34px;
        //border: 1px solid #dcdfe6;
        box-shadow: 0 0 0 1px #dcdfe6 inset;
        border-radius: 4px;
        .item {
          margin: 3px 0 0 5px;
        }
      }
      .keyword-select {
        margin-top: 10px;
      }
      .keyword-params {
        .param-desc {
          margin: 10px 0 0 0;
          font-size: 13px;
          height: 28px;
        }
        .param-item {
          margin: 0 0 5px 0;
        }
      }
    }
  }
}
</style>
