<template>
  <div class="action">
    <div class="content">
      <env-setting />
      <div class="action-content">
        <div class="icon-list">
          <icon-item :condition="canRun" i-class="action-run" @func="startBuild" description="执行用例"></icon-item>
          <icon-item :condition="canStop" i-class="action-stop" @func="stopBuild" description="终止执行"></icon-item>
          <icon-item :condition="seeLog" i-class="action-log" @func="showReport" description="查看日志"></icon-item>
          <icon-item :condition="canSave" i-class="action-save" @func="saveEntity" description="保存修改"></icon-item>
          <icon-item :condition="isSelect" i-class="action-copy" @func="copyEntity" description="复制组件"></icon-item>
          <icon-item :condition="isSelect" i-class="action-delete" @func="deleteEntity" description="删除组件"></icon-item>
          <icon-item :condition="canPush" i-class="action-push" @func="showPushDialog=true" description="推送项目"></icon-item>
        </div>
      </div>
    </div>
    <div class="dialog">
      <div class="push-dialog">
        <el-dialog
          width="600px"
          v-model="showPushDialog"
          title="推送项目"
          :close-on-click-modal="false"
          destroy-on-close
        >
          <div class="env-content">
            <push-info @closeDialog="closePushDialog" />
          </div>
        </el-dialog>
      </div>
      <div class="push-dialog">
        <el-dialog
          width="100%"
          v-model="showLogDialog"
          title="日志详情"
          :close-on-click-modal="false"
          destroy-on-close
        >
          <div class="log-content">
            <report-viewer :build-id="buildId" />
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import jquery from "jquery";
import EnvSetting from "@/views/design/action/components/EnvSetting";
import IconItem from "@/views/design/action/components/IconItem";
import PushInfo from "@/views/design/action/components/PushInfo";
import ReportViewer from "@/views/design/action/components/ReportViewer";
import NODE from "@/constans/node";
import CASE from "@/constans/testcase";
import { deepCopy } from "@/utils/dcopy";
import { guid } from "@/utils/other";
import { updateEntities } from "@/api/entity";
import { setCursorStyle } from "@/utils/hover";
import { buildDebug, getBuildProgress, getDebugLog } from "@/api/builder";

export default {
  name: 'Action',
  components: {
    EnvSetting,
    IconItem,
    PushInfo,
    ReportViewer
  },
  data() {
    return {
      hadRunCases: {},
      buildId: '',
      progressHistory: [],
      runFinish: false,
      showPushDialog:false,
      showLogDialog:false,
    }
  },
  computed: {
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
      const pid = this.$store.state.tree.projectId
      return pid !== 0 && pid !== ''
    },
    showRegion() {
      return this.$store.state.base.showRegion
    },
  },
  mounted() {
    this.addMouseEvent()
  },
  unmounted() {
    this.removeMouseEvent()
  },
  methods: {
    addMouseEvent() {
      const that = this
      document.oncontextmenu = function(e) {
        e.preventDefault()
      }
      document.onmousedown = function(e) {
        if(e.button === 2) {
          that.cancelCopyEntity()
        }
      }
    },
    removeMouseEvent() {
      document.oncontextmenu = function() {
        return true
      }
      document.onmousedown = function () {
        return true
      }
    },
    changeNodeColor(treeObj, mid, color) {
      let node = treeObj.getNodesByFilter(function (node) {
        return node.mid.toString() === mid && node.desc === NODE.NodeDesc.CASE
      }, true)
      if (node === null) {
        return
      }
      jquery('#' + node.tId + '_span').css('color', color)
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
        const params = {'mode': 'debug', 'task_id': buildId}
        getBuildProgress(params).then(response => {
          let buildResult = response.data
          const caseIdList = Object.keys(buildResult)
          for (let i = 0; i < caseIdList.length; i++) {
            const caseId = caseIdList[i]
            if (Object.prototype.hasOwnProperty.call(that.hadRunCases, caseId)) {
              continue
            }
            const caseResult = JSON.parse(buildResult[caseId]).result
            that.changeNodeColor(treeObj, caseId, that.getNodeTextColor(caseResult))
          }
          that.hadRunCases = buildResult
          that.progressHistory.push(caseIdList.length)
          if (caseIdList.length === totalCase) {
            clearInterval(interval)
            that.$store.commit('action/SET_RUNNING', false)
            that.$store.commit('action/SET_RUN_FINISH', true)
            that.$message.success({
              duration: 1000,
              message: '执行完成!'
            })
          } else if (that.executeOneTimeout()) {
            clearInterval(interval)
            that.$store.commit('action/SET_RUNNING', false)
            that.$message.error({
              duration: 0,
              showClose: true,
              message: '执行超时!'
            })
          }
        }).catch(() => {
          clearInterval(interval)
          that.$store.commit('action/SET_RUNNING', false)
        })
      }, CASE.QueryPeriod)
    },
    executeOneTimeout() {
      const lastIndex = this.progressHistory.length - 1
      if (lastIndex === -1) {
        return false
      }
      let count = 0
      const lastRunNumber = this.progressHistory[lastIndex]
      for (let i = lastIndex; i >= 0; i--) {
        if (this.progressHistory[i] === lastRunNumber) {
          count += 1
        } else {
          break
        }
      }
      return  CASE.QueryPeriod * count > CASE.CaseTimeout

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
      this.progressHistory = []
    },
    startBuild() {
      this.recoverStat()
      const envId = this.$store.state.action.currentEnv
      const envMap = this.$store.state.base.envMap
      const envName = envMap[envId]
      if (envName === undefined) {
        this.$message.error('构建数据出错!')
        return
      }
      const data = {
        'action_type': 'start',
        'env_id': envId,
        'env_name': envMap[envId],
        'project_id': this.$store.state.tree.projectId,
        'project_name': this.$store.state.tree.projectName,
        'run_data': this.$store.state.tree.checkedNodes,
        'parameters': this.$store.state.action.executeParams
      }
      if (this.showRegion) {
        const regionMap = this.$store.state.base.regionMap
        const regionId = this.$store.state.action.currentRegion
        const regionName = regionMap[regionId]
        if (regionName === undefined) {
          this.$message.error('构建数据出错!')
          return
        }
        data['region_id'] = regionId
        data['region_name'] = regionMap[regionId]
      }
      buildDebug(data).then(response => {
        this.$store.commit('action/SET_RUNNING', true)
        this.buildId = response.data['build_id']
        this.getProgress(this.buildId, response.data['total_case'])
      })
    },
    stopBuild() {
      this.$store.commit('action/SET_RUNNING', false)
    },
    showReport() {
      // this.showLogDialog = true
      getDebugLog(this.buildId).then(response => {
        const logUrl = `http://localhost:8091/#/${this.buildId}/log.html`
        const newTab = window.open(logUrl)
        newTab.document.open()
        newTab.document.write(response.data)
        newTab.document.close()
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

.action {
  height: $toolbarHeight;
  background-color: $toolbarBg;
  align-items: center;
  justify-content: flex-start;
  //border-top: 1px solid $toolbarBg;
  //border-bottom: 1px solid $toolbarBg;
  .content {
    display: flex;
    justify-content: flex-start;
    .action-content {
      margin-right: auto;
      height: 100%;
      text-align: center;
      .icon-list {
        display: inline-block;
      }
    }
  }
}
</style>
