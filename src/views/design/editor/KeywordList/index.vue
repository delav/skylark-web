<template>
  <div class="keyword-list">
    <div v-if="!hideKeyword" class="keyword-show">
      <div class="head">
        <el-tooltip
          class="tooltip-icon"
          effect="dark"
          content="收起"
          placement="bottom"
        >
          <el-icon class="fold-expand-icon" @click="hideOrShowKeywordArea(true)"><Expand /></el-icon>
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
    <div v-else class="keyword-hide">
      <el-tooltip
        effect="dark"
        content="展开"
        placement="bottom"
      >
        <el-icon class="fold-expand-icon" @click="hideOrShowKeywordArea(false)"><Fold /></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import variables from '@/styles/variables.module.scss'
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
      splitSep: '#@#',
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
    },
    hideKeyword() {
      return this.$store.state.keyword.hideKeyword
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
          this.$store.commit('keyword/SET_KEYWORDS_OBJECT', keywordDict)
          this.keywordArray = Object.values(groupDict)
        })
      )
    },
    cloneKeyword(original) {
      return {
        'keyword_id': original['id'],
        'keyword_type': 1,
        'input_args': '',
        'output_args': original['input_params'],
        'uuid': guid()
      }
    },
    appendKeywordToCase() {},
    hideOrShowKeywordArea(isHide) {
      this.$store.commit('keyword/SET_HIDE_KEYWORD', isHide)
      const left = document.getElementById('left-and-middle')
      const right = document.getElementById('right')
      if (isHide) {
        right.style.width = variables.foldWidth
        left.style.width = `calc(100% - ${variables.foldWidth} - ${variables.rightResizeWidth})`
      } else {
        right.style.width = variables.keywordWidth
        left.style.width = `calc(100% - ${variables.keywordWidth} - ${variables.rightResizeWidth})`
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";
$searchHeight: 40px;
$foldExpandIconSize: 32px;

.keyword-list {
  height: 100%;
  .keyword-show {
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
  }
  .keyword-hide {
  }
  .fold-expand-icon {
    font-size: $foldExpandIconSize;
    color: $foldIconColor;
    cursor: pointer;
  }
}
</style>
