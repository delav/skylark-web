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
          <el-collapse-item
            v-for="(group, index) in keywordArray"
            :name="group['name']"
            :key="index"
            :title="group['name']"
          >
            <draggable
              :sort="false"
              :list="group['keywords']"
              :group="dragSetting"
              :clone="cloneKeyword"
              :force-fallback="true"
              fallback-class="drag-fallback"
              ghost-class="drag-ghost"
              chosen-class="drag-chosen"
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
      searchInput: '',
      keywordArrayCache: ''
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
      }
    },
    searchInput: {
      handler() {
        this.filterKeyword()
      }
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
          this.keywordArrayCache = JSON.stringify(this.keywordArray)
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
        this.keywordArrayCache = JSON.stringify(this.keywordArray)
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
    moveKeyword(event) {
      console.log(event)
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
    dragStart(event) {
      console.log(event)
      let img = new Image()
      img.src = 'https://www.google.no/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
      event.item = img
      // event.originalEvent.dataTransfer.setDragImage(img, 0, 0)
    },
    filterKeyword () {
      const expandGroups = []
      const keywordArr = JSON.parse(this.keywordArrayCache)
      if (this.searchInput.trim() === '') {
        this.keywordArray = keywordArr
        this.groupNames = expandGroups
        return
      }
      const searchStr = this.searchInput.trim().toLowerCase()
      const length = keywordArr.length - 1
      for (let i = length; i >= 0; i--) {
        const groupData = keywordArr[i]
        groupData['keywords'] = groupData['keywords'].filter(function (item) {
          const nameStr = item['ext_name'].toLowerCase()
          return nameStr.indexOf(searchStr) !== -1
        })
        if (groupData['keywords'].length === 0) {
          keywordArr.splice(i, 1)
        } else {
          expandGroups.push(keywordArr[i]['name'])
        }
      }
      this.keywordArray = keywordArr
      this.groupNames = expandGroups
    }
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
.drag-chosen {
}
.drag-ghost {
  width: calc(#{$entityGridWidth} - 4px);
  height: calc(#{$entityGridHeight} - 4px);
  margin: 2px;
  position: relative;
  overflow: hidden;
  display: inline-block;
  border-bottom: none;
  background-color: #7a869a;
  .item-content {
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    //top: 50%;
    //left: 50%;
    //transform: translate(-50%,-50%);
    .item-image {
      padding: 5px 0;
    }
    .item-name {
      padding: 0 3px;
      height: 20px;
      font-size: 12px;
    }
    .item-out {
      height: 20px;
      margin-top: 5px;
      font-size: 12px;
    }
  }
  .item-tip {
    top: 0;
    left: 0;
    position: absolute;
  }
}
.drag-fallback {
  width: calc(#{$entityGridWidth} - 4px);
  height: calc(#{$entityGridHeight} - 4px);
  display: inline-block;
  background-color: #9a6e3a;
  cursor: move;
  overflow: hidden;
  position: relative;
  .item-image {
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .item-name {
    text-align: center;
    display: none;
    .text-name {
      font-size: 14px;
      margin: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .item-tip {
    display: none;
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
