<template>
  <div class="keyword-list">
    <div v-if="!hideKeyword" class="keyword-show">
      <div class="head">
        <el-input
          class="keyword-search"
          v-model="searchInput"
          @change="filterKeyword"
          placeholder="组件搜索">
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
            v-for="(group, index) in keywordGroups"
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
              fallback-class="custom-fallback"
              ghost-class="custom-ghost"
              chosen-class="custom-chosen"
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
import axios from "axios";
import variables from "@/styles/variables.module.scss";
import draggable from "vuedraggable";
import KeywordItem from "@/views/design/editor/keyword-list/components/KeywordItem";
import { getLibKeyword, getUserKeyword } from "@/api/keyword";
import { guid } from "@/utils/other";
import { getKeywordUid } from "@/utils/keyword";

export default {
  name: 'KeywordList',
  components: {
    draggable,
    KeywordItem,
  },
  data() {
    return {
      splitSep: '#@#',
      keywordGroups: [],
      dragSetting: {
        name: 'kws',
        put: false,
        pull: 'clone',
      },
      groupNames: [],
      searchInput: '',
      keywordGroupsCache: ''
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
        this.getProjectKeywords()
      }
    },
    '$store.state.keyword.updateUserKeyword': {
      handler() {
        this.getGroupUserKeywords()
      }
    },
    searchInput: {
      handler() {
        this.filterKeyword()
      }
    }
  },
  methods: {
    getProjectKeywords() {
      const projectId = this.$store.state.tree.projectId
      axios.all([getLibKeyword({'project_id': projectId}), getUserKeyword(projectId)]).then(
        axios.spread((r1, r2) => {
          this.keywordGroups = r1.data.concat(r2.data)
          this.keywordGroupsCache = JSON.stringify(this.keywordGroups)
          let keywordDict = {}
          for (let i = 0; i < this.keywordGroups.length; i++) {
            const keywords = this.keywordGroups[i]['keywords']
            for (let j = 0; j < keywords.length; j++) {
              const keywordItem = keywords[j]
              const keywordUid = getKeywordUid(keywordItem.id, keywordItem.keyword_type)
              keywordDict[keywordUid] = keywordItem
            }
          }
          this.$store.commit('keyword/SET_KEYWORD_OBJECTS', keywordDict)
        })
      )
    },
    getGroupUserKeywords () {
      const projectId = this.$store.state.tree.projectId
      getUserKeyword(projectId).then(response => {
        const updateGroupList = response.data
        const updateGroupMap = {}
        // update keywordObject
        const keywordDict = this.$store.state.keyword.keywordObjects
        for (let i = 0; i < updateGroupList.length; i++) {
          updateGroupMap[updateGroupList[i].id] = updateGroupList[i]
          const groupKeywordList = updateGroupList[i]['keywords']
          for (let j = 0; j < groupKeywordList.length; j++) {
            const keywordItem = groupKeywordList[j]
            const keywordUid = getKeywordUid(keywordItem.id, keywordItem.keyword_type)
            keywordDict[keywordUid] = keywordItem
          }
        }
        // update keywordGroups
        for (let i = 0; i < this.keywordGroups.length; i++) {
          const groupId = this.keywordGroups[i].id
          if (groupId in updateGroupMap) {
            this.keywordGroups.splice(i, 1, updateGroupMap[groupId])
          }
        }
        this.$store.commit('keyword/SET_KEYWORD_OBJECTS', keywordDict)
        this.keywordGroupsCache = JSON.stringify(this.keywordGroups)
      })
    },
    cloneKeyword(original) {
      // keyword item change to entity
      return {
        'keyword_id': original['id'],
        'keyword_type': original['keyword_type'],
        'input_args': '',
        'output_args': '',
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
    dragStart(event) {
      console.log(event)
      let img = new Image()
      img.src = 'https://www.google.no/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
      event.item = img
      // event.originalEvent.dataTransfer.setDragImage(img, 0, 0)
    },
    filterKeyword () {
      const expandGroups = []
      const keywordArr = JSON.parse(this.keywordGroupsCache)
      if (this.searchInput.trim() === '') {
        this.keywordGroups = keywordArr
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
      this.keywordGroups = keywordArr
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
.custom-chosen {
}
.custom-ghost {
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
    text-align: center;
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
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
.custom-fallback {
  width: calc(#{$entityGridWidth} - 4px);
  height: calc(#{$entityGridHeight} - 4px);
  display: inline-block;
  background-color: #D3D3D3;
  cursor: move;
  overflow: hidden;
  position: relative;
  .item-content {
    width: 100%;
    text-align: center;
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .item-image {
      position: absolute;
      text-align: center;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
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
}
:deep(.el-collapse) {
  .el-collapse-item__header {
    font-size: 13px;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
    color: #606266;
  }
}
</style>
