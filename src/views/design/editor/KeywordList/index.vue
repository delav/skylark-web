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
          <el-collapse-item v-for="(group, index) in keywordArray" :key="index" :title="group['name']">
            <draggable
              :sort="false"
              :list="group['keywords']"
              :group="dragSetting"
              :clone="cloneKeyword"
              :forceFallback="true"
              ghost-class="ghost-item"
              drag-class="drag-item"
              item-key="id"
            >
              <template #item="{ element }">
                <keyword-item :keyword-data="element" />
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
import { getLibKeyword, getUserKeyword } from '@/api/keyword'
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
    hideKeyword() {
      return this.$store.state.keyword.hideKeyword
    }
  },
  watch: {
    '$store.state.project.projectId': {
      handler(value) {
        if (value === '') return
        this.getGroupsUserKeywords(value)
      },
      immediate: true
    }
  },
  created() {
    this.getGroupsLibKeywords()
  },
  methods: {
    getGroupsLibKeywords() {
      let keywordDict = {}
      axios.all([getKeywordGroup(), getLibKeyword()]).then(
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
    getGroupsUserKeywords (projectId) {
      getUserKeyword(projectId).then(response => {
        for (let i = 0; i < this.keywordArray.length; i++) {
          if (this.keywordArray[i]['name'] === '用户类'){
            this.keywordArray[i]['keywords'] = response.data
            break
          }
        }
      })
    },
    cloneKeyword(original) {
      return {
        'keyword_id': original['id'],
        'keyword_type': 1,
        'input_args': '',
        'output_args': original['output_params'],
        'uuid': guid()
      }
    },
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
/deep/ .el-collapse-item__content {
  border-top: 1px solid #000;
  padding-bottom: 15px
}

.ghost-item {
  width: 100px !important;
  height: 100px !important;
  position: relative !important;
  overflow: hidden !important;
  display: inline-block !important;
  //background-color: #bdc6ce !important;
  border-bottom: none !important;
  .item-image {
    padding: 5px 0 !important;
    text-align: center !important;
  }
  .item-name {
    height: 20px;
    width: 100%;
    text-align: center !important;
    .text-name {
      font-size: 13px;
      margin: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .item-out {
    height: 20px;
    width: 100%;
    margin-top: 5px;
    text-align: center;
    .text-out {
      font-size: 13px;
      margin: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .item-tip {
    top: 0;
    right: 0;
    position: absolute;
  }
}
//.chosen-item {
//  background-color: #7a869a;
//}
.drag-item {
  width: 100px;
  height: 100px;
  background-color: #bdc6ce !important;
  display: inline-block !important;
  border-bottom: none !important;
  .item-image {
    margin-left: 20px;
    padding: 5px 0 !important;
    text-align: center !important;
  }
  .item-name {
    width: 60px !important;
    margin-right: 15px !important;
    text-align: center !important;
    .text-name {
      font-size: 14px !important;
      margin: 0 !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      overflow: hidden !important;
    }
  }
  .item-tip {
    visibility: hidden !important;
    display: none !important;
  }
}
</style>
