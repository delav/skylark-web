<template>
  <div class="project-tree">
    <div v-if="!hideTree" class="project-show">
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
        <el-button type="info" size="small"><svg-icon icon-class="setting"></svg-icon>变量配置</el-button>
      </span>
        <span class="setting-button">
        <el-button type="info" size="small"><svg-icon icon-class="new"></svg-icon>新建项目</el-button>
      </span>
        <span class="arrow-icon"><svg-icon icon-class="arrow-left" @click="hideProjectTree"></svg-icon></span>
      </div>
    </div>
    <div v-else class="project-hide"></div>
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
            size="large"
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
  </div>
</template>

<script>
import tree from 'vue-giant-tree-3'
import { ElMessageBox } from 'element-plus'
import { fetchBaseDir, createDir, updateDir, deleteDir } from '@/api/dir'
import {fetchDirAndSuiteNode, createSuite, updateSuite, deleteSuite} from '@/api/suite'
import { fetchCaseNode, createCase, updateCase, deleteCase } from '@/api/case'
import { addSvgHover } from '@/utils/hover'
import { fetchProjectList } from '@/api/project'

export default {
  components: {
    tree
  },
  computed: {
    hideTree() {
      return this.$store.state.tree.hideTree
    }
  },
  watch: {
    hideTree: {
      handler() {
        // this.hideTree = this.$store.state.tree.hideTree
      },
      immediate: true,
    }
  },
  data() {
    return {
      zTreeSetting: {
        check: {
          enable: true
        },
        data: {
          simpleData: { enable: true, idKey: 'id', pIdKey: 'pid', rootPId: null },
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
      projectList: [],
      projectId: null,
      zTreeObj: null,
      zTreeNodes: [],
      showNodeMenu: false,
      nodeMenuPosition: {
        top: '0',
        left: '0'
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
  created() {
    this.getProjects()
  },
  methods: {
    getProjects() {
      fetchProjectList(1, 20).then(response => {
        this.projectList = response.data
        this.getBaseNodes(2)
      })
    },
    getBaseNodes(projectId) {
      if (!projectId) return
      fetchBaseDir(projectId).then(response => {
        this.zTreeNodes = response.data
        this.$store.commit('tree/SET_CURRENT_PROJECT', projectId)
      })
    },
    zTreeOnCreated(zTreeObj) {
      this.zTreeObj = zTreeObj
      zTreeObj.expandNode(zTreeObj.getNodes()[0], true)
    },
    hideProjectTree () {
      this.$store.commit('tree/SET_HIDE_TREE', true)
    },
    zTreeOnCheck() {},
    // expand node, get children nodes
    zTreeOnExpand(event, treeId, treeNode) {
      let desc = treeNode.desc
      if (desc === 'd') {
        fetchDirAndSuiteNode(treeNode.id).then(response => {
          this.zTreeObj.removeChildNodes(treeNode)
          this.zTreeObj.addNodes(treeNode, response.data)
        })
      } else if (desc === 's') {
        fetchCaseNode(treeNode.id).then(response => {
          this.zTreeObj.removeChildNodes(treeNode)
          this.zTreeObj.addNodes(treeNode, response.data)
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
      console.log('click:' + this.showNodeMenu)
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
    // create or update dir/suite/case
    commitNodeDialog() {
      const that = this
      const node = this.nodeParams.meta_data
      if (this.nodeParams.post_type === 'd') {
        if (this.nodeParams.action_type === 1) {
          // create dir
          const params = {'dir_name': this.nodeDialogForm.name, 'parent_dir_id': node.id, 'project_id': this.projectId, 'dir_type': node.type}
          createDir(params).then(response => {
            if (node.open) {
              that.zTreeObj.addNodes(node, -1, response.data)
            } else {
              that.zTreeOnExpand('expand', node.treeId, node)
            }
            that.closeNodeDialog()
          })
        } else if (this.nodeParams.action_type === 2) {
          // update dir
          const params = {'dir_name': this.nodeDialogForm.name}
          updateDir(node.id, params).then(response => {
            node.name = response.data.name
            that.zTreeObj.updateNode(node)
            that.closeNodeDialog()
          })
        }
      } else if (this.nodeParams.post_type === 's') {
        // create suite
        if (this.nodeParams.action_type === 1) {
          const params = {'suite_name': this.nodeDialogForm.name, 'suite_dir_id': node.id, 'suite_type': node.type}
          createSuite(params).then(response => {
            if (node.open) {
              that.zTreeObj.addNodes(node, -1, response.data)
            } else {
              that.zTreeOnExpand('expand', node.treeId, node)
            }
            that.closeNodeDialog()
          })
        } else if (this.nodeParams.action_type === 2) {
          // update suite
          const params = {'suite_name': this.nodeDialogForm.name}
          updateSuite(node.id, params).then(response => {
            node.name = response.data.name
            that.zTreeObj.updateNode(node)
            that.closeNodeDialog()
          })
        }
      } else if (this.nodeParams.post_type === 'c') {
        if (this.nodeParams.action_type === 1) {
          // create case
          const params = {'case_name': this.nodeDialogForm.name, 'test_suite_id': node.id, 'case_type': node.type}
          createCase(params).then(response => {
            if (node.open) {
              that.zTreeObj.addNodes(node, -1, response.data)
            } else {
              that.zTreeOnExpand('expand', node.treeId, node)
            }
            that.closeNodeDialog()
          })
        } else if (this.nodeParams.action_type === 2) {
          // update case
          const params = {'case_name': this.nodeDialogForm.name}
          updateCase(node.id, params).then(response => {
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
        'action_type': 2, 'post_type': node.desc,
        'meta_data': node
      }
      this.initDialogInfo('update', node.name)
    },
    deleteNode(nodeTId) {
      const that = this
      const node = that.zTreeObj.getNodeByTId(nodeTId)
      let warnInfo = `将删除该节点及所有子节点`
      if (node.desc === 'd') {
        warnInfo = `将删除【${node.name}】及该目录下所有内容，是否继续？`
      } else if (node.desc === 's') {
        warnInfo = `将删除【${node.name}】及该套件下所有用例，是否继续？`
      } else if (node.desc === 'c') {
        warnInfo = `将删除用例【${node.name}】，是否继续？`
      }
      ElMessageBox.confirm(
        warnInfo,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        if (node.desc === 'd') {
          deleteDir(node.id)
          that.zTreeObj.removeNode(node)
        } else if (node.desc === 's') {
          deleteSuite(node.id)
          that.zTreeObj.removeNode(node)
        } else if (node.desc === 'c') {
          deleteCase(node.id)
          that.zTreeObj.removeNode(node)
        }
        }).catch(() => {
          console.log('取消删除')
        })
    },
    copyNode(nodeTId) {
      const node = this.zTreeObj.getNodeByTId(nodeTId)
      console.log(node)
    },
    initDialogInfo(action, name) {
      const createType = this.nodeParams.post_type
      if (action === 'create') {
        const prefix = '新建'
        if (createType === 'd') {
          this.nodeDialogTitle = prefix + '目录'
          this.nodeDialogForm = {label: '目录名称', name: name}
        } else if (createType === 's') {
          this.nodeDialogTitle = prefix + '套件'
          this.nodeDialogForm = {label: '套件名称', name: name}
        } else if (createType === 'c') {
          this.nodeDialogTitle = prefix + '用例'
          this.nodeDialogForm = {label: '用例名称', name: name}
        }
      } else if (action === 'update') {
        this.nodeDialogTitle = '重命名'
        if (createType === 'd') {
          this.nodeDialogForm = {label: '目录名称', name: name}
        } else if (createType === 's') {
          this.nodeDialogForm = {label: '套件名称', name: name}
        } else if (createType === 'c') {
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
      if (treeNode.desc === 'd') {
        addSvgHover('folder_add_', treeNode.tId, 'iconfont icon-a-folderadd-line', 'create directory',function () {
          that.nodeParams = {
            'action_type': 1, 'post_type': 'd',
            'meta_data': treeNode
          }
          that.initDialogInfo('create', '')
        })
        addSvgHover('suite_add_', treeNode.tId, 'iconfont icon-a-additionfile-line', 'create suite',function () {
          that.nodeParams = {
            'action_type': 1, 'post_type': 's',
            'meta_data': treeNode
          }
          that.initDialogInfo('create', '')
        })
        if (treeNode.getParentNode().desc !== 'p') {
          addSvgHover('more_menu_', treeNode.tId, 'iconfont icon-a-morevertical-line', 'more',function () {
            that.showMenuCallback('more_menu_'+treeNode.tId)
          })
        }
      } else if (treeNode.desc === 's') {
        addSvgHover('case_add_', treeNode.tId, 'iconfont icon-a-addline-line', 'create case',function () {
          that.nodeParams = {
            'action_type': 1, 'post_type': 'c',
            'meta_data': treeNode
          }
          that.initDialogInfo('create', '')
        })
        addSvgHover('more_menu_', treeNode.tId, 'iconfont icon-a-morevertical-line', 'more',function () {
          that.showMenuCallback('more_menu_'+treeNode.tId)
        })
      } else if (treeNode.desc === 'c') {
        addSvgHover('more_menu_', treeNode.tId, 'iconfont icon-a-morevertical-line', 'more',function () {
          that.showMenuCallback('more_menu_'+treeNode.tId)
        })
      }
    },
    removeHoverDom(treeId, treeNode) {
      $("#folder_add_" + treeNode.tId).unbind().remove()
      $("#suite_add_" + treeNode.tId).unbind().remove()
      $("#case_add_" + treeNode.tId).unbind().remove()
      $("#more_menu_" + treeNode.tId).unbind().remove()
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
  .project-show {
    height: 100%;
    .project {
      height: $selectorHeight;
    }
    .tree {
      height: calc(100% - #{$toolHeight} - #{$selectorHeight});
      overflow: auto;
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
            color: $buttonText;
            cursor: pointer;
            outline: none;
            &:hover {
              color: $buttonHoverText;
              background-color: $buttonHoverBg;
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
      .arrow-icon {
        float: right;
        padding-right: 10px;
        cursor: pointer;
        &:hover {
          color: $buttonHoverText;
        }
        .svg-icon {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
  .project-hide {}
}
</style>
