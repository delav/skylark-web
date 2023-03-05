<template>
  <div class="env-variable">
    <div class="env-head">
      <el-radio-group v-model="defaultEvn" @change="changeEnv">
        <el-radio v-for="item in envList" :key="item.id" :label="item.id">{{ item['env_name'] }}</el-radio>
      </el-radio-group>
      <div class="copy-env">
        Copy from
        <el-select style="width: 120px" v-model="selectCopyEnv" placeholder="Select" size="small">
          <template v-for="item in envList">
            <el-option :key="item.id" v-if="item.id !==defaultEvn" :label="item['env_name']" :value="item.id"/>
          </template>
        </el-select>
        <el-button style="margin-left: 5px" size="small" type="danger" @click="copyVariables">确定</el-button>
      </div>
    </div>
    <div class="env-body">
      <variable :variables="envVariables" module-from="project"></variable>
    </div>
  </div>
</template>

<script>
import Variable from '@/views/design/editor/components/Variable'
import { fetchVariables, createVariable } from '@/api/variable'

export default {
  name: 'EnvVariable',
  components: {
    Variable
  },
  data() {
    return {
      allVariables: {},
      envVariables: [],
      defaultEvn: '',
      selectCopyEnv: '',
    }
  },
  computed: {
    envList() {
      return this.$store.state.project.envList
    },
  },
  created() {
    this.defaultEvn = this.$store.state.project.currentEnv
    this.getEnvVariables()
  },
  methods: {
    changeVariableList(envId) {
      if (this.allVariables[envId] !== undefined) {
        this.envVariables = this.allVariables[envId]
      } else {
        this.envVariables = []
      }
    },
    getEnvVariables() {
      const projectId = this.$store.state.project.projectId
      if (projectId === '') return
      fetchVariables(projectId, 0).then(response => {
        const resList = response.data
        let variablesDict = {}
        for (let i = 0; i < resList.length; i++) {
          const evnId = resList[i]['env']
          if (evnId !== null && variablesDict[evnId] !== undefined) {
            variablesDict[evnId].push(resList[i])
          } else {
            variablesDict[evnId] = [resList[i]]
          }
        }
        this.allVariables = variablesDict
        this.changeVariableList(this.defaultEvn)
      })
    },
    changeEnv(val) {
      this.$store.commit('project/SET_CURRENT_ENV', val)
      this.changeVariableList(val)
    },
    copyVariables() {
      const fromEnv = this.selectCopyEnv
      const toEnv = this.defaultEvn
      const fromEnvList = this.allVariables[fromEnv]
      this.envVariables = []
      this.allVariables[toEnv] = []
      if (fromEnvList === undefined) return
      for (let i = 0; i < fromEnvList.length; i++) {
        fromEnvList[i]['env'] = toEnv
        createVariable(fromEnvList[i]).then(response => {
          const item = response.data
          this.envVariables.push(item)
          this.allVariables[toEnv].push(item)
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.env-variable {
  width: 100%;
  height: 100%;
  .env-head {
    height: 50px;
    .copy-env {
      float: right;
    }
  }
  .env-body {

  }
  .create-dialog {
    .create-content {

    }
  }
}

</style>
