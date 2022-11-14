<template>
  <div class="entity-args">
    <div class="entity-desc">
      <p>{{getRelatedKeywordAttrById('desc', currentEntity['keyword_id'])}}</p>
    </div>
    <div class="entity-input" v-if="inputType!==0">
      <div class="input-title">
        <span class="title-desc" @click="expandInputArg=!expandInputArg">
          <span class="title-icon">
            <el-icon v-if="expandInputArg"><CirclePlusFilled /></el-icon>
            <el-icon v-else><RemoveFilled /></el-icon>
          </span>
          <span class="title-text">输入参数</span>
        </span>
        <el-button class="new-button" v-if="inputType===3||inputType===4" type="success" size="small" @click="addInputArg">
          添加<el-icon><Plus /></el-icon>
        </el-button>
      </div>
      <div v-if="expandInputArg" class="input-content">
        <template v-if="inputType===1||inputType===2">
          <p class="argument-content" v-for="(name, index) in entityArgs['inputNames']" :key="index">
            <span :title="name" class="argument-name">{{name}}:</span>
            <el-input class="argument-value" type="text" v-model="entityArgs['inputValues'][index]"></el-input>
          </p>
        </template>
        <template v-if="inputType===3||inputType===4">
          <draggable
            id="case-entity"
            v-model="entityArgs['inputValues']"
            group="people"
            item-key="id"
          >
            <template #item="{ element, index }">
              <p class="argument-content">
                <span class="argument-name">args{{index+1}}:</span>
                <el-input class="argument-value" type="text" :v-model="element"></el-input>
                <el-icon class="argument-icon" title="删除" @click="delInputArg(index)"><DeleteFilled /></el-icon>
              </p>
            </template>
          </draggable>
        </template>
      </div>
    </div>
    <div class="entity-output" v-if="outputExist">
      <div class="output-title" @click="expandOutputArg=!expandOutputArg">
        <el-icon style="vertical-align: -20%;" color="#1fb496" size="16" v-if="expandOutputArg"><CirclePlusFilled /></el-icon>
        <el-icon style="vertical-align: -20%;" color="#1fb496" size="16" v-else><RemoveFilled /></el-icon>
        <span>输出参数</span>
      </div>
      <div v-if="expandOutputArg" class="output-content">
        <p class="argument-content" v-for="(name, index) in entityArgs['outputNames']" :key="index">
          <span class="argument-name">{{name}}:</span>
          <el-input class="argument-value" type="text" v-model="entityArgs['outputValues'][index]"></el-input>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// import SvgIcon from "@/components/SvgIcon";
export default {
  name: 'EntityArgs',
  // components: {SvgIcon},
  data() {
    return {
      entityInputSplitSep: '#@#',
      keywordInputSplitSep: '|',
      inputType: 0,
      outputExist: false,
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
      return this.$store.state.keyword.keywordsObject
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
    getRelatedKeywordAttrById(attr, keywordId) {
      if (keywordId in this.keywordDict) {
        if (attr in this.keywordDict[keywordId]) {
          return this.keywordDict[keywordId][attr]
        }
      }
      return ''
    },
    getEntityArgs(entity) {
      this.inputType = this.getRelatedKeywordAttrById('input_type', entity['keyword_id'])
      if (this.inputType === 0) {
        // not input args
        this.entityArgs['inputNames'] = []
        this.entityArgs['inputValues'] = []
      } else if (this.inputType === 1) {
        // single input args
        this.entityArgs['inputNames'] = [this.getRelatedKeywordAttrById('input_params', entity['keyword_id'])]
        this.entityArgs['inputValues'] = [entity['input_args']]
      } else if (this.inputType === 2) {
        // multi input args
        this.entityArgs['inputNames'] = this.getRelatedKeywordAttrById('input_params', entity['keyword_id']).split(this.keywordInputSplitSep)
        let values = entity['input_args'].split(this.entityInputSplitSep)
        const diffValue = this.entityArgs['inputNames'].length - values.length
        if (diffValue > 0) {
          values = values.concat(Array(diffValue))
        }
        this.entityArgs['inputValues'] = values
      } else if (this.inputType === 3) {
        // list input args
        this.entityArgs['inputNames'] = []
        this.entityArgs['inputValues'] = entity['input_args'].split(this.entityInputSplitSep)
      } else if (this.inputType === 4) {
        // dict input args
        this.entityArgs['inputNames'] = []
        this.entityArgs['inputValues'] = entity['input_args'].split(this.entityInputSplitSep)
      }
      if (entity['output_args'] === '' || entity['output_args'] === null) {
        this.entityArgs['outputNames'] = []
        this.entityArgs['outputValues'] = []
      } else {
        this.outputExist = true
        this.entityArgs['outputNames'] = ['Result']
        this.entityArgs['outputValues'] = [entity['output_args']]
      }
    },
    addInputArg() {
      const addInputArgs = this.entityArgs['inputValues']
      addInputArgs.push('')
      this.entityArgs['inputValues'] = addInputArgs
    },
    delInputArg(index) {
      const delInputArgs = this.entityArgs['inputValues']
      delInputArgs.splice(index, 1)
      this.entityArgs['inputValues'] = delInputArgs
    }
  }
}
</script>

<style lang="scss" scoped>
$labelWidth: 100px;

.entity-args {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  .entity-desc {
    height: 60px;
  }
  .entity-input {
    width: 100%;
    .input-title {
      height: 30px;
      .title-desc {
        cursor: pointer;
        .title-icon {
          font-size: 16px;
          vertical-align: -15%;
          color: #1fb496;
        }
        .title-text {
          font-size: 15px;
          color: #008489;
        }
      }
      .new-button {
        margin-left: 35px;
      }
    }
    .input-content {
      width: 100%;
      .argument-content {
        position: relative;
        margin: 5px 10px;
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
          margin-left: $labelWidth;
          width: calc(100% - #{$labelWidth} - 30px);
        }
        .argument-icon {
          width: 30px;
          color: #f56c6c;
          cursor: pointer;
          vertical-align: -20%;
          font-size: 16px;
        }
      }
    }
  }
  .entity-output {
    width: 100%;
    .output-title {
      height: 30px;
      span {
        font-size: 14px;
        color: #008489;
      }
    }
    .output-content {
      width: 100%;
      .argument-content {
        position: relative;
        margin: 5px 10px;
        .argument-name {
          width: $labelWidth;
          left: 0;
          position: absolute;
          line-height: 32px;
        }
        .argument-value {
          margin-left: $labelWidth;
          width: calc(100% - #{$labelWidth} - 30px);
        }
      }
    }
  }
}
</style>
