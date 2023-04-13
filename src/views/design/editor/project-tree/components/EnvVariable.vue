<template>
  <div class="env-variable">
    <div class="env-head">
      <el-radio-group v-model="selectEvn" @change="changeVariableList">
        <el-radio v-for="item in envList" :key="item.id" :label="item.id">{{ item['name'] }}</el-radio>
      </el-radio-group>
      <div class="copy-env">
        Copy from
        <el-select style="width: 120px" v-model="selectCopyEnv" placeholder="Select" size="small">
          <template v-for="item in envList">
            <el-option :key="item.id" v-if="item.id !==selectEvn" :label="item['name']" :value="item.id"/>
          </template>
        </el-select>
        <el-button style="margin-left: 5px" size="small" type="danger" @click="copyVariables">确定</el-button>
      </div>
    </div>
    <div class="base-env">
      <variable :variables="envVariables" module-from="project"></variable>
    </div>
    <div class="region-env">
      <div class="region-head">
        <el-select v-model="selectRegion" placeholder="Select">
          <el-option
            v-for="item in regionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="region-body"></div>
    </div>
  </div>
</template>

<script>
import NODE from '@/constans/node'
import Variable from '@/views/design/editor/components/Variable'
import { deepCopy } from '@/utils/dcopy'
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
      selectEvn: '',
      selectCopyEnv: '',
      selectRegion: ''
    }
  },
  computed: {
    envList() {
      return this.$store.state.project.envList
    },
    regionList() {
      return this.$store.state.project.regionList
    }
  },
  created() {
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
      const projectId = this.$store.state.tree.projectId
      if (projectId === '') return
      fetchVariables(projectId, NODE.ModuleType.PROJECT).then(response => {
        const resList = response.data
        let variablesDict = {}
        if (resList.length === 0) return
        for (let i = 0; i < resList.length; i++) {
          const evnId = resList[i]['env_id']
          if (evnId !== null && variablesDict[evnId] !== undefined) {
            variablesDict[evnId].push(resList[i])
          } else {
            variablesDict[evnId] = [resList[i]]
          }
        }
        this.selectEvn = resList[0]['env_id']
        this.allVariables = variablesDict
        this.changeVariableList(this.selectEvn)
      })
    },
    copyVariables() {
      const fromEnv = this.selectCopyEnv
      const toEnv = this.selectEvn
      const fromEnvList = this.allVariables[fromEnv]
      const batchList = deepCopy(fromEnvList)
      if (batchList === undefined) return
      this.envVariables = []
      this.allVariables[toEnv] = []
      for (let i = 0; i < fromEnvList.length; i++) {
        batchList[i]['env_id'] = toEnv
        createVariable(batchList[i]).then(response => {
          const variable = response.data
          this.envVariables.push(variable)
          this.allVariables[toEnv].push(variable)
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
  .base-env {

  }
  .region-env {
    margin-top: 15px;
  }
  .create-dialog {
    .create-content {

    }
  }
}

</style>
