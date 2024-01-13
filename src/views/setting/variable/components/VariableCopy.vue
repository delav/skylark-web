<template>
  <div class="variable-copy">
    <div class="copy-header">
      <div class="from-header">
        <span class="desc-text">从</span>
        <el-select
          style="width: 310px"
          v-model="copyParams.from_env_id"
          @change="changeFromEnv"
          placeholder="选择环境"
        >
          <el-option
            v-for="(item, index) in envList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-if="showRegion"
          style="width: 310px;margin-left: 10px"
          v-model="copyParams.from_region_id"
          @change="changeFromRegion"
          placeholder="选择地区"
        >
          <el-option
            v-for="(item, index) in allRegionList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="to-header">
        <span class="desc-text">复制到</span>
        <el-select
          style="width: 310px"
          v-model="copyParams.to_env_id"
          placeholder="选择环境"
        >
          <el-option
            v-for="(item, index) in envList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          style="width: 310px;margin-left: 10px"
          v-if="showRegion"
          v-model="copyParams.to_region_id"
          placeholder="选择地区"
        >
          <el-option
            v-for="(item, index) in allRegionList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
    </div>
    <div class="copy-content">
      <p class="tip-desc">*勾选需要复制的变量</p>
      <el-table
        :data="envVariableList"
        border
        style="width: 100%;"
        @selection-change="selectChangeVariable"
        @select-all="selectAllVariable"
        :row-style="{height: '0'}"
        :cell-style="{fontSize: '13px', padding: '2px 0'}"
        :header-cell-style="{ background: '#f4f5f7', fontWeight: 500, color: '#606266', padding: '3px 0' }"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column fixed prop="name" label="变量名" width="160" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="value" label="变量值" min-width="40%" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-show="showRegion" prop="region_id" label="地区" width="90" sortable>
          <template #default="scope">
            <span>{{getRegionName(scope.row['region_id'])}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div class="action-footer">
      <el-button @click="cancelCopy">取消</el-button>
      <el-button type="primary" @click="confirmCopy">确定</el-button>
    </div>
  </div>
</template>

<script>
import { copyVariableByEnv, fetchVariables } from "@/api/variable";
import { deepCopy } from "@/utils/dcopy";

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
    allEnvList() {
      return this.$store.state.base.containAllEnvList
    },
    allRegionList() {
      return this.$store.state.base.containAllRegionList
    }
  },
  props: {
    moduleInfo: Object
  },
  data() {
    return {
      copyParams: {
        'from_env_id': '',
        'to_env_id': '',
        'from_region_id': '',
        'to_region_id': ''
      },
      envVariableList: [],
      envVariableCache: '',
      selectVariables: []
    }
  },
  methods: {
    changeFromEnv(envId) {
      fetchVariables(this.moduleInfo.id, this.moduleInfo.type, envId).then(response => {
        this.envVariableList = response.data
        this.envVariableCache = JSON.stringify(this.envVariableList)
      })
    },
    changeFromRegion(regionId) {
      const rawEnvVariableList = JSON.parse(this.envVariableCache)
      if (regionId === 0) {
        this.envVariableList = rawEnvVariableList
        return
      }
      this.envVariableList = rawEnvVariableList.filter(
        (item) => {return item['region_id'] === regionId}
      )
    },
    getRegionName(regionId) {
      const regionMap = this.$store.state.base.regionMap
      if (!regionId) {
        return ''
      }
      return regionMap[regionId]
    },
    selectChangeVariable(selectList) {
      this.selectVariables = selectList
    },
    selectAllVariable() {
      this.selectVariables = []
    },
    cancelCopy() {
      this.$emit('cancel')
    },
    confirmCopy() {
      const params = deepCopy(this.copyParams)
      if (this.selectVariables.length !== 0) {
        let variableIds = []
        for (let i = 0; i < this.selectVariables.length; i++) {
          variableIds.push(this.selectVariables[i]['id'])
        }
        params['variable_id_list'] = variableIds
      }
      if (params.from_env_id === '' || params.to_env_id === '') {
        this.$message.warning('请选择环境')
        return
      }
      if (params.from_region_id === '') {
        delete params.from_region_id
      }
      if (params.to_region_id === '') {
        delete params.to_region_id
      }
      params['module_id'] = this.moduleInfo.id
      params['module_type'] = this.moduleInfo.type
      copyVariableByEnv(params).then(() => {
        this.$emit('confirm', params.to_env_id)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.variable-copy {
  width: 100%;
  height: 100%;
  .copy-header {
    .from-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .to-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .desc-text {
      width: 80px;
      margin-left:auto;
    }
  }
  .copy-content {
    margin-top: 15px;
    margin-bottom: 18px;
    max-height: 600px;
    .tip-desc {
      color: #f56c6c;
      margin: 3px 0;
      font-size: 13px;
    }
  }
  .action-footer {
    display: flex;
    justify-content: right;
  }
}
</style>
