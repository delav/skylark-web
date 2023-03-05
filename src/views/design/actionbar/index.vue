<template>
  <div class="action-bar">
    <div class="env-show">
      <span class="desc-text">当前环境：</span>
      <el-tag size="small" type="warning">{{ executeEnv }}</el-tag>
    </div>
    <div class="action-content">
      <div class="icon-list">
        <icon-item :condition="canRun" i-class="run" @func="startBuild" description="执行用例"></icon-item>
        <icon-item :condition="canStop" i-class="stop" @func="stopBuild" description="终止执行"></icon-item>
        <icon-item :condition="seeLog" i-class="log" @func="showLog" description="查看日志"></icon-item>
        <icon-item :condition="canSave" i-class="save" @func="saveEntity" description="保存修改"></icon-item>
        <icon-item :condition="isSelect" i-class="copy" @func="copyEntity" description="复制组件"></icon-item>
        <icon-item :condition="isSelect" i-class="delete" @func="deleteEntity" description="删除组件"></icon-item>
        <icon-item :condition="canPush" i-class="push" @func="showPushDialog=true" description="推送项目"></icon-item>
      </div>
    </div>
    <div class="dialog">
      <div class="push-dialog">
        <el-dialog
          width="550px"
          v-model="showPushDialog"
          title="推送项目"
          :close-on-click-modal="false"
          :destroy-on-close="true"
        >
          <div class="env-content">
            <push-info @closeDialog="closePushDialog" />
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import IconItem from './components/IconItem'
import PushInfo from './components/PushInfo'
import NODE from '@/constans/node'
import CASE from '@/constans/testcase'
import { deepCopy } from '@/utils/dcopy'
import { guid } from '@/utils/other'
import { updateEntities } from '@/api/entity'
import { setCursorStyle } from '@/utils/hover'
import { createBuild, getBuildInfo, getBuildProgress } from '@/api/build'

export default {
  name: 'ActionBar',
  components: {
    IconItem,
    PushInfo,
  },
  data() {
    return {
      executeEnv: '',
      hadRunCases: {},
      runFinish: false,
      buildId: null,
      showPushDialog:false,
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    },
    canRun() {
      const running = this.$store.state.action.isRunning
      const checkedNodes = this.$store.state.tree.checkedNodes
      return running === false && checkedNodes.length !== 0
    },
    canStop() {
      return this.$store.state.action.isRunning === true
    },
    seeLog() {
      return this.$store.state.action.runFinish === true
    },
    canSave() {
      return this.$store.state.entity.entityChange === true
    },
    isSelect() {
      return this.$store.state.entity.selectedEntities.length !== 0
    },
    canPush() {
      const pid = this.$store.state.project.projectId
      return pid !== 0 && pid !== ''
    }
  },
  watch: {
    '$store.state.project.currentEnv': {
      handler(value) {
        this.getCurrentEnv(value)
      },
      immediate: true
    }
  },
  created() {
    this.addMouseEvent()
  },
  unmounted() {
    this.removeMouseEvent()
  },
  methods: {
    addMouseEvent() {
      const that = this
      document.oncontextmenu = function(e){
        e.preventDefault()
      }
      document.onmousedown = function(e){
        if(e.button === 2){
          that.cancelCopyEntity()
        }
      }
    },
    removeMouseEvent() {
      document.oncontextmenu = function(){ return true }
      document.onmousedown = function () { return true }
    },
    getCurrentEnv(envId) {
      const envList = this.$store.state.project.envList
      for (let i = 0; i < envList.length; i++) {
        if (envId === envList[i]['id']) {
          this.executeEnv = envList[i]['env_name']
          break
        }
      }
    },
    changeNodeColor(treeObj, mid, color) {
      let node = treeObj.getNodesByFilter(function (node) {
        return node.mid.toString() === mid && node.desc === NODE.NodeDesc.CASE
      }, true)
      if (node === null) return
      $('#' + node.tId + '_span').css('color', color)
    },
    getNodeTextColor(result) {
      let textColor = CASE.StatusColor.DEFAULT
      switch (result) {
        case CASE.CaseStatus.PASSED:
          textColor = CASE.StatusColor.PASSED
          break
        case CASE.CaseStatus.FAILED:
          textColor = CASE.StatusColor.FAILED
          break
        case CASE.CaseStatus.SKIPPED:
          textColor = CASE.StatusColor.SKIPPED
          break
      }
      return textColor
    },
    getProgress(buildId, totalCase) {
      let that = this
      let interval = setInterval(function () {
        const running = that.$store.state.action.isRunning
        if (!running) {
          clearInterval(interval)
          return
        }
        const treeId = that.$store.state.tree.treeId
        const treeObj = $.fn.zTree.getZTreeObj(treeId)
        getBuildProgress(buildId).then(response => {
          let buildResult = response.data
          const caseIdList = Object.keys(buildResult)
          for (let i = 0; i < caseIdList.length; i++) {
            const caseId = caseIdList[i]
            if (Object.prototype.hasOwnProperty.call(that.hadRunCases, caseId)) continue
            const caseResult = JSON.parse(buildResult[caseId]).result
            that.changeNodeColor(treeObj, caseId, that.getNodeTextColor(caseResult))
          }
          that.hadRunCases = buildResult
          if (Object.keys(buildResult).length === totalCase) {
            clearInterval(interval)
            that.$store.commit('action/SET_RUNNING', false)
            that.$store.commit('action/SET_RUN_FINISH', true)
            that.$message.success({duration: 2000, message: 'Test Complete!'})
          }
        }).catch(() => {
          clearInterval(interval)
          that.$store.commit('action/SET_RUNNING', false)
        })
      }, 2000)
    },
    recoverStat () {
      const treeId = this.$store.state.tree.treeId
      const treeObj = $.fn.zTree.getZTreeObj(treeId)
      let colorNodes = Object.keys(this.hadRunCases)
      for (let i = 0; i < colorNodes.length; i++) {
        let caseId = colorNodes[i]
        this.changeNodeColor(treeObj, caseId, this.getNodeTextColor('default'))
      }
      this.$store.commit('action/SET_RUN_FINISH', false)
      this.hadRunCases = []
    },
    startBuild() {
      this.recoverStat()
      const data = {
        'debug': true,
        'env_id': this.$store.state.project.currentEnv,
        'project_id': this.$store.state.project.projectId,
        'project_name': this.$store.state.project.projectName,
        'run_data': this.$store.state.tree.checkedNodes,
      }
      createBuild(data).then(response => {
        this.$store.commit('action/SET_RUNNING', true)
        this.buildId = response.data['build_id']
        this.getProgress(response.data['build_id'], response.data['total_case'])
      })
    },
    stopBuild() {
      this.$store.commit('action/SET_RUNNING', false)
    },
    showLog() {
      if (!this.buildId) return
      getBuildInfo(this.buildId).then(response => {
        const reportPath = response.data['report_path']
        const url = reportPath + '/log.html'
        window.open(url, '_blank')
      })
    },
    saveEntity() {
      const postData = {
        'case_id': this.$store.state.tree.selectedNode['mid'],
        'entity_list': this.$store.state.entity.caseEntities
      }
      updateEntities(postData).then(() => {
        // this.$message.success('保存成功')
        this.$store.commit('entity/SET_ENTITY_CHANGE', false)
      })
    },
    copyEntity() {
      const selectedEntities = this.$store.state.entity.selectedEntities
      if (selectedEntities.length === 0) return
      this.$store.commit('entity/SET_COPY_ENTITIES', selectedEntities)
      setCursorStyle(['et-case'], 'copy')
      // const body = document.querySelector('#entity')
      document.oncontextmenu = this.cancelCopyEntity
      this.$message.success('复制成功，单击鼠标右键取消')
    },
    deleteEntity() {
      const selectedEntities = this.$store.state.entity.selectedEntities
      let caseEntities = deepCopy(this.$store.state.entity.caseEntities)
      caseEntities = caseEntities.filter((item1) => !selectedEntities.some((item2) => item1.uuid === item2.uuid))
      this.$store.commit('entity/SET_CURRENT_ENTITY', {})
      this.$store.commit('entity/SET_SELECTED_ENTITIES', [])
      this.$store.commit('entity/SET_CASE_ENTITIES', caseEntities)
      this.$store.commit('entity/SET_SYNC_ENTITY_FLAG', guid())
      this.$store.commit('entity/SET_ENTITY_CHANGE', true)
    },
    cancelCopyEntity() {
      document.oncontextmenu = function () {
        document.oncontextmenu = function () { return true }
        return false
      }
      const copiedEntities = this.$store.state.entity.copiedEntities
      if (copiedEntities.length === 0) return
      this.$store.commit('entity/SET_COPY_ENTITIES', [])
      setCursorStyle(['et-case'], 'auto')
    },
    closePushDialog() {
      this.showPushDialog = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.action-bar {
  height: $toolbarHeight;
  background-color: $toolbarBg;
  .env-show {
    float: left;
    width: 150px;
    height: 100%;
    padding-left: 5px;
    line-height: $toolbarHeight;
    .desc-text {
      font-size: 14px;
      color: #6b778c;
      padding-right: 5px;
    }
  }
  .action-content {
    float: left;
    width: calc(100% - 150px);
    height: 100%;
    text-align: center;
    .icon-list {
      display: inline-block;
    }
  }
}
</style>
