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
import { dragHController } from "@/utils/resize";
import NODE from "@/constans/node";
import SvgIcon from "@/components/SvgIcon";
import CaseEntity from "@/views/design/editor/tree-detail/case/components/CaseEntity";
import EntityArgs from "@/views/design/editor/tree-detail/case/components/EntityArgs";
import CaseConfig from "@/views/design/editor/tree-detail/case/components/CaseConfig";
import KeywordConfig from "@/views/design/editor/tree-detail/case/components/KeywordConfig";
import { updateCase } from "@/api/case";
import { createTag, deleteTag } from "@/api/tag";

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
        if (this.isKeyword) {
          this.keywordExtraInfo.document = nodeInfo['meta']['document']
          this.keywordExtraInfo.inputs = nodeInfo['meta']['inputs']
          this.keywordExtraInfo.outputs = nodeInfo['meta']['outputs']
        }
        if (this.isTestcase) {
          this.caseExtraInfo.document = nodeInfo['meta']['document']
          this.caseExtraInfo.priority_id = nodeInfo['meta']['priority_id']
          this.caseExtraInfo.tag = nodeInfo['meta']['extra_data'][NODE.ExtraDataKey.TAG]
          this.caseExtraInfo.order = nodeInfo['meta']['order']
          this.caseExtraInfo.timeout = nodeInfo['meta']['timeout']
        }
        this.$store.dispatch('entity/getEntities', nodeInfo['meta']['id'])
      },
      immediate: true
    },
  },
  mounted() {
    dragHController('infos', 'args', 'resize-y')
  },
  unmounted() {
    this.$store.commit('entity/RELOAD_STATE')
  },
  methods: {
    updateTreeNode(metaData) {
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
          // not allowed update node meta id
          if (key === 'id') {
            continue
          }
          // update node meta
          if (key in  metaInfo) {
            metaInfo[key] = newInfo[key]
          }
        }
        this.updateTreeNode(metaInfo)
      })
    },
    updateCaseTag(params) {
      if (params.operate === 'add') {
        this.addCaseTag(params.tagName)
      } else if (params.operate === 'del') {
        this.deleteCaseTag(params.tagName)
      }
    },
    addCaseTag(newName) {
      const nodeInfo = this.$store.state.tree.selectedNode
      const metaInfo = nodeInfo['meta']
      const params = {
        'project_id': this.$store.state.tree.projectId,
        'name': newName,
        'module_id': metaInfo.id,
        'module_type': NODE.ModuleType.CASE
      }
      createTag(params).then((response) => {
        const newTag = response.data
        metaInfo['extra_data'][NODE.ExtraDataKey.TAG].push(newTag)
        this.updateTreeNode(metaInfo)
        const projectId = this.$store.state.tree.projectId
        this.$store.dispatch('scalar/getProjectTags', projectId)
      })
    },
    deleteCaseTag(tagName) {
      const nodeInfo = this.$store.state.tree.selectedNode
      const metaInfo = nodeInfo['meta']
      const caseTagList = metaInfo['extra_data'][NODE.ExtraDataKey.TAG]
      let tagIndex = null
      let tagId = null
      for (let i = 0; i < caseTagList.length; i++) {
        if (caseTagList[i]['name'] === tagName) {
          tagId = caseTagList[i]['id']
          tagIndex = i
          break
        }
      }
      if (tagIndex === null) {
        return
      }
      deleteTag(tagId).then(() => {
        caseTagList.splice(tagIndex, 1)
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
