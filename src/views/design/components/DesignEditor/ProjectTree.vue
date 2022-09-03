<template>
  <div class="project-tree">
    <div class="project">
      <el-select
        v-model="projectId"
        @change="getBaseNodes"
        filterable
        placeholder="选择项目">
        <el-option
          v-for="item in projectList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="tree">
      <tree
        ref="zTree"
        :setting="zTreeSetting"
        :nodes="zTreeNodes"
        @onExpand="zTreeOnExpand"
        @onCollapse="zTreeOnCollapse"
        @onClick="zTreeOnClick"
        @onCheck="zTreeOnCheck"
        @onCreated="zTreeOnCreated"
      />
    </div>
    <div class="tool">
      <span class="setting-button">
        <el-button type="goon" size="small"><svg-icon icon-class="setting"></svg-icon>变量配置</el-button>
      </span>
      <span class="setting-button">
        <el-button type="goon" size="small"><svg-icon icon-class="new"></svg-icon>新建项目</el-button>
      </span>
      <span class="arrow-icon"><svg-icon icon-class="arrow-left"></svg-icon></span>
    </div>
  </div>
</template>

<script>
import tree from 'vue-giant-tree-3'
import {fetchProjectList} from '@/api/project'
import { fetchBaseDir } from '@/api/dir'
import { fetchDirAndSuiteNode } from '@/api/suite'
import { fetchCaseNode } from '@/api/case'
import { addSvgHover, formatString } from '@/utils/hover'

export default {
  components: {
    tree
  },
  data() {
    return {
      projectList: [],
      projectId: null,
      zTreeObj: null,
      zTreeNodes: [],
      zTreeSetting: {
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: null
          },
          keep: {
            parent: true
          }
        },
        view: {
          showIcon: false,
          addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom,
        },
      }
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    getProjects() {
      const page = 1
      const size = 20
      fetchProjectList(page, size).then(response => {
        this.projectList = response.data
      })
    },
    getBaseNodes(projectId) {
      if (!projectId) { return }
      fetchBaseDir(projectId).then(response => {
        this.loading = false
        this.zTreeNodes = response.data
      })
    },
    zTreeOnCreated(zTreeObj) {
      this.zTreeObj = zTreeObj
      zTreeObj.expandNode(zTreeObj.getNodes()[0], true)
    },
    zTreeOnCheck() {},
    zTreeBeforeDrag() {
      return false
    },
    // expand node, get children nodes
    zTreeOnExpand(event, treeId, treeNode) {
      let desc = treeNode.desc
      if (desc === 'd') {
        fetchDirAndSuiteNode(treeNode.id).then(response => {
          this.zTreeObj.removeChildNodes(treeNode)
          this.zTreeObj.addNodes(treeNode, response.data)
          if (treeNode.checked) {
            let nodes = treeNode.children
            for (let i = 0; i < nodes.length; i++) {
              this.zTreeObj.checkNode(nodes[i], true, true)
            }
          }
        })
      } else if (desc === 's') {
        fetchCaseNode(treeNode.id).then(response => {
          this.zTreeObj.removeChildNodes(treeNode)
          this.zTreeObj.addNodes(treeNode, response.data)
          if (treeNode.checked) {
            let nodes = treeNode.children
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].desc === 'c') {
                this.zTreeObj.checkNode(nodes[i], true, true)
              }
            }
          }
        })
      }
    },
    // collapse node, remove children nodes
    zTreeOnCollapse(event, treeId, treeNode) {
      let desc = treeNode.desc
      if (desc !== 'p') {
        this.zTreeObj.removeChildNodes(treeNode)
      }
    },
    zTreeOnClick() {},
    addHoverDom(treeId, treeNode) {
      if (treeNode.desc === 'p') {
        const idPrefix = this.hoverSettings.rename
        const iconName = 'button edit'
        const nodeIcon = formatString('<span class="{0}" id="{1}" title="rename"></span>', iconName, idPrefix+treeNode.tId)
        addSvgHover(idPrefix, treeNode.tId, nodeIcon, function () {
          console.log('点击')
        })
      } else if (treeNode.desc === 'd') {
        const idPrefix = this.hoverSettings.rename
        const iconName = 'button edit'
        const nodeIcon = formatString('<span class="{0}" id="{1}" title="rename">', iconName, idPrefix+treeNode.tId)
        addSvgHover(idPrefix, treeNode.tId, nodeIcon, function () {
          console.log('点击')
        })
      }
    },
    removeHoverDom(treeId, treeNode) {
      for (const key in this.hoverSettings) {
        $('#' + this.hoverSettings[key] + treeNode.tId).unbind().remove()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.scss";
$selectorHeight: 40px;
$toolHeight: 40px;

.project-tree {
  height: 100%;
  .project {
    height: $selectorHeight;
  }
  .tree {
    height: calc(100% - #{$toolHeight} - #{$selectorHeight});
    overflow: auto;
  }
  .tool {
    height: $toolHeight;
    line-height: $toolHeight;
    .setting-button {
      padding-left: 5px;
      .svg-icon {
        width: 14px;
        height: 14px;
        margin-right: 5px;
      }
    }
    .arrow-icon {
      float: right;
      padding-right: 10px;
      cursor: pointer;
      &:hover {
        color: #0065ff;
      }
      .svg-icon {
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>
