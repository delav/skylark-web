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
            <li v-for="(item, index) in menuMethods" @click="executeMethod(item.method, item.id)" :key="index">
              <span>{{ item.title }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="tool">
      <span class="setting-button">
        <el-button type="info" size="small" @click="envSetting"><el-icon><Setting /></el-icon>环境配置</el-button>
      </span>
      <span class="setting-button">
        <el-button type="info" size="small" @click="showNewDialog=true"><el-icon><Plus /></el-icon>新建项目</el-button>
      </span>
      </div>
    </div>
    <div v-else class="project-hide">
      <el-tooltip
        effect="dark"
        content="展开"
        placement="bottom"
      >
        <el-icon class="fold-expand-icon" @click="hideOrShowTreeArea(false)"><Expand /></el-icon>
      </el-tooltip>
    </div>
    <div class="dialog">
      <div class="node-dialog">
        <el-dialog
          width="35%"
          v-model="showNodeDialog"
          :title="nodeDialogTitle"
          :close-on-click-modal="false"
          :destroy-on-close="true"
          @close="closeNodeDialog"
        >
          <el-form
            :model="nodeDialogForm"
            label-width="80px"
          >
            <el-form-item
              size="default"
              :label="nodeDialogForm.label"
              prop="name"
              :rules="[{ required: true, message: 'name is required' }]"
            >
              <el-input v-model="nodeDialogForm.name" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="closeNodeDialog">取消</el-button>
            <el-button type="primary" @click="commitNodeDialog">确定</el-button>
          </template>
        </el-dialog>
      </div>
      <div class="env-dialog">
        <el-dialog
          width="75%"
          v-model="showEnvDialog"
          title="环境变量配置"
          :close-on-click-modal="false"
          :destroy-on-close="true"
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
          :destroy-on-close="true"
        >
          <div class="env-content">
            <new-project @closeDialog="closeNewDialog" @successAction="successNewProject" />
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import variables from '@/styles/variables.module.scss'
import tree from 'vue-giant-tree-3'
import NewProject from './components/NewProject'
import EnvVariable from './components/EnvVariable'
import NODE from '@/constans/node'
import { updateProject } from '@/api/project'
import { fetchBaseDir, createDir, updateDir, deleteDir } from '@/api/dir'
import { fetchDirAndSuiteNode, createSuite, updateSuite, deleteSuite } from '@/api/suite'
import { fetchCaseNode, createCase, updateCase, deleteCase } from '@/api/case'
import { addSvgHover } from '@/utils/hover'
import { formatBaseNodes, formatDirNodes, formatSuiteNodes, handlerNode, transformData } from './mixins/handler'

export default {
  name: 'ProjectTree',
  components: {
    tree,
    NewProject,
    EnvVariable,
  },
  computed: {
    hideTree() {
      return this.$store.state.tree.hideTree
    },
    projectList() {
      return this.$store.state.project.projectList
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
      nodeDialogTitle: '',
      nodeDialogInput: '',
      nodeDialogForm: {}
    }
  },

  methods: {
    changeProject(pId, name) {
      fetchBaseDir(pId).then(response => {
        this.zTreeNodes = formatBaseNodes(response.data)
        this.$store.commit('project/SET_PROJECT_ID', pId)
        this.$store.commit('project/SET_PROJECT_NAME', name)
        this.$store.commit('tree/RESET_STATE')
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
      if (!transformResult.flag) {
        this.$store.commit('tree/SET_CHECKED_NODES', [])
        return
      }
      this.$store.commit('tree/SET_CHECKED_NODES', transformResult.data)
    },
    // expand node, get children nodes
    zTreeOnExpand(event, treeId, treeNode) {
      let desc = treeNode.desc
      if (desc === NODE.NodeDesc.DIR) {
        fetchDirAndSuiteNode(treeNode.mid).then(response => {
          const addNodes = formatDirNodes(response.data, treeNode.id, treeNode.checked)
          this.zTreeObj.removeChildNodes(treeNode)
          this.zTreeObj.addNodes(treeNode, addNodes)
          if (treeNode.checked) {
            this.zTreeOnCheck()
          }
        })
      } else if (desc === NODE.NodeDesc.SUITE) {
        fetchCaseNode(treeNode.mid).then(response => {
          const addNodes = formatSuiteNodes(response.data, treeNode.id, treeNode.checked)
          this.zTreeObj.removeChildNodes(treeNode)
          this.zTreeObj.addNodes(treeNode, addNodes)
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
        } else if (treeNode.desc === NODE.NodeDesc.ROOT) {
            this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.ROOT)
        } else if (treeNode.desc === NODE.NodeDesc.FILE) {
            this.$store.commit('tree/SET_DETAIL_TYPE', NODE.DetailType.FILE)
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
    executeMethod(method, treeId) {
      this[`${method}`](treeId)
    },
    showMenuCallback(id) {
      const iconBtn = document.getElementById(id)
      const rect = iconBtn.getBoundingClientRect()
      this.currentMenuNodeId = id
      this.showTreeMenu('root', rect.left, rect.top)
    },
    closeNodeDialog() {
      this.nodeParams = {}
      this.showNodeDialog = false
      this.nodeDialogTitle = ''
      this.nodeDialogForm = {}
    },
    // rename project, create or update dir/suite/case
    commitNodeDialog() {
      const that = this
      const node = this.nodeParams.meta_data
      if (this.nodeParams.post_type === NODE.NodeDesc.ROOT) {
        if (this.nodeParams.action_type === NODE.ActionType.UPDATE) {
          // rename project
          const params = {'name': this.nodeDialogForm.name}
          updateProject(node.mid, params).then(response => {
            node.name = response.data.name
            that.zTreeObj.updateNode(node)
            that.closeNodeDialog()
          })
        }
      }
      if (this.nodeParams.post_type === NODE.NodeDesc.DIR) {
        if (this.nodeParams.action_type === NODE.ActionType.POST) {
          // create dir
          const params = {'name': this.nodeDialogForm.name, 'parent_dir_id': node.mid, 'project_id': this.projectId, 'category': node.type}
          createDir(params).then(response => {
            if (node.open) {
              const dirNode = handlerNode(response.data, node.id, NODE.NodeDesc.DIR)
              that.zTreeObj.addNodes(node, -1, dirNode)
            } else {
              that.zTreeOnExpand('expand', node.treeId, node)
            }
            that.closeNodeDialog()
          })
        } else if (this.nodeParams.action_type === NODE.ActionType.UPDATE) {
          // update dir
          const params = {'name': this.nodeDialogForm.name}
          updateDir(node.mid, params).then(response => {
            node.name = response.data.name
            that.zTreeObj.updateNode(node)
            that.closeNodeDialog()
          })
        }
      } else if (this.nodeParams.post_type === NODE.NodeDesc.SUITE) {
        // create suite
        if (this.nodeParams.action_type === NODE.ActionType.POST) {
          const params = {'name': this.nodeDialogForm.name, 'suite_dir_id': node.mid, 'category': node.type}
          createSuite(params).then(response => {
            if (node.open) {
              const suiteNode = handlerNode(response.data, node.id, NODE.NodeDesc.SUITE)
              that.zTreeObj.addNodes(node, -1, suiteNode)
            } else {
              that.zTreeOnExpand('expand', node.treeId, node)
            }
            that.closeNodeDialog()
          })
        } else if (this.nodeParams.action_type === NODE.ActionType.UPDATE) {
          // update suite
          const params = {'name': this.nodeDialogForm.name}
          updateSuite(node.mid, params).then(response => {
            node.name = response.data.name
            that.zTreeObj.updateNode(node)
            that.closeNodeDialog()
          })
        }
      } else if (this.nodeParams.post_type === NODE.NodeDesc.CASE) {
        if (this.nodeParams.action_type === NODE.ActionType.POST) {
          // create case
          const params = {'name': this.nodeDialogForm.name, 'test_suite_id': node.mid, 'category': node.type}
          createCase(params).then(response => {
            if (node.open) {
              const caseNode = handlerNode(response.data, node.id, NODE.NodeDesc.CASE)
              that.zTreeObj.addNodes(node, -1, caseNode)
            } else {
              that.zTreeOnExpand('expand', node.treeId, node)
            }
            that.closeNodeDialog()
          })
        } else if (this.nodeParams.action_type === NODE.ActionType.UPDATE) {
          // update case
          const params = {'name': this.nodeDialogForm.name}
          updateCase(node.mid, params).then(response => {
            node.name = response.data.name
            that.zTreeObj.updateNode(node)
            that.closeNodeDialog()
          })
        }
      }
    },
    addDirNode() {},
    renameNode(nodeTId) {
      const node = this.zTreeObj.getNodeByTId(nodeTId)
      this.nodeParams = {
        'action_type': NODE.ActionType.UPDATE, 'post_type': node.desc,
        'meta_data': node
      }
      this.initDialogInfo('update', node.name)
    },
    deleteNode(nodeTId) {
      const that = this
      const node = that.zTreeObj.getNodeByTId(nodeTId)
      let warnInfo = `将删除该节点及所有子节点`
      if (node.desc === NODE.NodeDesc.DIR) {
        warnInfo = `将删除【${node.name}】及该目录下所有内容，是否继续？`
      } else if (node.desc === NODE.NodeDesc.SUITE) {
        warnInfo = `将删除【${node.name}】及该套件下所有用例，是否继续？`
      } else if (node.desc === NODE.NodeDesc.CASE) {
        warnInfo = `将删除用例【${node.name}】，是否继续？`
      }
      this.$messageBox.confirm(
        warnInfo,
        '警告',
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
    copyNode(nodeTId) {
      const node = this.zTreeObj.getNodeByTId(nodeTId)
      console.log(node)
    },
    initDialogInfo(action, name) {
      const createType = this.nodeParams.post_type
      if (action === 'create') {
        const prefix = '新建'
        if (createType === NODE.NodeDesc.DIR) {
          this.nodeDialogTitle = prefix + '目录'
          this.nodeDialogForm = {label: '目录名称', name: name}
        } else if (createType === NODE.NodeDesc.SUITE) {
          this.nodeDialogTitle = prefix + '套件'
          this.nodeDialogForm = {label: '套件名称', name: name}
        } else if (createType === NODE.NodeDesc.CASE) {
          this.nodeDialogTitle = prefix + '用例'
          this.nodeDialogForm = {label: '用例名称', name: name}
        }
      } else if (action === 'update') {
        this.nodeDialogTitle = '重命名'
        if (createType === NODE.NodeDesc.ROOT) {
          this.nodeDialogForm = {label: '项目名称', name: name}
        } else if (createType === NODE.NodeDesc.DIR) {
          this.nodeDialogForm = {label: '目录名称', name: name}
        } else if (createType === NODE.NodeDesc.SUITE) {
          this.nodeDialogForm = {label: '套件名称', name: name}
        } else if (createType === NODE.NodeDesc.CASE) {
          this.nodeDialogForm = {label: '用例名称', name: name}
        }
      }
      this.showNodeDialog = true
    },
    addHoverDom(treeId, treeNode) {
      const that = this
      this.menuMethods = [
        {id: treeNode.tId, method: 'copyNode', title: '复制'},
        {id: treeNode.tId, method: 'pasteNode', title: '粘贴'},
        {id: treeNode.tId, method: 'renameNode', title: '重命名'},
        {id: treeNode.tId, method: 'deleteNode', title: '删除'},
      ]
      // project root node not use
      if (treeNode.desc === NODE.NodeDesc.ROOT) {
        addSvgHover('edit_', treeNode.tId, 'iconfont icon-edit', 'rename',function () {
          that.nodeParams = {
            'action_type': NODE.ActionType.UPDATE, 'post_type': NODE.NodeDesc.ROOT,
            'meta_data': treeNode
          }
          that.initDialogInfo('update', '')
        })
      }
      if (treeNode.desc === NODE.NodeDesc.DIR) {
        addSvgHover('folder_add_', treeNode.tId, 'iconfont icon-a-folderadd-line', 'create dir',function () {
          that.nodeParams = {
            'action_type': NODE.ActionType.POST, 'post_type': NODE.NodeDesc.DIR,
            'meta_data': treeNode
          }
          that.initDialogInfo('create', '')
        })
        addSvgHover('suite_add_', treeNode.tId, 'iconfont icon-a-additionfile-line', 'create suite',function () {
          that.nodeParams = {
            'action_type': NODE.ActionType.POST, 'post_type': NODE.NodeDesc.SUITE,
            'meta_data': treeNode
          }
          that.initDialogInfo('create', '')
        })
        if (treeNode.pid !== NODE.RootPId) {
          addSvgHover('more_menu_', treeNode.tId, 'iconfont icon-a-morevertical-line', 'more',function () {
            that.showMenuCallback('more_menu_'+treeNode.tId)
          })
        }
      } else if (treeNode.desc === NODE.NodeDesc.SUITE) {
        addSvgHover('case_add_', treeNode.tId, 'iconfont icon-a-addline-line', 'create case',function () {
          that.nodeParams = {
            'action_type': NODE.ActionType.POST, 'post_type': NODE.NodeDesc.CASE,
            'meta_data': treeNode
          }
          that.initDialogInfo('create', '')
        })
        addSvgHover('more_menu_', treeNode.tId, 'iconfont icon-a-morevertical-line', 'more',function () {
          that.showMenuCallback('more_menu_'+treeNode.tId)
        })
      } else if (treeNode.desc === NODE.NodeDesc.CASE) {
        addSvgHover('more_menu_', treeNode.tId, 'iconfont icon-a-morevertical-line', 'more',function () {
          that.showMenuCallback('more_menu_'+treeNode.tId)
        })
      }
    },
    removeHoverDom(treeId, treeNode) {
      $("#edit_" + treeNode.tId).unbind().remove()
      $("#folder_add_" + treeNode.tId).unbind().remove()
      $("#suite_add_" + treeNode.tId).unbind().remove()
      $("#case_add_" + treeNode.tId).unbind().remove()
      $("#more_menu_" + treeNode.tId).unbind().remove()
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
