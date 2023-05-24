<template>
  <div class="action">
    <div class="env-setting">
      <div class="env-list">
        <span class="env-text">环境:</span>
        <el-select
          style="width: 80px"
          v-model="executeEnv"
          @change="changeEnv"
          size="small"
          placeholder=" "
        >
          <el-option
            v-for="item in envList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="region-list" v-show="showRegion">
        <span class="region-text">地区:</span>
        <el-select
          style="width: 80px"
          v-model="executeRegion"
          @change="changeRegion"
          size="small"
          placeholder=" "
        >
          <el-option
            v-for="item in regionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
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
import IconItem from "@/views/design/action/components/IconItem";
import PushInfo from "@/views/design/action/components/PushInfo";
import NODE from "@/constans/node";
import CASE from "@/constans/testcase";
import { deepCopy } from "@/utils/dcopy";
import { guid } from "@/utils/other";
import { updateEntities } from "@/api/entity";
import { setCursorStyle } from "@/utils/hover";
import { buildDebug, getBuildProgress } from "@/api/builder";

export default {
  name: 'Action',
  components: {
    IconItem,
    PushInfo,
  },
  data() {
    return {
      executeEnv: '',
      executeRegion: '',
      hadRunCases: {},
      runFinish: false,
      showPushDialog:false,
      reportPath: ''
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
    envList() {
      return this.$store.state.base.envList
    },
    regionList() {
      return this.$store.state.base.regionList
    }
  },
  watch: {
    '$store.state.base.baseLoaded': {
      handler(value) {
        if (!value) return
        this.setDefaultEnv()
        this.setDefaultRegion()
      },
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
    setDefaultEnv() {
      const envs = this.$store.state.base.envList
      if (envs.length !== 0) {
        this.executeEnv = envs[0].id
      }
      this.changeEnv(this.executeEnv)
    },
    setDefaultRegion() {
      const regions = this.$store.state.base.regionList
      if (regions.length !== 0) {
        this.executeRegion = regions[0].id
      }
      this.changeRegion(this.executeRegion)
    },
    changeEnv(val) {
      this.$store.commit('action/SET_CURRENT_ENV', val)
    },
    changeRegion(val) {
      this.$store.commit('action/SET_CURRENT_REGION', val)
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
            that.$message.success({duration: 1000, message: 'Test Complete!'})
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
        'action_type': 'start',
        'env_id': this.$store.state.action.currentEnv,
        'project_id': this.$store.state.tree.projectId,
        'project_name': this.$store.state.tree.projectName,
        'run_data': this.$store.state.tree.checkedNodes,
      }
      if (this.$store.state.action.currentRegion !== '') {
        data['region_id'] = this.$store.state.action.currentRegion
      }
      buildDebug(data).then(response => {
        this.$store.commit('action/SET_RUNNING', true)
        this.reportPath = response.data['report_path']
        this.getProgress(response.data['build_id'], response.data['total_case'])
      })
    },
    stopBuild() {
      this.$store.commit('action/SET_RUNNING', false)
    },
    showLog() {
      if (this.reportPath === '') return
      const url = this.reportPath + '/log.html'
      window.open(url, '_blank')
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
  display: flex;
  .env-setting {
    display: flex;
    width: 300px;
    height: 100%;
    padding-left: 5px;
    padding-top: -1px;
    line-height: $toolbarHeight;
    .env-list {
      .env-text {
        font-size: 14px;
        color: #6b778c;
        padding-right: 10px;
      }
    }
    .region-list {
      margin-left: 10px;
      .region-text {
        font-size: 14px;
        color: #6b778c;
        padding-right: 10px;
      }
    }
  }
  .action-content {
    float: left;
    width: calc(100% - 300px);
    height: 100%;
    text-align: center;
    .icon-list {
      display: inline-block;
    }
  }
}
.action .env-setting {
  @import "src/styles/element/selector.scss";
}
</style>
