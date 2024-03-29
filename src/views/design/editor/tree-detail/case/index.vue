<template>
  <div class="case-detail">
    <div class="information" id="infos">
      <case-config
        v-if="isTestcase"
        :case-extra="caseExtraInfo"
        @update="updateCaseInfo"
        @updateTag="updateCaseTag"
      />
      <keyword-config
        v-else-if="isKeyword"
        :keyword-extra="keywordExtraInfo"
        @update="updateCaseInfo"
      />
      <case-entity />
    </div>
    <div class="resize-h" id="resize-y">
      <svg-icon icon-class="more-indicator" class="ellipsis-icon"></svg-icon>
    </div>
    <div class='arguments' id="args">
      <entity-args />
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import SvgIcon from "@/components/SvgIcon";
import CaseEntity from "@/views/design/editor/tree-detail/case/components/CaseEntity";
import EntityArgs from "@/views/design/editor/tree-detail/case/components/EntityArgs";
import CaseConfig from "@/views/design/editor/tree-detail/case/components/CaseConfig";
import KeywordConfig from "@/views/design/editor/tree-detail/case/components/KeywordConfig";
import { addDragHController } from "@/utils/resize";
import { updateCase } from "@/api/case";
import { createModuleTag, createTagModuleTag, deleteModuleTag } from "@/api/tag";
import { guid } from "@/utils/other";

export default {
  name: 'Case',
  components: {
    SvgIcon,
    CaseEntity,
    EntityArgs,
    CaseConfig,
    KeywordConfig,
  },
  computed: {
    isTestcase() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.TESTCASE
    },
    isKeyword() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.KEYWORD
    }
  },
  data() {
    return {
      keywordExtraInfo: {
        document: '',
        inputs: '',
        outputs: '',
      },
      caseExtraInfo: {
        document: '',
        priority_id: '',
        tag: [],
        order: '',
        timeout: '',
      }
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const detailType = this.$store.state.tree.detailType
        if (detailType !== NODE.DetailType.CASE) {
          return
        }
        const nodeInfo = this.$store.state.tree.selectedNode
        if (JSON.stringify(nodeInfo) === '{}') {
          return
        }
        this.setExtraInfo(nodeInfo['meta'])
        this.$store.dispatch('entity/getEntities', nodeInfo['meta']['id'])
      },
      immediate: true
    },
  },
  mounted() {
    addDragHController('infos', 'args', 'resize-y')
  },
  unmounted() {
    this.$store.commit('entity/RELOAD_STATE')
  },
  methods: {
    setExtraInfo(metaInfo) {
      if (this.isKeyword) {
        this.keywordExtraInfo = {
          document: metaInfo['document'],
          inputs: metaInfo['inputs'],
          outputs: metaInfo['outputs'],
        }
      }
      if (this.isTestcase) {
        this.caseExtraInfo = {
          document: metaInfo['document'],
          priority_id: metaInfo['priority_id'],
          tag: metaInfo['extra_data'][NODE.ExtraDataKey.TAG],
          order: metaInfo['order'],
          timeout: metaInfo['timeout'],
        }
      }
    },
    updateTreeNode(metaData) {
      this.setExtraInfo(metaData)
      // update node meta data, for run debug not need to query db
      const treeId = this.$store.state.tree.treeId
      const treeObj = $.fn.zTree.getZTreeObj(treeId)
      const caseNode = this.$store.state.tree.selectedNode
      caseNode['meta'] = metaData
      treeObj.updateNode(caseNode)
      this.$store.commit('tree/SET_SELECT_NODE', caseNode)
    },
    updateCaseInfo(params) {
      const nodeInfo = this.$store.state.tree.selectedNode
      const metaInfo = nodeInfo['meta']
      // value not change will not send request
      for (let field in params) {
        if (params[field] === metaInfo[field]) {
          delete params[field]
        }
      }
      if (Object.keys(params).length === 0) {
        return
      }
      updateCase(metaInfo.id, params).then((response) => {
        const newInfo = response.data
        for (const key in newInfo) {
          // ignore node meta id
          if (key === 'id') {
            continue
          }
          // update node meta
          if (key in  metaInfo) {
            metaInfo[key] = newInfo[key]
          }
        }
        this.updateTreeNode(metaInfo)
        // update platform keyword
        if (nodeInfo.type === NODE.NodeCategory.KEYWORD) {
          this.$store.commit('keyword/SET_UPDATE_USER_KEYWORD', guid())
        }
      })
    },
    updateCaseTag(params) {
      if (params.operate === 'new') {
        this.newCaseTagModuleTag(params.tag)
      } else if (params.operate === 'add') {
        this.addCaseTag(params.tag)
      } else if (params.operate === 'del') {
        this.deleteCaseTag(params.tag)
      }
    },
    addCaseTag(tagId) {
      const nodeInfo = this.$store.state.tree.selectedNode
      const metaInfo = nodeInfo['meta']
      const params = {
        'tag_id': tagId,
        'module_id': metaInfo.id,
        'module_type': NODE.ModuleType.CASE
      }
      createModuleTag(params).then(response => {
        const newTag = response.data
        metaInfo['extra_data'][NODE.ExtraDataKey.TAG].push(newTag)
        this.updateTreeNode(metaInfo)
      })
    },
    newCaseTagModuleTag(newTagName) {
      const nodeInfo = this.$store.state.tree.selectedNode
      const metaInfo = nodeInfo['meta']
      const params = {
        'project_id': this.$store.state.tree.projectId,
        'tag_name': newTagName,
        'module_id': metaInfo.id,
        'module_type': NODE.ModuleType.CASE
      }
      createTagModuleTag(params).then((response) => {
        const newData = response.data
        this.updateTagListAndMap(newData['tag'])
        delete newData['tag']
        metaInfo['extra_data'][NODE.ExtraDataKey.TAG].push(newData)
        this.updateTreeNode(metaInfo)
        this.$store.dispatch('config/getProjectTags', this.$store.state.tree.projectId)
      })
    },
    updateTagListAndMap(tagInfo) {
      const tagList = this.$store.state.config.projectTags
      const tagMap = this.$store.state.config.projectTagMap
      tagList.push(tagInfo)
      this.$store.commit('config/SET_PROJECT_TAGS', tagList)
      tagMap[tagInfo['id']] = tagInfo['name']
      this.$store.commit('config/SET_TAG_MAP', tagMap)
    },
    deleteCaseTag(tagId) {
      const nodeInfo = this.$store.state.tree.selectedNode
      const metaInfo = nodeInfo['meta']
      const caseTagList = metaInfo['extra_data'][NODE.ExtraDataKey.TAG]
      let mTagIndex = null
      let mTagId = null
      for (let i = 0; i < caseTagList.length; i++) {
        if (caseTagList[i]['tag_id'] === tagId) {
          mTagId = caseTagList[i]['id']
          mTagIndex = i
          break
        }
      }
      if (mTagIndex === null) {
        return
      }
      deleteModuleTag(mTagId).then(() => {
        caseTagList.splice(mTagIndex, 1)
        this.caseExtraInfo.tag = caseTagList
        this.updateTreeNode(metaInfo)
      })
      // fetchTagByCase(metaInfo.id).then(response => {
      //   this.caseExtraInfo.tag = response.data
      //   metaInfo['extra_data'][NODE.ExtraDataKey.TAG] = response.data
      //   this.updateTreeNode(metaInfo)
      // })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";
$resizeHeight: 5px;

.case-detail {
  width: 100%;
  height: 100%;
  position: relative;
  .information {
    width: 100%;
    height: 60%;
    position: relative;
    overflow-y: auto;
  }
  .arguments {
    width: 100%;
    height: calc(40% - #{$resizeHeight});
    position: relative;
    overflow-y: auto;
  }
  .resize-h {
    cursor: row-resize;
    position: relative;
    background-color: $resizeBg;
    width: 100%;
    height: $resizeHeight;
    background-size: cover;
    background-position: center;
    font-size: 0.32rem;
    color: white;
    .ellipsis-icon {
      width: 30px;
      height: 18px;
      position: relative;
      left: 48%;
      transform: translateY(-38%);
      transition: opacity 0.3s ease 0s, transform 0.3s ease 0s;
    }
  }
}
</style>
