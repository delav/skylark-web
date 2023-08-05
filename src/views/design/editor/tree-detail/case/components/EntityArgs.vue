<template>
  <div class="entity-args">
    <div class="entity-desc">
      <p>{{entityArgs['keywordDesc']}}</p>
    </div>
    <div class="entity-input" v-if="inputType!==getArgType('none')">
      <div class="input-title">
        <span class="title-desc">
          <span class="input-icon" @click="expandInputArg=!expandInputArg">
            <el-icon v-if="expandInputArg"><CirclePlusFilled /></el-icon>
            <el-icon v-else><RemoveFilled /></el-icon>
          </span>
          <span class="input-text">输入参数</span>
        </span>
        <el-button
          class="input-button"
          v-if="inputType===getArgType('list')||inputType===getArgType('dict')"
          type="success" size="small"
          @click="addInputArg"
        >
          添加<el-icon><Plus /></el-icon>
        </el-button>
      </div>
      <div v-if="expandInputArg" class="input-content">
        <template v-if="inputType===getArgType('single')||inputType===getArgType('multi')">
          <p class="fixate-argument" v-for="(name, index) in entityArgs['inputNames']" :key="index">
            <el-tooltip
              popper-class="custom-tooltip"
              placement="top-start"
              effect="dark"
              :hide-after="50"
              :content="entityArgs['inputDesc'][index]"
            >
              <span class="argument-name">{{name}}:</span>
            </el-tooltip>
            <el-input
              class="argument-value"
              type="text"
              @change="updateCaseEntities"
              v-model="entityArgs['inputValues'][index]">
            </el-input>
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
                <span class="argument-name">args{{index+1}}:</span>
                <el-icon class="mover" color="#909399" title="移动"><Rank /></el-icon>
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
      <div class="output-title">
        <span class="output-icon" @click="expandOutputArg=!expandOutputArg">
          <el-icon v-if="expandOutputArg"><CirclePlusFilled /></el-icon>
          <el-icon v-else><RemoveFilled /></el-icon>
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
            <span class="argument-name">{{name}}:</span>
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
            <el-icon class="argument-icon" color="#f56c6c" @click="copyOutputArg(index)"><CopyDocument /></el-icon>
          </el-tooltip>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
// import SvgIcon from "@/components/SvgIcon";
import KEYWORD from "@/constans/keyword";
import { deepCopy } from "@/utils/dcopy";
import { getKeywordUid } from "@/utils/keyword";

export default {
  name: 'EntityArgs',
  components: {
    draggable
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
      } else if (v === 'single') {
        return KEYWORD.KeywordArgType.SINGLE
      } else if (v === 'multi') {
        return KEYWORD.KeywordArgType.MULTI
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
      } else if (this.inputType === this.getArgType('single')) {
        // single input args
        this.entityArgs['inputNames'] = [this.getKeywordAttr('input_params', keyword)]
        this.entityArgs['inputValues'] = [entity['input_args']]
        this.entityArgs['inputDesc'] = [this.getKeywordAttr('input_desc', keyword)]
      } else if (this.inputType === this.getArgType('multi')) {
        // multi input args
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
      } else if (this.inputType === this.getArgType('list')) {
        // list input args
        this.entityArgs['inputNames'] = []
        this.entityArgs['inputValues'] = entity['input_args'].split(this.entitySplitSep)
      } else if (this.inputType === this.getArgType('dict')) {
        // dict input args
        this.entityArgs['inputNames'] = []
        this.entityArgs['inputValues'] = entity['input_args'].split(this.entitySplitSep)
      }
      if (this.outputType === this.getArgType('none')) {
        this.entityArgs['outputNames'] = []
        this.entityArgs['outputValues'] = []
      } else if (this.outputType === this.getArgType('single')) {
        this.entityArgs['outputNames'] = ['Result']
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
  padding: 5px 0 5px 0;
  overflow-y: auto;
  .entity-desc {
    height: 60px;
    p {
      font-size: 14px;
      margin: 0;
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
          font-size: 16px;
          vertical-align: -15%;
        }
        .input-text {
          font-size: 15px;
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          left: 0;
          position: absolute;
          line-height: 32px;
        }
        .argument-value {
          margin-left: calc(#{$labelWidth} + 20px);
          width: calc(100% - #{$labelWidth} - 20px);
        }
      }
      .dynamic-argument {
        position: relative;
        margin: 5px 10px 0 10px;
        background-color: #f4f5f7;
        .argument-name {
          width: $labelWidth;
          max-width: $labelWidth;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          left: 0;
          position: absolute;
          line-height: 32px;
        }
        .mover {
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
        font-size: 16px;
        vertical-align: -15%;
      }
      .output-text {
        font-size: 15px;
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
          left: 0;
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
    }
  }
}
</style>
