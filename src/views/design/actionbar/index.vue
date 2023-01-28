<template>
  <div class="action-bar">
    <div class="env-show">
      <span>当前环境:</span>
      <span>{{ executeEnv }}</span>
    </div>
    <div class="action-content">
      <div class="icon-list">
        <icon-item :condition="canRun" i-class="run" @func="startBuild" description="执行用例"></icon-item>
        <icon-item :condition="canStop" i-class="stop" @func="stopBuild" description="终止执行"></icon-item>
        <icon-item :condition="seeLog" i-class="log" @func="log" description="查看日志"></icon-item>
        <icon-item :condition="canSave" i-class="save" @func="saveEntity" description="保存修改"></icon-item>
        <icon-item :condition="isSelect" i-class="copy" @func="copyEntity" description="复制组件"></icon-item>
        <icon-item :condition="isSelect" i-class="delete" @func="deleteEntity" description="删除组件"></icon-item>
        <icon-item :condition="canPush" i-class="push" @func="pushProject" description="推送项目"></icon-item>
      </div>
    </div>
  </div>
</template>

<script>
import IconItem from './components/IconItem'
import NODE from '@/constans/node'
import { deepCopy } from '@/utils/dcopy'
import { updateEntities } from '@/api/entity'
import { setCursorStyle } from '@/utils/hover'
import { createBuild, getBuildProgress } from '@/api/build'

export default {
  name: 'ActionBar',
  components: {
    IconItem
  },
  data() {
    return {
      executeEnv: '',
      hadRunCases: []
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
    getProgress(buildId) {
      let that = this
      let interval = setInterval(function () {
        const running = this.$store.state.action.isRunning
        if (!running) {
          clearInterval(interval)
          return
        }
        getBuildProgress( buildId).then(response => {
          let resData = response.data
          const buildProgress = resData['progress']
          const newStatusCase = resData['had_run']
          for (let caseId in newStatusCase) {
            if (caseId in newStatusCase) continue
            let node = that.ztreeObj.getNodesByFilter(function (node) {
              return node.mid === caseId
                && node.desc === NODE.NodeDesc.CASE
            }, true)
            if (node === null) continue
            if (newStatusCase[caseId] === true) {
              $('#' + node.tId + '_span').css('color', 'green')
            } else {
              $('#' + node.tId + '_span').css('color', 'red')
            }
          }
          that.hadRunCases = newStatusCase
          if (Number(buildProgress) === 100) {
            clearInterval(interval)
            that.$store.commit('action/SET_RUNNING', false)
            that.$message.success('测试执行完成')
          }
        }).catch(() => {
          clearInterval(interval)
          that.$store.commit('action/SET_RUNNING', false)
        })
      }, 1000)
    },
    startBuild() {
      const data = {
        'online': false,
        'cron_job': false,
        'debug': true,
        'env': this.$store.state.project.currentEnv,
        'project_id': this.$store.state.project.projectId,
        'project_name': this.$store.state.project.projectName,
        'run_data': this.$store.state.tree.checkedNodes
      }
      createBuild(data).then(response => {
        this.$store.commit('action/SET_RUNNING', true)
        let buildId = response.data['build_id']
        console.log(buildId)
        // this.getProgress(buildId)
      })
    },
    stopBuild() {
      this.$store.commit('action/SET_RUNNING', false)
    },
    log() {},
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
      this.$store.commit('tree/SET_NODE_DETAIL', caseEntities)
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
    pushProject() {},
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
    line-height: $toolbarHeight;
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
