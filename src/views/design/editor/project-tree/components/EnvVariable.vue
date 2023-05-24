<template>
  <div class="env-variable">
    <div class="env-head">
      <el-radio-group v-model="selectEvn" size="small" @change="changeVariableList">
        <el-radio-button v-for="item in envList" :key="item.id" :label="item.id">{{ item['name'] }}</el-radio-button>
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
    <div class="common-env" v-show="showCommon">
      <variable :variables="commonVariables" :module-info="moduleInfo"></variable>
    </div>
    <div class="region-env" v-show="showRegion">
      <div class="region-head">
        <el-radio-group v-model="selectRegion" @change="changeRegionList">
          <el-radio v-for="item in regionList" :key="item.id" :label="item.id">{{ item['name'] }}</el-radio>
        </el-radio-group>
      </div>
      <div class="region-body">
        <variable :variables="regionVariables" :module-info="moduleInfo"></variable>
      </div>
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import Variable from "@/views/design/editor/components/Variable";
import { fetchVariables, batchCreateVariable } from "@/api/variable";

export default {
  name: 'EnvVariable',
  components: {
    Variable
  },
  data() {
    return {
      moduleInfo: {},
      allVariables: {},
      envVariables: {},
      commonVariables: [],
      regionVariables: [],
      selectEvn: '',
      selectCopyEnv: '',
      selectRegion: '',
      commonKey: 'common',
      showCommon: false
    }
  },
  computed: {
    envList() {
      return this.$store.state.base.envList
    },
    regionList() {
      return this.$store.state.base.regionList
    },
    showRegion() {
      return this.$store.state.base.showRegion
    }
  },
  created() {
    this.getEnvVariables()
  },
  methods: {
    getEnvVariables() {
      this.variableType = NODE.ModuleType.PROJECT
      let variablesDict = {}
      this.selectEvn = this.envList[0]['id']
      for (let i = 0; i < this.envList.length; i ++) {
        const evnId = this.envList[i]['id']
        variablesDict[evnId] = {}
        if (!this.envList[i]['default']) continue
        this.selectEvn = evnId
      }
      if (this.showRegion) {
        this.selectRegion = this.regionList[0]['id']
      }
      const projectId = this.$store.state.tree.projectId
      if (projectId === '') return
      fetchVariables(projectId, NODE.ModuleType.PROJECT).then(response => {
        const resList = response.data
        if (resList.length === 0) return
        for (let i = 0; i < resList.length; i++) {
          const evnId = resList[i]['env_id']
          const regionId = resList[i]['region_id']
          if (!(evnId in variablesDict)) continue
          let regionKey = ''
          if (!regionId) {
            regionKey = this.commonKey
          } else {
            regionKey = resList[i]['region_id']
          }
          if (regionKey in variablesDict[evnId]) {
            variablesDict[evnId][regionKey].push(resList[i])
          } else {
            variablesDict[evnId][regionKey] = [resList[i]]
          }
        }
        this.allVariables = variablesDict
        this.moduleInfo = {
          mid: this.$store.state.tree.projectId,
          type: NODE.ModuleType.PROJECT,
          env: this.selectEvn,
          region: this.selectRegion
        }
        this.changeVariableList(this.selectEvn)
      })
    },
    changeVariableList(envId) {
      this.selectCopyEnv = ''
      this.showCommon = false
      this.commonVariables = []
      this.regionVariables = []
      this.moduleInfo.env = envId
      if (Object.keys(this.allVariables[envId]).length === 0) {
        return
      }
      const envVariables = this.allVariables[envId]
      if (this.commonKey in envVariables) {
        this.showCommon = true
        this.commonVariables = envVariables[this.commonKey]
      }
      if (this.showRegion) {
        this.regionVariables = envVariables[this.selectRegion]
      }
    },
    changeRegionList(regionId) {
      const envVariables = this.allVariables[this.selectEvn]
      this.regionVariables = envVariables[regionId]
      this.moduleInfo.region = regionId
    },
    copyVariables() {
      const projectId = this.$store.state.tree.projectId
      const fromEnv = this.selectCopyEnv
      const toEnv = this.selectEvn
      let copyVariables = []
      Object.values(this.allVariables[fromEnv]).forEach((value)=>{
        copyVariables.push(...value)
      })
      if (copyVariables.length === 0) return
      const params = {
        'env_id': toEnv,
        'variable_list': copyVariables
      }
      batchCreateVariable(params).then(() => {
        fetchVariables(projectId, NODE.ModuleType.PROJECT, toEnv).then(response => {
          const resList = response.data
          for (let i = 0; i < resList.length; i++) {
            const regionId = resList[i]['region_id']
            let regionKey = ''
            if (!regionId) {
              regionKey = this.commonKey
            } else {
              regionKey = resList[i]['region_id']
            }
            if (regionKey in this.allVariables[toEnv]) {
              this.allVariables[toEnv][regionKey].push(resList[i])
            } else {
              this.allVariables[toEnv][regionKey] = [resList[i]]
            }
          }
          this.changeVariableList(toEnv)
        })
      })
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
  .common-env {

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
