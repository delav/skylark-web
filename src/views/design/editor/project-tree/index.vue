<template>
  <div class="project-tree">
    <div v-if="!hideTree" class="project-show">
      <div class="head">
        <el-select
          class="project-selector"
          v-model="projectId"
          placement="bottom-start"
          placeholder="选择项目"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="(item, index) in projectList"
            :key="index"
            :label="item.name"
            :value="item.id"
            @click.native="changeProject(item.id, item.name)"
          />
        </el-select>
        <el-tooltip
          popper-class="custom-tooltip"
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
        <div v-show="showNodeMenu" class="node-menu">
          <div class="menu-content" v-bind:style="nodeMenuPosition" id="operateMenu">
            <ul>
              <li v-for="(item, index) in menuMethods" @click="executeMethod(item)" :key="index">
                <span>{{ item.title }}</span>
              </li>
            </ul>
          </div>
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
          popper-class="custom-tooltip"
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
            popper-class="custom-tooltip"
            effect="dark"
            content="变量配置"
            placement="right"
          >
            <el-icon class="tool-icon" @click="envSetting"><Setting /></el-icon>
          </el-tooltip>
          <el-tooltip
            popper-class="custom-tooltip"
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
          destroy-on-close
        >
          <div class="dialog-content">
            <node-action
              v-if="showDialogType===0"
              :dialog-form="nodeDialogForm"
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
          destroy-on-close
        >
          <div class="env-content">
            <variable-conf />
          </div>
        </el-dialog>
      </div>
      <div class="new-dialog">
        <el-dialog
          width="550px"
          v-model="showNewDialog"
          title="新建项目"
          :close-on-click-modal="false"
          destroy-on-close
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
import jquery from "jquery";
import variables from "@/styles/variables.module.scss";
import tree from "@/components/GiantTree";
import NewProject from "@/views/design/editor/project-tree/components/NewProject";
import VariableConf from "@/views/design/editor/project-tree/components/VariableConf";
import NodeAction from "@/views/design/editor/project-tree/components/NodeAction";
import UploadFile from "@/views/design/editor/project-tree/components/UploadFile";
import NODE from "@/constans/node";
import { ElLoading } from "element-plus";
import { updateProject } from "@/api/project";
import { fetchBaseDir, createDir, updateDir, deleteDir } from "@/api/dir";
import { fetchDirAndSuiteNode, createSuite, updateSuite, deleteSuite, duplicateSuite } from "@/api/suite";
import { fetchCaseNode, createCase, updateCase, deleteCase, duplicateCase } from "@/api/case";
import { uploadFile, downloadFile, batchDeleteFile } from "@/api/file";
import { addSvgHover } from "@/utils/hover";
import { transformData } from "@/utils/tree";

export default {
  name: 'ProjectTree',
  components: {
    tree,
    NewProject,
    VariableConf,
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
  created() {
    this.$store.dispatch('scalar/getPriorities')
  },
  methods: {
    changeProject(pId, name) {
      fetchBaseDir(pId).then(response => {
        // this.zTreeNodes = formatBaseNodes(response.data)
        this.zTreeNodes = response.data
        this.$store.commit('entity/RELOAD_STATE')
        this.$store.commit('tree/RELOAD_STATE')
        this.$store.commit('tree/SET_PROJECT_ID', pId)
        this.$store.commit('tree/SET_PROJECT_NAME', name)
      })
      this.$store.dispatch('scalar/getProjectTags', pId)
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
      if (treeNode.desc === NODE.NodeDesc.DIR) {
        fetchDirAndSuiteNode(treeNode.mid).then(response => {
          // const addNodes = formatDirNodes(response.data, treeNode.id, treeNode.checked)
          this.zTreeObj.removeChildNodes(treeNode)
          this.zTreeObj.addNodes(treeNode, response.data)
          if (treeNode.checked) {
            const childNodes = treeNode.children
            for (let i = 0; i < childNodes.length; i ++) {
              this.zTreeObj.checkNode(childNodes[i], true, true, true)
            }
          }
        })
      } else if (treeNode.desc === NODE.NodeDesc.SUITE) {
        fetchCaseNode(treeNode.mid).then(response => {
          // const addNodes = formatSuiteNodes(response.data, treeNode.id, treeNode.checked)
          this.zTreeObj.removeChildNodes(treeNode)
          this.zTreeObj.addNodes(treeNode, response.data)
          if (treeNode.checked) {
            const childNodes = treeNode.children
            for (let i = 0; i < childNodes.length; i ++) {
              this.zTreeObj.checkNode(childNodes[i], true, true, true)
            }
          }
        })
      }
    },
    // collapse node, remove children nodes
    zTreeOnCollapse(event, treeId, treeNode) {
      if (treeNode.desc !== NODE.NodeDesc.ROOT) {
        this.zTreeObj.removeChildNodes(treeNode)
        if (!treeNode.nocheck) {
          this.zTreeOnCheck()
        }
      }
      //TODO
      // RESET tree detail
    },
    changeNodeStore(treeNode, detailType) {
      this.$store.commit('tree/SET_SELECT_NODE', treeNode)
      this.$store.commit('tree/SET_DETAIL_TYPE', detailType)
      this.$store.commit('tree/SET_CURRENT_NODE_ID', treeNode.id)
    },
    updateTreeNode(treeNode) {
      this.zTreeObj.updateNode(treeNode)
      this.$store.commit('tree/SET_SELECT_NODE', treeNode)
    },
    // click node, get node detail data
    zTreeOnClick(event, treeId, treeNode) {
      const selectNodeId = this.$store.state.tree.currentNodeId
      if (treeNode.id === selectNodeId) return
      this.$store.commit('tree/SET_NODE_CATEGORY', treeNode.type)
      if (treeNode.type === NODE.NodeCategory.TESTCASE) {
        if (treeNode.desc === NODE.NodeDesc.CASE) {
          this.$store.dispatch('entity/getEntities', treeNode.mid).then(() => {
            this.changeNodeStore(treeNode, NODE.DetailType.CASE)
          })
        } else {
          if (treeNode.desc === NODE.NodeDesc.SUITE) {
            this.changeNodeStore(treeNode, NODE.DetailType.SUITE)
          } else if (treeNode.desc === NODE.NodeDesc.DIR) {
            this.changeNodeStore(treeNode, NODE.DetailType.DIR)
          }
          this.$store.commit('entity/RELOAD_STATE')
        }
      } else if (treeNode.type === NODE.NodeCategory.KEYWORD) {
        if (treeNode.desc === NODE.NodeDesc.CASE) {
          this.$store.dispatch('entity/getEntities', treeNode.mid).then(() => {
            this.changeNodeStore(treeNode, NODE.DetailType.CASE)
          })
        } else {
          if (treeNode.desc === NODE.NodeDesc.SUITE) {
            this.changeNodeStore(treeNode, NODE.DetailType.EMPTY)
          } else if (treeNode.desc === NODE.NodeDesc.DIR) {
            this.changeNodeStore(treeNode, NODE.DetailType.EMPTY)
          }
          this.$store.commit('entity/RELOAD_STATE')
        }
      } else if (treeNode.type === NODE.NodeCategory.RESOURCE) {
        if (treeNode.desc === NODE.NodeDesc.SUITE) {
          this.$store.dispatch('file/getFileContent', treeNode.mid).then(() => {
            this.changeNodeStore(treeNode, NODE.DetailType.CONST)
          })
        } else if (treeNode.desc === NODE.NodeDesc.DIR) {
          this.changeNodeStore(treeNode, NODE.DetailType.EMPTY)
        }
        this.$store.commit('entity/RELOAD_STATE')
      } else if (treeNode.type === NODE.NodeCategory.PROJECTFILE) {
        if (treeNode.desc === NODE.NodeDesc.SUITE) {
          this.$store.dispatch('file/getFileContent', treeNode.mid).then(() => {
            this.changeNodeStore(treeNode, NODE.DetailType.FILE)
          })
        } else if (treeNode.desc === NODE.NodeDesc.DIR) {
          this.changeNodeStore(treeNode, NODE.DetailType.EMPTY)
        }
        this.$store.commit('entity/RELOAD_STATE')
      }
    },
    saveEnvVariables() {},
    showTreeMenu(x, y) {
      x = x + 15
      y = y + 15
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
        methodName = 'downloadProjectFile'
      }
      this[`${methodName}`](item.id, item.action)
    },
    showMenuCallback(id) {
      const iconBtn = document.getElementById(id)
      const rect = iconBtn.getBoundingClientRect()
      this.currentMenuNodeId = id
      this.showTreeMenu(rect.left, rect.top)
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
            that.updateTreeNode(node)
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
            that.updateTreeNode(node)
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
            that.updateTreeNode(node)
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
            that.updateTreeNode(node)
            that.closeNodeDialog()
          })
        }
      }
    },
    uploadProjectFile(files) {
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
      nodeList.push(this.$store.state.tree.projectName)
      let fullPath = ''
      for (let i = nodeList.length-1; i >= 0; i--) {
        fullPath = fullPath + '/' + nodeList[i]
      }
      formData.append('dir_id', dirId)
      formData.append('path', fullPath)
      files.forEach(file => {
        formData.append('file', file)
      })
      uploadFile(formData).then((response) => {
        const newNodes = response.data
        this.zTreeObj.addNodes(node, -1, newNodes)
        this.$message.success(`上传${newNodes.length}个文件成功`)
      })
    },
    downloadProjectFile(nodeTId) {
      const node = this.zTreeObj.getNodeByTId(nodeTId)
      let formData = new FormData()
      formData.append('suite', node.mid)
      downloadFile(formData).then((response) => {
        let blob = new Blob([response.data])
        let fileName = response.headers['content-disposition'].split(';')[1].split('=')[1]
        const link = document.createElement('a')
        link.style.display = 'none'
        const url = window.URL || window.webkitURL
        link.href = url.createObjectURL(blob)
        link.setAttribute('download', decodeURI(fileName))
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        url.revokeObjectURL(link.href)
      })
    },
    nullAction() {},
    copyNode(nodeTId, actionInfo) {
      console.log(nodeTId)
      console.log(actionInfo)
      const node = this.zTreeObj.getNodeByTId(nodeTId)
      this.$store.commit('tree/SET_COPY_NODE', node)
      this.$message.success('复制节点成功')
      this.hideTreeMenu()
    },
    pasteNode(nodeTId, actionInfo) {
      console.log(nodeTId)
      console.log(actionInfo)
      const copyNode = this.$store.state.tree.copiedNode
      const parentNode = this.zTreeObj.getNodeByTId(nodeTId)
      if (JSON.stringify(copyNode) === '{}') {
        this.$message.warning('请先复制节点')
        return
      }
      if (parentNode.type !== copyNode.type
        || copyNode.type !== NODE.NodeCategory.TESTCASE
      ) {
        this.$message.warning('非法操作1')
        return
      }
      if (parentNode.desc === NODE.NodeDesc.SUITE
        && copyNode.desc !== NODE.NodeDesc.CASE
      ) {
        this.$message.warning('非法操作2')
        return
      }
      if (parentNode.desc === NODE.NodeDesc.DIR
        && copyNode.desc !== NODE.NodeDesc.SUITE
      ) {
        this.$message.warning('非法操作3')
        return
      }
      this.hideTreeMenu()
      const loading = ElLoading.service({
        lock: true,
        text: '复制节点中，请稍后...',
        background: 'rgba(0, 0, 0, 0.8)',
      })
      if (parentNode.desc === NODE.NodeDesc.SUITE) {
        const copyData = {
          'to_project_id': this.$store.state.tree.projectId,
          'to_suite_id': parentNode.mid,
          'raw_case_id': copyNode.mid
        }
        duplicateCase(copyData).then(response => {
          const newNodeData = response.data
          this.zTreeObj.addNodes(parentNode, newNodeData)
          loading.close()
        }).catch(() => {
          loading.close()
        })
      } else if (parentNode.desc === NODE.NodeDesc.DIR) {
        const copyData = {
          'to_project_id': this.$store.state.tree.projectId,
          'to_dir_id': parentNode.mid,
          'raw_suite_id': copyNode.mid
        }
        duplicateSuite(copyData).then(response => {
          const newNodeData = response.data
          this.zTreeObj.addNodes(parentNode, newNodeData)
          loading.close()
        }).catch(() => {
          loading.close()
        })
      }
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
          deleteDir(node.mid).then(() => {
            that.zTreeObj.removeNode(node)
            if (node.checked && node.type === NODE.NodeCategory.TESTCASE) {
              that.zTreeOnCheck()
            }
            if (node.type === NODE.NodeCategory.PROJECTFILE) {
              const fileInfo = {'suite_list': [node.mid]}
              batchDeleteFile(fileInfo)
            }
            that.$store.commit('tree/SET_DETAIL_TYPE', 0)
            that.$store.commit('tree/SET_SELECT_NODE', {})
            that.$store.commit('tree/SET_CURRENT_NODE_ID', '')
          })
        } else if (node.desc === NODE.NodeDesc.SUITE) {
          deleteSuite(node.mid).then(() => {
            that.zTreeObj.removeNode(node)
            if (node.checked && node.type === NODE.NodeCategory.TESTCASE) {
              that.zTreeOnCheck()
            }
            that.$store.commit('tree/SET_DETAIL_TYPE', 0)
            that.$store.commit('tree/SET_SELECT_NODE', {})
            that.$store.commit('tree/SET_CURRENT_NODE_ID', '')
          })
        } else if (node.desc === NODE.NodeDesc.CASE) {
          deleteCase(node.mid).then(() => {
            that.zTreeObj.removeNode(node)
            if (node.checked && node.type === NODE.NodeCategory.TESTCASE) {
              that.zTreeOnCheck()
            }
            that.$store.commit('tree/SET_DETAIL_TYPE', 0)
            that.$store.commit('tree/SET_SELECT_NODE', {})
            that.$store.commit('tree/SET_CURRENT_NODE_ID', '')
            that.$store.commit('entity/RESET_STATE')
          })
        }
      }).catch(() => {})
    },
    addHoverDom(treeId, treeNode) {
      const that = this
      const hoverDomList = treeNode.action
      for (let i = 0; i < hoverDomList.length; i++) {
        const idPrefix = that.svgHoverType[i]
        if (hoverDomList[i].type === NODE.ActionType.DOWNLOAD) {
          addSvgHover(idPrefix, treeNode.tId, hoverDomList[i].icon, '',function () {
            that.downloadProjectFile(treeNode.tId)
          })
          continue
        }
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
$selectorHeight: 40px;
$toolHeight: 40px;

.project-tree {
  height: 100%;
  .project-show {
    height: 100%;
    .head {
      height: $selectorHeight;
      width: 100%;
      padding: 5px 0 0 5px;
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
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        .menu-content {
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
    :hover {
      color: $foldIconHoverColor;
    }
  }
}
</style>
