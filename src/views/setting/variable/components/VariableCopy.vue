<template>
  <div class="variable-copy">
    <div class="copy-header">
      从
      <el-select v-model="selectCopyFromEnv" @change="changeFromEnv" placeholder="Select">
        <el-option
          v-for="(item, index) in envList"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="selectCopyFromEnv" @change="changeToEnv" placeholder="Select">
        <el-option
          v-for="(item, index) in envList"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      复制到
      <el-select v-model="selectCopyToEnv" placeholder="Select">
        <el-option
          v-for="(item, index) in envList"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="selectCopyFromEnv" @change="changeFromRegion" placeholder="Select">
        <el-option
          v-for="(item, index) in envList"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="copy-content" v-if="selectCopyFromEnv">
      <p class="tip-desc">*勾选需要复制的变量</p>
      <el-table
        :data="copyVariableList"
        border
        style="width: 100%;"
        @selection-change="selectChangeVariable"
        @select-all="selectAllVariable"
        :row-style="{height: '0'}"
        :cell-style="{padding: '3px 0'}"
        :header-cell-style="{ background: '#f4f5f7', color: '#606266', padding: '5px 0' }"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column fixed prop="name" label="变量名" width="180" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="value" label="变量值" min-width="40%" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-show="showRegion" prop="region_id" label="地区" width="100" sortable>
          <template #default="scope">
            <span>{{getRegionName(scope.row['region_id'])}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="20%" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-button @click="cancelAction">取消</el-button>
      <el-button type="primary" @click="confirmAction">确定</el-button>
    </div>
  </div>
</template>

<script>
import {copyVariableByEnv, fetchVariables} from "@/api/variable";
import NODE from "@/constans/node";

export default {
  name: 'VariableCopy',
  computed: {
    envList() {
      return this.$store.state.base.envList
    },
    regionList() {
      return this.$store.state.base.regionList
    },
    showRegion() {
      return this.$store.state.base.showRegion
    },
  },
  props: {
    projectId: Number
  },
  data() {
    return {
      copyParams: {
        'from_env_id': '',
        'to_env_id': '',
        'from_region_id': '',
        'to_region_id': ''
      },
      selectCopyFromEnv: '',
      selectCopyToEnv: '',
      copyVariableList: [],
      copySelectVariable: []
    }
  },
  methods: {
    changeFromEnv(envId) {
      fetchVariables(this.projectId, NODE.ModuleType.PROJECT, envId).then(response => {
        this.copyVariableList = response.data
      })
    },
    changeToEnv() {
    },
    changeFromRegion(regionId) {
      console.log(regionId)
    },
    changeToRegion() {},
    getRegionName(regionId) {
      const regionMap = this.$store.state.base.regionMap
      if (!regionId) {
        return ''
      }
      return regionMap[regionId]
    },
    selectChangeVariable(selectList) {
      this.copySelectVariable = selectList
    },
    selectAllVariable() {
      this.copySelectVariable = []
    },
    cancelAction() {
      this.$emit('cancelCopyAction')
    },
    confirmAction() {},
    copyVariables() {
      const params = {
        'module_id': this.projectId,
        'module_type': NODE.ModuleType.PROJECT,
        'from_env_id': this.selectCopyEnv,
        'to_env_id': this.selectEvn,
      }
      if (this.copySelectVariable.length !== 0) {
        let variableIds = []
        for (let i = 0; i < this.copySelectVariable.length; i++) {
          variableIds.push(this.copySelectVariable[i]['id'])
        }
        params['variable_id_list'] = variableIds
      }
      copyVariableByEnv(params).then((response) => {
        const resList = response.data
        if (resList.length === 0) return
        let variablesDict = {}
        for (let i = 0; i < resList.length; i++) {
          const regionId = resList[i]['region_id']
          let regionKey = ''
          if (!regionId) {
            regionKey = this.commonKey
          } else {
            regionKey = resList[i]['region_id']
          }
          if (regionKey in variablesDict) {
            variablesDict[regionKey].push(resList[i])
          } else {
            variablesDict[regionKey] = [resList[i]]
          }
          this.changeVariableList(this.selectEvn)
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
