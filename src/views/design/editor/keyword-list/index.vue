<template>
  <div class="keyword-list">
    <div v-if="!hideKeyword" class="keyword-show">
      <div class="head">
        <el-input
          class="keyword-search"
          v-model="searchInput"
          @change="filterKeyword"
          placeholder="关键字搜索">
        </el-input>
        <el-tooltip
          popper-class="custom-tooltip"
          class="tooltip-icon"
          effect="dark"
          content="收起"
          placement="bottom"
        >
          <el-icon class="fold-expand-icon" @click="hideOrShowKeywordArea(true)"><Expand /></el-icon>
        </el-tooltip>
      </div>
      <div class="content" id="et-keyword">
        <el-collapse v-model="groupNames">
          <el-collapse-item v-for="(group, index) in keywordArray" :key="index" :title="group['name']">
            <draggable
              :sort="false"
              :list="group['keywords']"
              :group="dragSetting"
              :clone="cloneKeyword"
              :force-fallback="true"
              :options="getOptions()"
              :move="moveKeyword"
              drag-class="drag-chosen"
              ghost-class="drag-ghost"
              item-key="id"
            >
              <template #item="{ element }">
                <div class="component-item">
                  <keyword-item :keyword-data="element" />
                </div>
              </template>
            </draggable>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div v-else class="keyword-hide">
      <el-tooltip
        popper-class="custom-tooltip"
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
import variables from "@/styles/variables.module.scss";
import axios from "axios";
import KeywordItem from "@/views/design/editor/keyword-list/components/KeywordItem";
import { getLibKeyword, getUserKeyword } from "@/api/keyword";
import { getKeywordGroup } from "@/api/kgroup";
import { guid } from "@/utils/other";

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
      searchInput: ''
    }
  },
  computed: {
    hideKeyword() {
      return this.$store.state.keyword.hideKeyword
    }
  },
  watch: {
    '$store.state.tree.projectId': {
      handler(value) {
        if (value === '') return
        this.getGroupsUserKeywords()
      },
      immediate: true
    },
    '$store.state.keyword.updateUserKeyword': {
      handler() {
        this.getGroupsUserKeywords()
      },
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
          this.$store.commit('keyword/SET_KEYWORD_OBJECTS', keywordDict)
          this.keywordArray = Object.values(groupDict)
        })
      )
    },
    getGroupsUserKeywords () {
      const projectId = this.$store.state.tree.projectId
      getUserKeyword(projectId).then(response => {
        const userKeywords = response.data
        const keywordDict = this.$store.state.keyword.keywordObjects
        for (let i = 0; i < userKeywords.length; i++) {
          const kw = userKeywords[i]
          keywordDict[kw.id] = kw
        }
        this.$store.commit('keyword/SET_KEYWORD_OBJECTS', keywordDict)
        const userGroupIndex = this.keywordArray.findIndex((item) => {return item['group_type'] === 1})
        this.keywordArray[userGroupIndex]['keywords'] = userKeywords
      })
    },
    cloneKeyword(original) {
      return {
        'keyword_id': original['id'],
        'keyword_type': original['keyword_type'],
        'input_args': original['input_params'],
        'output_args': original['output_params'],
        'uuid': guid()
      }
    },
    moveKeyword(e) {
      console.log(e)
      // return e.to && e.to.id === 'et-case'
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
    getOptions() {
      return {
        setdata: (dataTransfer) => {
          let img = new Image()
          img.src = 'https://www.google.no/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
          dataTransfer.setDragImage(img, 0, 0)
        }
      }
    },
    filterKeyword () {}
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";
$searchHeight: 40px;
$foldExpandIconSize: 32px;

.keyword-list {
  height: 100%;
  overflow-y: auto;
  .keyword-show {
    height: 100%;
    .head {
      height: $searchHeight;
      padding: 5px 0 0 5px;
      .tooltip-icon {
        float: right;
        width: $foldExpandIconSize;
      }
      .keyword-search {
        float: left;
        width: calc(100% - #{$foldExpandIconSize});
      }
    }
    .content {
      height: calc(100% - #{$searchHeight});
      padding: 0 5px;
      .component-item {
        width: 100%;
      }
      .drag-chosen {
        position: relative;
        z-index: 2;
        opacity: 0;
        width: 100px;
        height: 100px;
        overflow: hidden;
        display: inline-block;
        .keyword-item {
          width: 100px;
          height: 100px;
          border-bottom: none;
          display: inline-block;
          .item-image {
            margin-left: 20px;
            padding: 5px 0;
            text-align: center;
          }
          .item-name {
            width: 60px !important;
            margin-right: 15px !important;
            text-align: center !important;
            display: none !important;
            .text-name {
              font-size: 14px !important;
              margin: 0 !important;
              white-space: nowrap !important;
              text-overflow: ellipsis !important;
              overflow: hidden !important;
            }
          }
          .item-tip {
            display: none !important;
          }
        }
      }
      .drag-ghost {
        opacity: 1;
        width: 40px !important;
        height: 40px !important;
        position: relative !important;
        overflow: hidden !important;
        display: inline-block !important;
        border-bottom: none !important;
        .item-image {
          padding: 5px 0;
          text-align: center;
        }
        .item-name {
          height: 20px;
          width: 100%;
          text-align: center !important;
          display: none !important;
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
          display: none !important;
          .text-out {
            font-size: 13px;
            margin: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .item-tip {
          display: none !important;
          top: 0;
          right: 0;
          position: absolute;
        }
      }
    }
  }
  .keyword-hide {
  }
  .fold-expand-icon {
    font-size: $foldExpandIconSize;
    color: $foldIconColor;
    cursor: pointer;
    :hover {
      color: $foldIconHoverColor;
    }
  }
}
:deep(.el-collapse) {
  .el-collapse-item__header {
    font-size: 13px;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
