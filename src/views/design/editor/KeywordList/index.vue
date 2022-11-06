<template>
  <div class="keyword-list">
    <div class="head">
      <el-tooltip
        class="tooltip-icon"
        effect="dark"
        content="收起"
        placement="bottom"
      >
        <el-icon class="fold-expand-icon"><Expand /></el-icon>
      </el-tooltip>
      <el-input
        class="keyword-search"
        v-model="searchKeyword"
        placeholder="搜索">
      </el-input>
    </div>
    <div class="content">
      <el-collapse v-model="groupNames">
        <el-collapse-item v-for="(group, index) in keywordArray" :key="index" :title="group['group_name']">
          <draggable
            :list="group['keywords']"
            :group="dragSetting"
            :clone="cloneKeyword"
            item-key="id"
          >
            <template #item="{ element }">
              <keyword-item :keyword-data="element" v-on:dblclick="appendKeywordToCase"/>
            </template>
          </draggable>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import KeywordItem from './components/KeywordItem'
import { getLibKeyword } from '@/api/keyword'
import { getKeywordGroup } from '@/api/kgroup'
import { guid } from '@/utils/other'

export default {
  name: 'KeywordList',
  components: {
    KeywordItem,
  },
  data() {
    return {
      keywordArray: [],
      dragSetting: {
        name: 'kws',
        put: false,
        pull: 'clone',
      },
      groupNames: [],
      searchKeyword: ''
    }
  },
  computed: {
    projectId() {
      return this.$store.state.tree.projectId
    }
  },
  created() {
    this.getGroupsLibKeywords()
  },
  methods: {
    getGroupsLibKeywords() {
      let keywordDict = {}
      const r1 = getKeywordGroup()
      const r2 = getLibKeyword()
      axios.all([r1, r2]).then(
        axios.spread((r1, r2) => {
          const groups = r1.data
          const keywords = r2.data
          const groupDict = {}
          for (let i = 0; i < groups.length; i++) {
            groups[i]['keywords'] = []
            groupDict[groups[i].id] = groups[i]
          }
          for (let j = 0; j < keywords.length; j++) {
            const kw = keywords[j]
            keywordDict[kw.id] = kw
            groupDict[kw['group_id']]['keywords'].push(kw)
          }
          this.$store.commit('entity/SET_KEYWORDS_OBJECT', keywordDict)
          this.keywordArray = Object.values(groupDict)
        })
      )
    },
    cloneKeyword(original) {
      return {
        'keyword_id': original['id'],
        'keyword_type': 1,
        'input_args': original['input_params'],
        'output_args': original['output_params'],
        'uuid': guid()
      }
    },
    appendKeywordToCase() {}
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.scss";
$searchHeight: 40px;
$foldExpandIconSize: 32px;

.keyword-list {
  width: 100%;
  height: 100%;
  .head {
    height: $searchHeight;
    .tooltip-icon {
      float: right;
      width: $foldExpandIconSize;
    }
    .keyword-search {
      float: right;
      width: calc(100% - #{$foldExpandIconSize});
    }
  }
  .content {
    height: calc(100% - #{$searchHeight});
  }
  .fold-expand-icon {
    font-size: $foldExpandIconSize;
    color: $mainColor;
    cursor: pointer;
  }
}
</style>
