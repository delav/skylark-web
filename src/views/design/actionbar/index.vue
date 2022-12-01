<template>
  <div class="action-bar">
    <div class="env-show">
      <span>当前环境:</span>
      <span>{{ executeEnv }}</span>
    </div>
    <div class="action-content">
      <div class="icon-list">
        <icon-item :condition="canRun" i-class="run" @func="run" description="执行用例"></icon-item>
        <icon-item :condition="canStop" i-class="stop" @func="stop" description="终止执行"></icon-item>
        <icon-item :condition="seeLog" i-class="log" @func="log" description="查看日志"></icon-item>
        <icon-item :condition="canSave" i-class="save" @func="save" description="保存修改"></icon-item>
        <icon-item :condition="isSelect" i-class="copy" @func="copyEntities" description="复制组件"></icon-item>
        <icon-item :condition="isSelect" i-class="delete" @func="deleteEntities" description="删除组件"></icon-item>
        <icon-item :condition="true" i-class="push" @func="push" description="推送项目"></icon-item>
      </div>
    </div>
  </div>
</template>

<script>
import IconItem from './components/IconItem'

export default {
  name: 'ActionBar',
  components: {
    IconItem
  },
  data() {
    return {
      executeEnv: ''
    }
  },
  computed: {
    canRun() {
      return this.$store.state.execute.canRun
    },
    canStop() {
      return this.$store.state.execute.canStop
    },
    seeLog() {
      return this.$store.state.execute.seeLog
    },
    canSave() {
      return this.$store.state.entity.entityChange
    },
    isSelect() {
      const ses = this.$store.state.entity.selectedEntities
      return ses.length !== 0
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
          that.cancelCopyEntities()
        }
      }
    },
    removeMouseEvent() {
      document.getElementById('entity').onmousedown = null
      document.oncontextmenu = function(){ return true }
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
    run() {},
    stop() {},
    log() {},
    save() {},
    copyEntities() {
      const selectedEntities = this.$store.state.entity.selectedEntities
      if (selectedEntities.length === 0) return
      this.$store.commit('entity/SET_COPY_ENTITIES', selectedEntities)
      const body = document.querySelector('#entity')
      body.style.cursor= 'copy'
      body.oncontextmenu = this.cancelCopyEntities
      this.$message.success('复制成功，单击鼠标右键取消')
    },
    deleteEntities() {
      const selectedEntities = this.$store.state.entity.selectedEntities
      this.caseEntities = this.caseEntities.filter((item1) => !selectedEntities.some((item2) => item1.id === item2.id))
      this.$store.commit('entity/SET_CURRENT_ENTITY', {})
    },
    cancelCopyEntities() {
      document.oncontextmenu = function () {
        document.oncontextmenu = function () {
          return true
        }
        return false
      }
      const copiedEntities = this.$store.state.entity.copiedEntities
      if (copiedEntities.length === 0) return
      this.$store.commit('entity/SET_COPY_ENTITIES', [])
      const body = document.querySelector('#entity')
      body.style.cursor= 'auto'
    },
    push() {},
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
