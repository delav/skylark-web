<template>
  <div class="entity-args">
    <div class="entity-desc">
      <p>{{entityArgs['keywordDesc']}}</p>
    </div>
    <div class="entity-input" v-if="inputType!==getArgType('none')">
      <div class="input-title">
        <span class="title-desc" @click="expandInputArg=!expandInputArg">
          <span class="input-icon">
            <el-icon v-if="expandInputArg"><CaretBottom /></el-icon>
            <el-icon v-else><CaretRight /></el-icon>
          </span>
          <span class="input-text">输入参数</span>
        </span>
        <el-button
          class="input-button"
          v-if="inputType===getArgType('list')||inputType===getArgType('dict')"
          size="small"
          @click="addInputArg"
          plain
        >
          <el-icon><Plus /></el-icon>添加
        </el-button>
      </div>
      <div v-if="expandInputArg" class="input-content">
        <template v-if="inputType===getArgType('finite')">
          <p class="fixate-argument" v-for="(name, index) in entityArgs['inputNames']" :key="index">
            <el-tooltip
              popper-class="custom-tooltip"
              placement="top-start"
              effect="dark"
              :hide-after="50"
              :content="entityArgs['inputDesc'][index]"
            >
              <span class="argument-name">{{name}}</span>
            </el-tooltip>
            <el-input
              class="argument-value"
              type="text"
              @change="updateCaseEntities"
              v-model="entityArgs['inputValues'][index]">
            </el-input>
            <el-tooltip
              popper-class="custom-tooltip"
              placement="top-start"
              effect="dark"
              content="格式化编辑"
            >
              <el-icon class="argument-icon" color="#00acc1" @click="formatEditJson(index)"><Crop /></el-icon>
            </el-tooltip>
          </p>
        </template>
        <template v-if="inputType===getArgType('list')||inputType===getArgType('dict')">
          <draggable
            id="case-entity"
            v-model="entityArgs['inputValues']"
            group="people"
            animation="300"
            item-key="id"
            @update="updateCaseEntities"
            handle=".mover"
          >
            <template #item="{ index }">
              <p class="dynamic-argument">
                <span class="argument-name">arg{{index+1}}</span>
                <el-icon class="mover" color="#909399"><Rank /></el-icon>
                <el-input
                  class="argument-value"
                  type="text"
                  @change="updateCaseEntities"
                  v-model="entityArgs['inputValues'][index]">
                  <template #suffix>
                    <el-icon class="el-input__icon" style="cursor: pointer" @click="formatEditJson(index)"><Crop /></el-icon>
                  </template>
                </el-input>
                <el-tooltip
                  popper-class="custom-tooltip"
                  placement="top-start"
                  effect="dark"
                  content="删除"
                >
                  <el-icon class="argument-icon" color="#f56c6c" @click="delInputArg(index)"><Delete /></el-icon>
                </el-tooltip>
              </p>
            </template>
          </draggable>
        </template>
      </div>
    </div>
    <div class="entity-output" v-if="outputType!==getArgType('none')">
      <div class="output-title" @click="expandOutputArg=!expandOutputArg">
        <span class="output-icon">
          <el-icon v-if="expandOutputArg"><CaretBottom /></el-icon>
          <el-icon v-else><CaretRight /></el-icon>
        </span>
        <span class="output-text">输出参数</span>
      </div>
      <div v-if="expandOutputArg" class="output-content">
        <p class="argument-content" v-for="(name, index) in entityArgs['outputNames']" :key="index">
          <el-tooltip
            popper-class="custom-tooltip"
            placement="top-start"
            effect="dark"
            :hide-after="50"
            :content="entityArgs['outputDesc'][index]"
          >
            <span class="argument-name">{{name}}</span>
          </el-tooltip>
          <el-input
            class="argument-value"
            type="text"
            @change="updateCaseEntities"
            v-model="entityArgs['outputValues'][index]">
          </el-input>
          <el-tooltip
            popper-class="custom-tooltip"
            placement="top-start"
            effect="dark"
            content="复制"
          >
            <el-icon class="argument-icon" color="#00acc1" @click="copyOutputArg(index)"><CopyDocument /></el-icon>
          </el-tooltip>
        </p>
      </div>
    </div>
    <div class="dialog-area">
      <el-dialog
        width="75%"
        v-model="showJsonDialog"
        title="格式化编辑"
        :close-on-click-modal="false"
        :destroy-on-close="true"
      >
        <div class="editor-content">
          <json-editor
            :options="jsonOptions"
            v-model="jsonValue"
            :style="{ height: '360px', overflowX: 'hidden', overflowY: 'auto' }"
          />
        </div>
        <template #footer>
          <el-button @click="cancelEditArgValue">取消</el-button>
          <el-button type="primary" @click="saveEditArgValue">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import JsonEditor from '@/components/JsonEditor'
import KEYWORD from "@/constans/keyword";
import { deepCopy } from "@/utils/dcopy";
import { getKeywordUid } from "@/utils/keyword";

export default {
  name: 'EntityArgs',
  components: {
    draggable,
    JsonEditor
  },
  data() {
    return {
      entitySplitSep: '#@#',
      keywordSplitSep: '|',
      inputType: 0,
      outputType: 0,
      entityArgs: {},
      expandInputArg: true,
      expandOutputArg: true,
      jsonOptions: {
        mode: 'code',
        history: false,
        search: false,
        statusBar: false,
        enableSort: false,
        enableTransform: false,
        navigationBar: false,
      },
      jsonValue: '',
      editIndex: 0,
      showJsonDialog: false,
      rawJsonValue: '',
      isJsonString: false
    }
  },
  computed: {
    currentEntity() {
      return this.$store.state.entity.currentEntity
    },
    keywordDict() {
      return this.$store.state.keyword.keywordObjects
    }
  },
  watch: {
    currentEntity: {
      handler(value) {
        this.getEntityArgs(value)
      },
      deep: true,
    }
  },
  methods: {
    getArgType(v) {
      if (v === 'none') {
        return KEYWORD.KeywordArgType.NONE
      } else if (v === 'finite') {
        return KEYWORD.KeywordArgType.FINITE
      } else if (v === 'list') {
        return KEYWORD.KeywordArgType.LIST
      } else if (v === 'dict') {
        return KEYWORD.KeywordArgType.DICT
      }
      return null
    },
    updateCaseEntities() {
      const entities = this.$store.state.entity.caseEntities
      const newInputArgs = this.entityArgs['inputValues'].join(this.entitySplitSep)
      const newOutputArgs = this.entityArgs['outputValues'].join(this.entitySplitSep)
      for (let i = 0; i < entities.length; i++) {
        if (entities[i]['uuid'] === this.entityArgs['meta']['uuid']) {
          entities[i]['input_args'] = newInputArgs
          entities[i]['output_args'] = newOutputArgs
          break
        }
      }
      this.$store.commit('entity/SET_CASE_ENTITIES', entities)
      this.$store.commit('entity/SET_ENTITY_CHANGE', true)
    },
    getKeywordAttr(attr, keywordObject) {
      if (attr in keywordObject) {
        return keywordObject[attr]
      }
      return ''
    },
    getRelatedKeyword(keywordId, keywordType) {
      const keywordUid = getKeywordUid(keywordId, keywordType)
      if (keywordUid in this.keywordDict) {
        return this.keywordDict[keywordUid]
      }
      return {}
    },
    handleInputParams(keyword, entity) {
      // input args
      this.entityArgs['inputNames'] = this.getKeywordAttr('input_params', keyword).split(this.keywordSplitSep)
      let values = entity['input_args'].split(this.entitySplitSep)
      const diffValue = this.entityArgs['inputNames'].length - values.length
      if (diffValue > 0) {
        values = values.concat(Array(diffValue))
      }
      this.entityArgs['inputValues'] = values
      let descList = this.getKeywordAttr('input_desc', keyword).split(this.keywordSplitSep)
      const diffDesc = this.entityArgs['inputNames'].length - descList.length
      if (diffDesc > 0) {
        descList = descList.concat(Array(diffDesc))
      }
      this.entityArgs['inputDesc'] = descList
    },
    getEntityArgs(entity) {
      if (JSON.stringify(entity) === '{}') {
        Object.assign(this.$data, this.$options.data())
        return
      }
      const keyword = this.getRelatedKeyword(entity['keyword_id'], entity['keyword_type'])
      this.entityArgs['meta'] = deepCopy(entity)
      this.inputType = this.getKeywordAttr('input_type', keyword)
      this.outputType = this.getKeywordAttr('output_type', keyword)
      this.entityArgs['keywordDesc'] = this.getKeywordAttr('desc',  keyword)
      if (this.inputType === this.getArgType('none')) {
        // not input args
        this.entityArgs['inputNames'] = []
        this.entityArgs['inputValues'] = []
      } else if (this.inputType === this.getArgType('finite')) {
        // finite input args
        this.handleInputParams(keyword, entity)
      } else if (this.inputType === this.getArgType('list')) {
        // list input args
        this.handleInputParams(keyword, entity)
      } else if (this.inputType === this.getArgType('dict')) {
        // dict input args
        this.handleInputParams(keyword, entity)
      }
      if (this.outputType === this.getArgType('none')) {
        this.entityArgs['outputNames'] = []
        this.entityArgs['outputValues'] = []
      } else if (this.outputType === this.getArgType('finite')) {
        this.entityArgs['outputNames'] = ['result']
        this.entityArgs['outputValues'] = [entity['output_args']]
        this.entityArgs['outputDesc'] = [this.getKeywordAttr('output_desc', keyword)]
      }
    },
    addInputArg() {
      const addInputArgs = this.entityArgs['inputValues']
      addInputArgs.push('')
      this.entityArgs['inputValues'] = addInputArgs
      this.updateCaseEntities()
    },
    delInputArg(index) {
      const delInputArgs = this.entityArgs['inputValues']
      delInputArgs.splice(index, 1)
      this.entityArgs['inputValues'] = delInputArgs
      this.updateCaseEntities()
    },
    copyOutputArg(index) {
      const cInput = document.createElement('input')
      cInput.value = this.entityArgs['outputValues'][index]
      document.body.appendChild(cInput)
      cInput.select()
      document.execCommand('Copy')
      cInput.remove()
      this.$message({
        type: 'success',
        message: '复制成功',
        duration: 1500
      })
    },
    formatEditJson(index) {
      const inputVal = this.entityArgs['inputValues'][index]
      if (typeof inputVal == 'string') {
        try {
          const obj = JSON.parse(inputVal)
          if (typeof obj == 'object' && obj) {
            this.jsonValue = obj
            this.isJsonString = true
          } else {
            this.jsonValue = inputVal
          }
        } catch (e) {
          this.jsonValue = inputVal
        }
      } else {
        this.jsonValue = inputVal
      }
      this.editIndex = index
      this.rawJsonValue = inputVal
      this.showJsonDialog = true
    },
    cancelEditArgValue() {
      this.entityArgs['inputValues'][this.editIndex] = this.rawJsonValue
      this.showJsonDialog = false
    },
    saveEditArgValue() {
      if (this.isJsonString) {
        this.entityArgs['inputValues'][this.editIndex] = JSON.stringify(this.jsonValue)
      } else {
        this.entityArgs['inputValues'][this.editIndex] = this.jsonValue
      }
      this.showJsonDialog = false
      this.updateCaseEntities()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";
$labelWidth: 80px;

.entity-args {
  width: 100%;
  height: 100%;
  padding: 5px 5px 10px 5px;
  overflow-y: auto;
  .entity-desc {
    height: 60px;
    p {
      padding: 0 5px;
      font-size: 13px;
      margin: 0;
      color: $textColor;
    }
  }
  .entity-input {
    width: 100%;
    margin-top: 15px;
    .input-title {
      height: 25px;
      .title-desc {
        cursor: pointer;
        color: $mainColor;
        .input-icon {
          font-size: 18px;
          vertical-align: -15%;
        }
        .input-text {
          font-size: 14px;
        }
      }
      .input-button {
        margin-left: 35px;
      }
    }
    .input-content {
      width: 100%;
      .fixate-argument {
        position: relative;
        margin: 5px 10px;
        background-color: #f4f5f7;
        .argument-name {
          width: $labelWidth;
          max-width: $labelWidth;
          color: $textColor;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          left: 0;
          padding-left: 5px;
          position: absolute;
          line-height: 32px;
        }
        .argument-value {
          margin-left: calc(#{$labelWidth} + 20px);
          width: calc(100% - #{$labelWidth} - 44px);
        }
        .argument-icon {
          width: 20px;
          margin: 0 2px 0 2px;
          cursor: pointer;
          vertical-align: -20%;
          font-size: 16px;
        }
      }
      .dynamic-argument {
        position: relative;
        margin: 5px 10px 0 10px;
        background-color: #f4f5f7;
        .argument-name {
          width: $labelWidth;
          max-width: $labelWidth;
          color: $textColor;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          left: 0;
          padding-left: 5px;
          position: absolute;
          line-height: 32px;
        }
        .mover {
          color: $mainColor;
          margin-left: $labelWidth;
          position: absolute;
          width: 16px;
          top: 25%;
          cursor: pointer;
          font-size: 16px;
        }
        .argument-value {
          margin-left: calc(#{$labelWidth} + 20px);
          width: calc(100% - #{$labelWidth} - 44px);
        }
        .argument-icon {
          width: 20px;
          margin: 0 2px 0 2px;
          cursor: pointer;
          vertical-align: -20%;
          font-size: 16px;
        }
      }
    }
  }
  .entity-output {
    width: 100%;
    margin-top: 15px;
    .output-title {
      height: 25px;
      cursor: pointer;
      color: $mainColor;
      .output-icon {
        font-size: 18px;
        vertical-align: -15%;
      }
      .output-text {
        font-size: 14px;
      }
    }
    .output-content {
      width: 100%;
      .argument-content {
        background-color: #f4f5f7;
        position: relative;
        margin: 5px 10px 0 10px;
        .argument-name {
          width: $labelWidth;
          color: $textColor;
          left: 0;
          position: absolute;
          line-height: 32px;
          padding-left: 5px;
        }
        .argument-value {
          margin-left: calc(#{$labelWidth} + 20px);
          width: calc(100% - #{$labelWidth} - 44px);
        }
        .argument-icon {
          width: 20px;
          margin: 0 2px 0 2px;
          cursor: pointer;
          vertical-align: -20%;
          font-size: 16px;
        }
      }
    }
  }
  .dialog-area {
    .editor-content {
      max-height: 75%;
      min-height: 360px;
    }
  }
}
:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 0;
    padding: 1px 6px 1px 10px;
    input {
      border-radius: 0;
    }
  }
}
</style>
