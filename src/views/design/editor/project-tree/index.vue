<template>
  <div class="project-tree">
    <div v-if="!hideTree" class="project-show">
      <div class="head">
        <el-select
          class="project-selector"
          v-model="projectId"
          placement="bottom-start"
          placeholder="选择项目">
          <el-option
            v-for="(item, index) in projectList"
            :key="index"
            :label="item.name"
            :value="item.id"
            @click.native="changeProject(item.id, item.name)"
          />
        </el-select>
        <el-tooltip
          class="tooltip-icon"
          effect="dark"
          content="收起"
          placement="bottom"
        >
          <el-icon class="fold-expand-icon" @click="hideOrShowTreeArea(true)"><Fold /></el-icon>
        </el-tooltip>
      </div>
      <div class="tree">
        <tree
          ref="zTree"
          :setting="zTreeSetting"
          :nodes="zTreeNodes"
          @onCreated="zTreeOnCreated">
        </tree>
        <div v-show="showNodeMenu" class="node-menu" v-bind:style="nodeMenuPosition" id="operateMenu">
          <ul>
            <li v-for="(item, index) in menuMethods" @click="executeMethod(item)" :key="index">
              <span>{{ item.title }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="tool">
      <span class="setting-button">
        <el-button type="info" size="small" @click="envSetting"><el-icon><Setting /></el-icon>变量配置</el-button>
      </span>
      <span class="setting-button">
        <el-button type="info" size="small" @click="showNewDialog=true"><el-icon><Plus /></el-icon>新建项目</el-button>
      </span>
      </div>
    </div>
    <div v-else class="project-hide">
      <div class="top-tool">
        <el-tooltip
          effect="dark"
          content="展开"
          placement="right"
        >
          <el-icon class="fold-expand-icon" @click="hideOrShowTreeArea(false)"><Expand /></el-icon>
        </el-tooltip>
      </div>
      <div class="bottom-tool">
        <div class="bottom-flex">
          <el-tooltip
            effect="dark"
            content="变量配置"
            placement="right"
          >
            <el-icon class="tool-icon" @click="envSetting"><Setting /></el-icon>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="新建项目"
            placement="right"
          >
            <el-icon class="tool-icon" @click="showNewDialog=true"><Plus /></el-icon>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="dialog">
      <div class="node-dialog">
        <el-dialog
          width="40%"
          v-model="showNodeDialog"
          :title="nodeDialogTitle"
          :close-on-click-modal="false"
          @close="closeNodeDialog"
        >
          <div class="dialog-content">
            <node-action
              v-if="showDialogType===0"
              :dialog-form="{label: nodeDialogForm.label, name: nodeDialogForm.name}"
              @closeDialogAction="closeNodeDialog"
              @commitDialogAction="commitNodeDialog"
            />
            <upload-file
              v-else-if="showDialogType===1"
              @uploadFileAction="uploadProjectFile"
            />
          </div>
        </el-dialog>
      </div>
      <div class="env-dialog">
        <el-dialog
          width="75%"
          v-model="showEnvDialog"
          title="环境变量配置"
          :close-on-click-modal="false"
        >
          <div class="env-content">
            <env-variable />
          </div>
        </el-dialog>
      </div>
      <div class="new-dialog">
        <el-dialog
          width="550px"
          v-model="showNewDialog"
          title="新建项目"
          :close-on-click-modal="false"
        >
          <div class="new-content">
            <new-project
              @closeDialog="closeNewDialog"
              @successAction="successNewProject"
            />
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import jquery from 'jquery'
import variables from '@/styles/variables.module.scss'
import tree from '@/components/GiantTree'
import NewProject from './components/NewProject'
import EnvVariable from './components/EnvVariable'
import NodeAction from './components/NodeAction'
import UploadFile from './components/UploadFile'
import NODE from '@/constans/node'
import { updateProject } from '@/api/project'
import { fetchBaseDir, createDir, updateDir, deleteDir } from '@/api/dir'
import { fetchDirAndSuiteNode, createSuite, updateSuite, deleteSuite } from '@/api/suite'
import { fetchCaseNode, createCase, updateCase, deleteCase } from '@/api/case'
import { uploadFile, downloadFile } from '@/api/virfile'
import { addSvgHover } from '@/utils/hover'
import { transformData } from '@/utils/tree'

export default {
  name: 'ProjectTree',
  components: {
    tree,
    NewProject,
    EnvVariable,
    NodeAction,
    UploadFile
  },
  computed: {
    hideTree() {
      return this.$store.state.tree.hideTree
    },
    projectList() {
      return this.$store.state.base.projectList
    }
  },
  data() {
    return {
      zTreeSetting: {
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: NODE.RootPId
          },
          keep: { parent: true }
        },
        view: {
          showTitle: false,
          showIcon: false,
          addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom,
        },
        callback: {
          onClick: this.zTreeOnClick,
          onCheck: this.zTreeOnCheck,
          onExpand: this.zTreeOnExpand,
          onCollapse: this.zTreeOnCollapse,
        },
      },
      projectId: '',
      zTreeObj: null,
      zTreeNodes: [],
      showEnvDialog: false,
      showNewDialog: false,
      showNodeMenu: false,
      nodeMenuPosition: {
        'top': '0',
        'left': '0',
        'z-index': 999,
      },
      currentMenuNodeId: 0,
      menuMethods: [],
      nodeParams: {},
      showNodeDialog: false,
      showDialogType: 0,
      nodeDialogTitle: '',
      nodeDialogInput: '',
      nodeDialogForm: {},
      svgHoverType: [
        'type_01_',
        'type_02_',
        'type_03_',
        'type_04_',
        'type_05_',
        'type_06_',
      ]
    }
  },

  methods: {
    changeProject(pId, name) {
      fetchBaseDir(pId).then(response => {
        // this.zTreeNodes = formatBaseNodes(response.data)
        this.zTreeNodes = response.data
        this.$store.commit('tree/RESET_STATE')
        this.$store.commit('tree/SET_PROJECT_ID', pId)
        this.$store.commit('tree/SET_PROJECT_NAME', name)
      })
    },
    zTreeOnCreated(zTreeObj) {
      this.zTreeObj = zTreeObj
      this.$store.commit('tree/SET_TREE_ID', zTreeObj.setting.treeId)
    },
    hideOrShowTreeArea(isHide) {
      this.$store.commit('tree/SET_HIDE_TREE', isHide)
      const left = document.getElementById('left')
      const middle = document.getElementById('middle')
      if (isHide) {
        left.style.width = variables.foldWidth
        middle.style.width = `calc(100% - ${variables.foldWidth} - ${variables.leftResizeWidth})`
      } else {
        left.style.width = variables.treeDefaultWidth
        middle.style.width = `calc(100% - ${variables.treeDefaultWidth} - ${variables.leftResizeWidth})`
      }
    },
    zTreeOnCheck() {
      const checkedSimpleNodes = this.zTreeObj.getCheckedNodes(true)
      const selectedNode = this.$store.state.tree.selectedNode
      const caseEntity = this.$store.state.entity.caseEntities
      const transformResult = transformData(checkedSimpleNodes, selectedNode.id, caseEntity)
      if (transformResult.cases.length === 0) {
        this.$store.commit('tree/SET_CHECKED_NODES', [])
        return
      }
      this.$store.commit('tree/SET_CHECKED_NODES', transformResult.nodes)
    },
    // expand node, get children nodes
    zTreeOnExpand(event, treeId, treeNode) {
      let desc = treeNode.desc
      if (desc === NODE.NodeDesc.DIR) {
        fetchDirAndSuiteNode(treeNode.mid).then(response => {
          // const addNodes = formatDirNodes(response.data, treeNode.id, treeNode.checked)
          this.zTreeObj.removeChildNodes(treeNode)
          this.zTreeObj.addNodes(treeNode, response.data)
          if (treeNode.checked) {
            this.zTreeOnCheck()
          }
        })
      } else if (desc === NODE.NodeDesc.SUITE) {
        fetchCaseNode(treeNode.mid).then(response => {
          // const addNodes = formatSuiteNodes(response.data, treeNode.id, treeNode.checked)
          this.zTreeObj.removeChildNodes(treeNode)
          this.zTreeObj.addNodes(treeNode, response.data)
          if (treeNode.checked) {
            this.zTreeOnCheck()
          }
        })
      }
    },
    // collapse node, remove children nodes
    zTreeOnCollapse(event, treeId, treeNode) {
      let desc = treeNode.desc
      if (desc !== NODE.NodeDesc.ROOT) {
        this.zTreeObj.removeChildNodes(treeNode)
      }
    },
    // click node, get node detail data
    zTreeOnClick(event, treeId, treeNode) {
      const selectNodeId = this.$store.state.tree.currentNodeId
      if (treeNode.id === selectNodeId) return
      this.$store.commit('tree/SET_CURRENT_NODE_ID', treeNode.id)
      if (treeNode.type === NODE.NodeCategory.TESTCASE) {
        if (treeNode.desc === NODE.NodeDesc.CASE) {
          this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.CASE)
          this.$store.dispatch('entity/getEntities', treeNode.mid).then(() => {
            this.$store.commit('tree/SET_SELECT_NODE', treeNode)
          })
        } else {
          if (treeNode.desc === NODE.NodeDesc.SUITE) {
            this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.SUITE)
          } else if (treeNode.desc === NODE.NodeDesc.DIR) {
            this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.DIR)
          }
          this.$store.commit('entity/RELOAD_STATE')
          this.$store.commit('tree/SET_SELECT_NODE', treeNode)
        }
      } else if (treeNode.type === NODE.NodeCategory.KEYWORD) {
        if (treeNode.desc === NODE.NodeDesc.CASE) {
          this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.CASE)
          this.$store.dispatch('entity/getEntities', treeNode.mid).then(() => {
            this.$store.commit('tree/SET_SELECT_NODE', treeNode)
          })
        } else {
          if (treeNode.desc === NODE.NodeDesc.SUITE) {
            this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.EMPTY)
          } else if (treeNode.desc === NODE.NodeDesc.DIR) {
            this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.EMPTY)
          }
          this.$store.commit('entity/RELOAD_STATE')
          this.$store.commit('tree/SET_SELECT_NODE', treeNode)
        }
      } else if (treeNode.type === NODE.NodeCategory.RESOURCE) {
        if (treeNode.desc === NODE.NodeDesc.SUITE) {
          this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.CONST)
          this.$store.dispatch('file/getFileContent', treeNode.mid).then(() => {
            this.$store.commit('tree/SET_SELECT_NODE', treeNode)
          })
        } else if (treeNode.desc === NODE.NodeDesc.DIR) {
          this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.EMPTY)
        }
        this.$store.commit('entity/RELOAD_STATE')
        this.$store.commit('tree/SET_SELECT_NODE', treeNode)
      } else if (treeNode.type === NODE.NodeCategory.PROJECTFILE) {
        if (treeNode.desc === NODE.NodeDesc.SUITE) {
          this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.FILE)
          this.$store.dispatch('file/getFileContent', treeNode.mid).then(() => {
            this.$store.commit('tree/SET_SELECT_NODE', treeNode)
          })
        } else if (treeNode.desc === NODE.NodeDesc.DIR) {
          this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.EMPTY)
        }
        this.$store.commit('entity/RELOAD_STATE')
        this.$store.commit('tree/SET_SELECT_NODE', treeNode)
      }
    },
    saveEnvVariables() {},
    showTreeMenu(type, x, y) {
      y = y - 20
      this.nodeMenuPosition.top = y + 'px'
      this.nodeMenuPosition.left = x + 'px'
      this.showNodeMenu = true
      document.addEventListener('click', this.onDocMouseDown)
    },
    hideTreeMenu() {
      this.showNodeMenu = false
      document.removeEventListener('click', this.onDocMouseDown)
    },
    onDocMouseDown(event) {
      if (event.target.id !== this.currentMenuNodeId) {
        this.hideTreeMenu()
      }
    },
    executeMethod(item) {
      let methodName = 'nullAction'
      if (item.type === NODE.ActionType.UPDATE) {
        methodName = 'renameNode'
      } else if (item.type === NODE.ActionType.COPY) {
        methodName = 'copyNode'
      } else if (item.type === NODE.ActionType.PASTE) {
        methodName = 'pasteNode'
      } else if (item.type === NODE.ActionType.DELETE) {
        methodName = 'deleteNode'
      } else if (item.type === NODE.ActionType.DOWNLOAD) {
        methodName = 'downloadFile'
      }
      this[`${methodName}`](item.id, item.action)
    },
    showMenuCallback(id) {
      const iconBtn = document.getElementById(id)
      const rect = iconBtn.getBoundingClientRect()
      this.currentMenuNodeId = id
      this.showTreeMenu('root', rect.left, rect.top)
    },
    initNodeDialog(nodeInfo, dialogInfo) {
      let nameText  = ''
      if ('name' in dialogInfo) {
        nameText = dialogInfo.name
      }
      if (nodeInfo.action_type === NODE.ActionType.UPLOAD) {
        this.showDialogType = 1
      }
      this.nodeParams = nodeInfo
      this.nodeDialogTitle = dialogInfo.title
      this.nodeDialogForm = {label: dialogInfo.label, name: nameText}
      this.showNodeDialog = true
    },
    closeNodeDialog() {
      this.showNodeDialog = false
      this.showDialogType = 0
      this.nodeParams = {}
      this.nodeDialogTitle = ''
      this.nodeDialogForm = {}
    },
    // rename project, create or update dir/suite/case
    commitNodeDialog(newNodeName) {
      const that = this
      const node = this.nodeParams.meta_data
      if (this.nodeParams.desc === NODE.NodeDesc.ROOT) {
        if (this.nodeParams.action_type === NODE.ActionType.UPDATE) {
          // rename project
          const params = {'name': newNodeName}
          updateProject(node.mid, params).then(response => {
            node.name = response.data.name
            that.zTreeObj.updateNode(node)
            that.closeNodeDialog()
          })
        }
      }
      if (this.nodeParams.desc === NODE.NodeDesc.DIR) {
        if (this.nodeParams.action_type === NODE.ActionType.CREATE) {
          // create dir
          const params = {'name': newNodeName, 'parent_dir_id': node.mid, 'project_id': this.projectId, 'category': node.type}
          createDir(params).then(response => {
            if (node.open) {
              // const dirNode = handlerNode(response.data, node.id, NODE.NodeDesc.DIR)
              that.zTreeObj.addNodes(node, -1, response.data)
            } else {
              that.zTreeOnExpand('expand', node.treeId, node)
            }
            that.closeNodeDialog()
          })
        } else if (this.nodeParams.action_type === NODE.ActionType.UPDATE) {
          // update dir
          const params = {'name': newNodeName}
          updateDir(node.mid, params).then(response => {
            node.name = response.data.name
            that.zTreeObj.updateNode(node)
            that.closeNodeDialog()
          })
        }
      } else if (this.nodeParams.desc === NODE.NodeDesc.SUITE) {
        // create suite
        if (this.nodeParams.action_type === NODE.ActionType.CREATE) {
          const params = {'name': newNodeName, 'suite_dir_id': node.mid, 'category': node.type}
          createSuite(params).then(response => {
            if (node.open) {
              // const suiteNode = handlerNode(response.data, node.id, NODE.NodeDesc.SUITE)
              that.zTreeObj.addNodes(node, -1, response.data)
            } else {
              that.zTreeOnExpand('expand', node.treeId, node)
            }
            that.closeNodeDialog()
          })
        } else if (this.nodeParams.action_type === NODE.ActionType.UPDATE) {
          // update suite
          const params = {'name': newNodeName}
          updateSuite(node.mid, params).then(response => {
            node.name = response.data.name
            that.zTreeObj.updateNode(node)
            that.closeNodeDialog()
          })
        }
      } else if (this.nodeParams.desc === NODE.NodeDesc.CASE) {
        if (this.nodeParams.action_type === NODE.ActionType.CREATE) {
          // create case
          const params = {'name': newNodeName, 'test_suite_id': node.mid, 'category': node.type}
          createCase(params).then(response => {
            if (node.open) {
              // const caseNode = handlerNode(response.data, node.id, NODE.NodeDesc.CASE)
              that.zTreeObj.addNodes(node, -1, response.data)
            } else {
              that.zTreeOnExpand('expand', node.treeId, node)
            }
            that.closeNodeDialog()
          })
        } else if (this.nodeParams.action_type === NODE.ActionType.UPDATE) {
          // update case
          const params = {'name': newNodeName}
          updateCase(node.mid, params).then(response => {
            node.name = response.data.name
            that.zTreeObj.updateNode(node)
            that.closeNodeDialog()
          })
        }
      }
    },
    uploadProjectFile(files) {
      console.log(files)
      let formData = new FormData()
      let node = this.nodeParams.meta_data
      const dirId = node.mid
      let nodeList = []
      nodeList.push(node.name)
      node = node.getParentNode()
      while (node !== null) {
        nodeList.push(node.name)
        node = node.getParentNode()
      }
      let fullPath = ''
      for (let i = nodeList.length; i >= 0; i--) {
        fullPath = fullPath + '/' + nodeList[i]
      }
      formData.append('file', files)
      formData.append('dir_id', dirId)
      formData.append('path', fullPath)
      console.log('form data')
      console.log(formData)
      uploadFile(formData).then(() => {
        this.$message.success('上传成功')
      })
    },
    nullAction() {},
    copyNode(nodeTId, actionInfo) {
      const node = this.zTreeObj.getNodeByTId(nodeTId)
      if (JSON.stringify(actionInfo) === '{}') return
      console.log(node)
    },
    pasteNode(nodeTId, actionInfo) {
      console.log(nodeTId + actionInfo)
    },
    renameNode(nodeTId, actionInfo) {
      const node = this.zTreeObj.getNodeByTId(nodeTId)
      const params = {
        'action_type': NODE.ActionType.UPDATE, 'desc': node.desc,
        'meta_data': node
      }
      actionInfo.name = node.name
      this.initNodeDialog(params, actionInfo)
    },
    deleteNode(nodeTId, actionInfo) {
      const that = this
      const node = that.zTreeObj.getNodeByTId(nodeTId)
      let warnInfo = `将删除【${node.name}】${actionInfo.text}，是否继续？`
      this.$messageBox.confirm(
        warnInfo,
        actionInfo.title,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        if (node.desc === NODE.NodeDesc.DIR) {
          deleteDir(node.mid)
          that.zTreeObj.removeNode(node)
        } else if (node.desc === NODE.NodeDesc.SUITE) {
          deleteSuite(node.mid)
          that.zTreeObj.removeNode(node)
        } else if (node.desc === NODE.NodeDesc.CASE) {
          deleteCase(node.mid)
          that.zTreeObj.removeNode(node)
        }
      }).catch(() => {})
    },
    downloadFile(nodeTId, actionInfo) {
      console.log(actionInfo)
      const node = this.zTreeObj.getNodeByTId(nodeTId)
      downloadFile(node.id).then(() => {})
    },
    addHoverDom(treeId, treeNode) {
      const that = this
      const hoverDomList = treeNode.action
      for (let i = 0; i < hoverDomList.length; i++) {
        const idPrefix = that.svgHoverType[i]
        addSvgHover(idPrefix, treeNode.tId, hoverDomList[i].icon, '',function () {
          const params = {
            'action_type': hoverDomList[i].type,
            'desc': hoverDomList[i].desc,
            'meta_data': treeNode
          }
          that.initNodeDialog(params, hoverDomList[i])
        })
      }
      const menuList = treeNode.menu
      if (menuList.length !== 0) {
        const idPrefix = this.svgHoverType[this.svgHoverType.length-1]
        addSvgHover(idPrefix, treeNode.tId, 'iconfont icon-a-morevertical-line', '',function () {
          that.showMenuCallback(idPrefix+treeNode.tId)
        })
        for (let i = 0; i < menuList.length; i++) {
          menuList[i]['id'] = treeNode.tId
        }
        that.menuMethods = menuList
      }
    },
    removeHoverDom(treeId, treeNode) {
      jquery("#type_01_" + treeNode.tId).unbind().remove()
      jquery("#type_02_" + treeNode.tId).unbind().remove()
      jquery("#type_03_" + treeNode.tId).unbind().remove()
      jquery("#type_04_" + treeNode.tId).unbind().remove()
      jquery("#type_05_" + treeNode.tId).unbind().remove()
      jquery("#type_06_" + treeNode.tId).unbind().remove()
    },
    envSetting () {
      if (this.projectId === '') {
        this.$message.warning('请选择项目')
        return
      }
      this.showEnvDialog = true
    },
    closeNewDialog () {
      this.showNewDialog = false
    },
    successNewProject(projectInfo) {
      this.projectId = projectInfo['id']
      this.changeProject(projectInfo['id'], projectInfo['name'])
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";
//@import "src/styles/element/dialog.scss";
$selectorHeight: 45px;
$toolHeight: 40px;

.project-tree {
  height: 100%;
  .project-show {
    height: 100%;
    .head {
      height: $selectorHeight;
      width: 100%;
      padding-left: 5px;
      .project-selector {
        float: left;
        width: calc(100% - #{$foldWidth});
      }
      .tooltip-icon {
        float: left;
        width: $foldWidth;
      }
    }
    .tree {
      height: calc(100% - #{$toolHeight} - #{$selectorHeight});
      overflow: auto;
      padding: 0 5px;
      .node-menu {
        position: absolute;
        background: #ffffff;
        z-index: 10;
        box-shadow: 0 0 12px rgba(0, 0, 0, .18);
        border-radius: 2px;
        ul {
          position: relative;
          padding: 5px 0;
          margin: 0;
          border: none;
          box-shadow: none;
          list-style: none;
          li {
            display: flex;
            align-items: center;
            white-space: nowrap;
            list-style: none;
            line-height: 20px;
            padding: 3px 16px;
            margin: 0;
            font-size: 14px;
            cursor: pointer;
            outline: none;
            &:hover {
              color: $mainColor;
              background-color: #dfe1e5;
            }
          }
        }
      }
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
    }
  }
  .project-hide {
    .top-tool {
    }
    .bottom-tool {
      position: fixed;
      bottom: 0;
      .bottom-flex {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: center;
        padding-left: 4px;
        .tool-icon {
          margin-bottom: 15px;
          font-size: 25px;
          color: $foldIconColor;
          cursor: pointer;
        }
      }
    }
  }
  .dialog {
    .node-dialog {
    }
    .env-dialog {
    }
    .new-dialog {
    }
  }
  .fold-expand-icon {
    font-size: $foldWidth;
    color: $foldIconColor;
    cursor: pointer;
  }
}
</style>
