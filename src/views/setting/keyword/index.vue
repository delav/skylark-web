<template>
  <div class="keyword-config">
    <div class="card-header">
      <span class="item-desc department">部门：</span>
      <el-input class="item-value" v-model="departmentName" :disabled="true"></el-input>
      <span class="item-desc team">团队：</span>
      <el-input class="item-value" v-model="teamName" :disabled="true"></el-input>
      <div class="group-button">
        <el-button type="primary" @click="getReadyKeywordList"><el-icon class="el-icon--left"><Search /></el-icon>扫描组件</el-button>
        <el-button type="primary"><el-icon class="el-icon--left"><Plus /></el-icon>新建分组</el-button>
      </div>
    </div>
    <div class="card-body">
      <div class="ready-keyword" v-if="readyKeywords.length!==0">
        <div class="ready-content">
          <p class="ready-title" @click="activeReady=!activeReady">
            有{{ readyKeywords.length }}个组件待确认，点击查看
          </p>
          <el-table
            v-if="activeReady"
            :data="readyKeywords"
            :header-cell-style="{padding: '4px', fontSize:'13px', background: '#f4f5f7'}"
            :cell-style="{padding: '5px', color: '#666', fontSize:'13px'}"
          >
            <el-table-column label="函数名" min-width="100" prop="name" show-overflow-tooltip/>
            <el-table-column label="参数" min-width="100" prop="input_params" show-overflow-tooltip/>
            <el-table-column label="返回值" min-width="100" prop="output_params" show-overflow-tooltip/>
            <el-table-column label="来源" min-width="100" prop="source" show-overflow-tooltip/>
            <el-table-column label="功能" min-width="120" prop="desc" show-overflow-tooltip/>
            <el-table-column label="状态" min-width="80" prop="status">
              <el-tag type="warning">待确认</el-tag>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="110">
              <template #default="scope">
                <el-button-group>
                  <el-button type="primary" size="small" @click="showConfirm(scope.row)" link>确认</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-collapse
        v-model="activeNames"
        @change="handleChange"
      >
        <el-collapse-item
          v-for="(group, index) in keywordGroups"
          :name="group['id']"
          :key="index"
        >
          <template #title>
            <div class="collapse-title">{{ group['name'] }}</div>
          </template>
          <el-table
            :data="groupKeywordMap[group['id']]"
            :header-cell-style="{padding: '4px', fontSize:'13px', background: '#f4f5f7'}"
            :cell-style="{padding: '4px', color: '#666', fontSize:'13px'}"
          >
            <el-table-column label="函数名" min-width="100" prop="name" show-overflow-tooltip/>
            <el-table-column label="组件名" min-width="100" prop="ext_name" show-overflow-tooltip/>
            <el-table-column label="来源" min-width="100" prop="source" show-overflow-tooltip/>
            <el-table-column label="功能" min-width="120" prop="desc" show-overflow-tooltip/>
            <el-table-column label="状态" min-width="80" prop="status">
              <template #default="scope">
                <el-tag>{{keywordStatusMap(scope.row.status)}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="110">
              <template #default="scope">
                <el-button-group>
                  <el-button type="primary" size="small" @click="editKeyword(scope.row)" link>编辑</el-button>
                  <el-button type="primary" size="small" @click="showKeywordDetail(scope.row)" link>详情</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="dialog">
      <div class="ready-dialog">
        <el-dialog
          width="700px"
          v-model="showReadyFlag"
          title="保存组件"
          :close-on-click-modal="false"
        >
          <div class="content">
            <keyword-form
              :keyword-data="keywordObject"
              :keyword-group="keywordGroups"
              @cancel="showReadyFlag=false"
              @confirm="saveReadyKeyword"
            />
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import KeywordForm from "@/views/setting/keyword/components/KeywordForm";
import { statusMap } from "@/constans/common";
import { deepCopy } from "@/utils/dcopy";
import { fetchKeywordGroup } from "@/api/kgroup";
import { getLibKeywordByGroup, getReadyLibKeyword } from "@/api/keyword";

export default {
  name: 'Keyword',
  components: {
    KeywordForm
  },
  data() {
    return {
      loading: true,
      departmentName: '',
      teamName: '',
      rawActiveNames: [],
      activeNames: [],
      keywordGroups: [],
      groupKeywordMap: {},
      activeReady: false,
      readyKeywords: [],
      showReadyFlag: false,
      keywordObject: {}
    }
  },
  mounted() {
    this.getKeywordGroup()
  },
  methods: {
    getKeywordGroup() {
      fetchKeywordGroup().then(response => {
        const result = response.data
        this.departmentName = result['department']
        this.teamName = result['group']
        this.keywordGroups = result['keyword_groups']
      })
    },
    handleChange() {
      if (this.activeNames.length > this.rawActiveNames.length) {
        // 展开
        const [newOpenGroupId] = this.activeNames.slice(-1)
        getLibKeywordByGroup(newOpenGroupId).then(response => {
          this.groupKeywordMap[newOpenGroupId] = response.data
        })
      }
      this.rawActiveNames = deepCopy(this.activeNames)
    },
    getReadyKeywordList() {
      getReadyLibKeyword().then(response => {
        this.readyKeywords = response.data
        if (this.readyKeywords.length === 0) {
          this.$message.warning('暂无新增组件')
        }
      })
    },
    showConfirm(row) {
      this.keywordObject = row
      this.showReadyFlag = true
    },
    saveReadyKeyword(data) {
      console.log(data)
    },
    keywordStatusMap(status) {
      return statusMap(status)
    },
    editKeyword() {},
    showKeywordDetail() {}
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.keyword-config {
  width: 100%;
  height: 100%;
  padding: 0 5px;
  .card-header {
    padding: 10px 0;
    margin-bottom: 10px;
    //border: 1px solid #e4e7ed;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    .item-desc {
      color: $textColor;
      font-size: 14px;
    }
    .team {
      margin-left: 20px;
    }
    .item-value {
      min-width: 100px;
      max-width: 220px;
    }
    .group-button {
      margin-left: auto;
      margin-right: 10px;
    }
  }
  .card-body {
    .ready-keyword {
      border-bottom: 1px solid #e4e7ed;
      background-color: #f6c475;
      cursor: pointer;
      .ready-content {
        .ready-title {
          color: #bd0000;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          margin: 0;
          line-height: 64px;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .collapse-title {
      color: $textColor;
      font-size: 14px;
    }
  }
}
</style>
