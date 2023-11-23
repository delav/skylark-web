<template>
  <div class="env-setting">
    <div class="env-list">
      <span class="env-text">{{ $t('BaseDesc._env') }}：</span>
      <el-dropdown @command="changeEnv" class="set-dropdown">
        <span class="set-name">
          {{ envName }}<el-icon :size="12" class="el-icon--right"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, index) in envList"
              :command="item"
              :key="index"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="region-list" v-show="showRegion">
      <span class="region-text">{{ $t('BaseDesc._region') }}：</span>
      <el-dropdown @command="changeRegion" class="set-dropdown">
          <span class="set-name">
            {{ regionName }}<el-icon :size="12" class="el-icon--right"><ArrowDown /></el-icon>
          </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, index) in regionList"
              :command="item"
              :key="index"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="execute-arg">
      <span class="params-text">{{ $t('BaseDesc._parameters') }}：</span>
      <el-popover :hide-after="50" placement="bottom" :width="400" trigger="click">
        <template #reference>
          <svg-icon class-name="param-icon" icon-class="action-expand"></svg-icon>
        </template>
        <div class="params-content">
          <p class="add-line">
            <el-input class="param-input" v-model="executeArgs"></el-input>
            <el-button class="param-button" type="primary">保存</el-button>
          </p>
          <div class="select-radio">
            <el-radio-group v-model="executeArgs">
              <el-radio label="1" size="large">Option 1</el-radio>
              <el-radio label="2" size="large">Option 2</el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import {fetchParametersByProject} from "@/api/parameter";

export default {
  name: 'EnvSetting',
  computed: {
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
      immediate: true
    },
    '$store.state.tree.projectId': {
      handler(value) {
        if (value === '') return
        this.getExecuteParams()
      }
    },
  },
  data() {
    return {
      envName: '',
      regionName: '',
      parameterList: [],
      executeArgs: ''
    }
  },
  methods: {
    setDefaultEnv() {
      const envs = this.$store.state.base.envList
      if (envs.length === 0) {
        return
      }
      this.changeEnv(envs[0])
    },
    setDefaultRegion() {
      const regions = this.$store.state.base.regionList
      if (regions.length === 0) {
        return
      }
      this.changeRegion(regions[0])
    },
    getExecuteParams() {
      const projectId = this.$store.state.tree.projectId
      fetchParametersByProject(projectId).then(response => {
        this.parameterList = response.data
        if (this.parameterList.length !== 0) {
          this.changeExecuteArg(this.parameterList[0])
        }
      })
    },
    changeEnv(item) {
      this.envName = item.name
      this.$store.commit('action/SET_CURRENT_ENV', item.id)
    },
    changeRegion(item) {
      this.regionName = item.name
      this.$store.commit('action/SET_CURRENT_REGION', item.id)
    },
    changeExecuteArg(item) {
      this.executeArgs = item.parameters
      this.$store.commit('action/SET_EXECUTE_PARAMS', item.parameters)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.env-setting {
  display: flex;
  //width: 300px;
  height: 100%;
  padding-left: 7px;
  padding-top: -1px;
  margin-right: auto;
  line-height: $toolbarHeight;
  .env-list {
    min-width: 125px;
    .env-text {
      font-size: 14px;
      color: $textColor;
    }
  }
  .region-list {
    margin-left: 15px;
    min-width: 125px;
    .region-text {
      font-size: 14px;
      color: $textColor;
    }
  }
  .execute-arg {
    margin-left: 15px;
    .params-text {
      font-size: 14px;
      color: $textColor;
    }
    .param-icon {
      cursor: pointer;
      outline: none;
      font-size: 14px;
      color: $textColor;
    }
  }
  .set-dropdown {
    line-height: $toolbarHeight;
    cursor: pointer;
    .set-name {
      outline: none;
      color: $mainColor;
      .el-icon {
        color: $textColor;
      }
    }
  }
}
.params-content {
  .add-line {
    margin: 0;
    display: flex;
    .param-input {
      width: calc(100% - 40px);
    }
    .param-button {
      margin-left: 10px;
    }
  }
  .select-radio {
    margin-top: 10px;
  }
}
:deep(.el-radio-group) {
  display: block;
}
:deep(.el-radio) {
  display: block;
}
</style>
