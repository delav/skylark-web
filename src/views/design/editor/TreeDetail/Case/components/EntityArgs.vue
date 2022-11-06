<template>
  <div class="entity-args">
    <div class="entity-desc">
      <div class="argument-desc">
        <p>{{getRelatedKeywordAttrById('desc', currentEntity['keyword_id'])}}</p>
      </div>
    </div>
    <div class="entity-input">
      <div class="argument-icon" @click="entityArgs['input'].length>0?expandInputArg=!expandInputArg:''">
        <i class="icon iconfont icon-jiahao" v-if="expandInputArg"></i>
        <i class="icon iconfont icon-jianhao" v-else></i>
        <p>输入参数</p>
      </div>
      <div v-if="expandInputArg" class="argument-table">
        <p v-for="(input, index) in entityArgs['input']" :key="index">
          <label>参数{{index+1}}:</label>
          <el-input type="text" v-model="entityArgs['input'][index]"></el-input>
          <span v-if="inputType===3||inputType===4">
                    <i v-if="index===0" class="icon iconfont icon-jiahaozhankai" title="添加"></i>
                    <i v-else class="icon iconfont icon-jianhaoshouqi" title="删除"></i>
                  </span>
        </p>
      </div>
    </div>
    <div class="entity-output">
      <div class="argument-icon" @click="entityArgs['output'].length>0?expandOutputArg=!expandOutputArg:''">
        <i class="icon iconfont icon-jiahao" v-if="expandOutputArg"></i>
        <i class="icon iconfont icon-jianhao" v-else></i>
        <p>输出参数</p>
      </div>
      <div v-if="expandOutputArg" class="argument-table">
        <p v-for="(output,index) in entityArgs['output']" :key="index">
          <label>参数{{index+1}}:</label>
          <el-input type="text" v-model="entityArgs['output'][index]"></el-input>
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
      splitSep: '#@#',
      inputType: 0,
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
      return this.$store.state.entity.keywordsObject
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
        this.entityArgs['input'] = []
      } else if (this.inputType === 1) {
        // single input args
        this.entityArgs['input'] = entity['input_args']
      } else if (this.inputType === 2) {
        // multi input args
        this.entityArgs['input'] = entity['input_args'].split(this.splitSep)
      } else if (this.inputType === 3) {
        // list input args
        this.entityArgs['input'] = entity['input_args'].split(this.splitSep)
      } else if (this.inputType === 4) {
        // dict input args
        this.entityArgs['input'] = entity['input_args'].split(this.splitSep)
      }
      if (entity['output_args'] === '' || entity['output_args'] === null) {
        this.entityArgs['output'] = []
      } else {
        this.entityArgs['output'] = [entity['output_args']]
      }
    }
  }
}
</script>

<style scoped>

</style>
