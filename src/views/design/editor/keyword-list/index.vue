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
          :hide-after="50"
        >
          <span class="fold-expand-icon">
            <svg-icon class="real-icon" icon-class="project-expand" @click="hideOrShowKeywordArea(true)"></svg-icon>
          </span>
        </el-tooltip>
      </div>
      <div class="content" id="et-keyword">
        <el-empty
          style="height: 60%"
          v-show="keywordGroups.length===0"
          :image-size="72"
          description="No Data"
        />
        <el-collapse v-model="groupNames" v-if="keywordGroups.length!==0">
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
              drag-class="custom-drag"
              ghost-class="custom-ghost"
              chosen-class="custom-chosen"
              handle=".item-image"
              item-key="id"
            >
              <template #item="{ element }">
                <keyword-item :keyword-data="element" @dblclick="addEntity(element)" />
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
        :hide-after="50"
      >
        <span class="fold-expand-icon">
          <svg-icon class="real-icon" icon-class="project-fold" @click="hideOrShowKeywordArea(false)"></svg-icon>
        </span>
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
import { deepCopy } from "@/utils/dcopy";

export default {
  name: 'KeywordList',
  components: {
    draggable,
    KeywordItem,
  },
  // debug
  mounted() {
    this.keywordGroups = this.$store.state.keyword.keywordGroupList
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
      axios.all([getLibKeyword(projectId), getUserKeyword(projectId)]).then(
        axios.spread((r1, r2) => {
          this.keywordGroups = r1.data.concat(r2.data)
          this.$store.commit('keyword/SET_KEYWORD_GROUPS', this.keywordGroups)
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
        const keywordDict = this.$store.state.keyword.keywordObjects
        for (let i = 0; i < updateGroupList.length; i++) {
          const groupKeywordList = updateGroupList[i]['keywords']
          // update keywordObject
          for (let j = 0; j < groupKeywordList.length; j++) {
            const keywordItem = groupKeywordList[j]
            const keywordUid = getKeywordUid(keywordItem.id, keywordItem.keyword_type)
            keywordDict[keywordUid] = keywordItem
          }
          // update keywordGroups
          const index = this.keywordGroups.findIndex(item => {
            return item.id === updateGroupList[i].id
          })
          if (index !== -1) {
            this.keywordGroups.splice(index, 1, updateGroupList[i])
          } else {
            this.keywordGroups.push(updateGroupList[i])
          }
        }
        this.$store.commit('keyword/SET_KEYWORD_OBJECTS', keywordDict)
        this.$store.commit('keyword/SET_KEYWORD_GROUPS', this.keywordGroups)
      })
    },
    cloneKeyword(original) {
      // keyword item change to entity
      return {
        'keyword_id': original['id'],
        'keyword_type': original['keyword_type'],
        'input_args': '',
        'output_args': original['output_params'],
        'uuid': guid()
      }
    },
    addEntity(original) {
      const newEntity = {
        'keyword_id': original['id'],
        'keyword_type': original['keyword_type'],
        'input_args': '',
        'output_args': original['output_params'],
        'uuid': guid()
      }
      const caseEntities = deepCopy(this.$store.state.entity.caseEntities)
      caseEntities.push(newEntity)
      this.$store.commit('entity/SET_CASE_ENTITIES', caseEntities)
      this.$store.commit('entity/SET_SYNC_ENTITY_FLAG', guid())
      this.$store.commit('entity/SET_ENTITY_CHANGE', true)
    },
    hideOrShowKeywordArea(isHide) {
      this.$store.commit('keyword/SET_HIDE_KEYWORD', isHide)
      const leftAndMiddle = document.getElementById('left-and-middle')
      const right = document.getElementById('right')
      if (isHide) {
        right.style.width = variables.foldWidth
        leftAndMiddle.style.width = `calc(100% - ${variables.foldWidth} - ${variables.rightResizeWidth})`
      } else {
        right.style.width = variables.keywordWidth
        leftAndMiddle.style.width = `calc(100% - ${variables.keywordWidth} - ${variables.rightResizeWidth})`
        const middle = document.getElementById('middle')
        if (middle.style.width.toString().indexOf('%') !== -1) {
          const middlePercent = parseFloat(middle.style.width) / 100
          middle.style.width = `calc(${leftAndMiddle.style.width} * ${middlePercent})`
        }
      }
    },
    filterKeyword () {
      const expandGroups = []
      if (this.$store.state.keyword.keywordGroupList.length === 0) {
        return
      }
      const keywordArr = this.$store.state.keyword.keywordGroupList
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

.keyword-list {
  height: 100%;
  .keyword-show {
    height: 100%;
    .head {
      height: $searchHeight;
      padding: 5px 0 0 5px;
      .tooltip-icon {
        float: right;
        width: $foldWidth;
      }
      .keyword-search {
        float: left;
        width: calc(100% - #{$foldWidth});
      }
    }
    .content {
      height: calc(100% - #{$searchHeight});
      padding: 0 5px;
      overflow-y: scroll;
    }
  }
  .keyword-hide {
  }
  .fold-expand-icon {
    outline: none;
    color: $foldIconColor;
    cursor: pointer;
    .real-icon {
      font-size: $foldWidth;
    }
    :hover {
      color: $foldIconHoverColor;
    }
  }
}
.custom-chosen {
}
#et-keyword .custom-ghost {
  display: flex;
  position: static;
  height: 50px;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: transparent;
}
#et-case .custom-ghost {
  width: calc(#{$entityGridWidth} - 4px);
  height: calc(#{$entityGridHeight} - 4px);
  margin: 2px;
  text-align: center;
  position: relative;
  overflow: hidden;
  display: inline-block;
  border-bottom: none;
}
.custom-drag {
  width: 50px;
  padding: 0 5px;
  background-color: #ebeef5;
  cursor: move;
  overflow: hidden;
  border-bottom: none;
  position: relative;
  display: inline-block;
}

:deep(.el-collapse) {
  .el-collapse-item__header {
    font-size: 13px;
  }
  .el-collapse-item__content {
    font-size: 13px;
    padding-bottom: 0;
    color: #606266;
  }
}
</style>
