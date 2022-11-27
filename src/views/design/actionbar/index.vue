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
        <icon-item :condition="true" i-class="push" @func="push" description="推送"></icon-item>
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
  },
  methods: {
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
