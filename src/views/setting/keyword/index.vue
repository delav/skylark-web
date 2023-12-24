<template>
  <div class="keyword-config">
    <div class="card-header">
      <span class="item-desc department">部门：</span>
      <el-input class="item-value" v-model="departmentName" :disabled="true"></el-input>
      <span class="item-desc team">团队：</span>
      <el-input class="item-value" v-model="teamName" :disabled="true"></el-input>
      <div class="group-button">
        <el-button type="success" @click="getReadyKeywordList">
          <el-icon><Search /></el-icon>
          扫描组件
        </el-button>
        <el-button type="warning" @click="showGroupUpdate=true">
          <el-icon><Edit /></el-icon>
          编辑分组
        </el-button>
        <el-button type="primary" @click="showGroupForm=true">
          <el-icon><Plus /></el-icon>
          新建分组
        </el-button>
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
            :header-cell-style="{padding: '5px 0', fontSize:'14px', background: '#f4f5f7'}"
            :cell-style="{color: '#666', fontSize:'14px', padding: '6px 0'}"
          >
            <el-table-column label="函数名" min-width="100" prop="name" show-overflow-tooltip/>
            <el-table-column label="参数" min-width="100" prop="input_params" show-overflow-tooltip/>
            <el-table-column label="返回值" min-width="100" prop="output_params" show-overflow-tooltip/>
            <el-table-column label="来源" min-width="100" prop="library_name" show-overflow-tooltip/>
            <el-table-column label="功能" min-width="120" prop="desc" show-overflow-tooltip/>
            <el-table-column label="状态" min-width="80" prop="status_desc">
              <template #default="scope">
                <el-tag type="warning">{{scope.row.status_desc}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="110">
              <template #default="scope">
                <el-button-group>
                  <el-button type="primary" size="small" @click="showReadyConfirm(scope.row)" link>确认</el-button>
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
            :header-cell-style="{padding: '5px 0', fontSize:'14px', background: '#f4f5f7'}"
            :cell-style="{color: '#666', fontSize:'14px', padding: '6px 0'}"
          >
            <el-table-column label="函数名" min-width="100" prop="name" show-overflow-tooltip/>
            <el-table-column label="组件名" min-width="100" prop="ext_name" show-overflow-tooltip/>
            <el-table-column label="来源" min-width="100" prop="library_name" show-overflow-tooltip/>
            <el-table-column label="功能" min-width="120" prop="desc" show-overflow-tooltip/>
            <el-table-column label="状态" min-width="80" prop="status_desc">
              <template #default="scope">
                <el-tag type="success">{{scope.row.status_desc}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="110">
              <template #default="scope">
                <el-button-group>
                  <el-button type="primary" @click="editKeyword(scope.row)" link>编辑</el-button>
                  <el-button type="primary" @click="keywordDetail(scope.row)" link>详情</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="dialog">
      <el-dialog
        width="600px"
        v-model="showGroupForm"
        title="新建分组"
        :close-on-click-modal="false"
      >
        <div class="content">
          <group-form
            @cancel="showGroupForm=false"
            @confirm="createGroup"
          />
        </div>
      </el-dialog>
      <el-dialog
        width="600px"
        v-model="showGroupUpdate"
        title="编辑分组"
        :close-on-click-modal="false"
        :destroy-on-close="true"
      >
        <div class="content">
          <group-update
            :group-list="keywordGroups"
            @cancel="showGroupUpdate=false"
            @delete="deleteGroup"
            @confirm="updateGroup"
          />
        </div>
      </el-dialog>
      <el-dialog
        width="700px"
        v-model="showReadyFlag"
        title="确认组件"
        :close-on-click-modal="false"
      >
        <div class="content">
          <ready-form
            :keyword-data="keywordObject"
            :keyword-group="keywordGroups"
            @cancel="showReadyFlag=false"
            @confirm="saveReadyKeyword"
          />
        </div>
      </el-dialog>
      <el-dialog
        width="700px"
        v-model="showKeywordEdit"
        title="编辑组件"
        :close-on-click-modal="false"
      >
        <div class="content">
          <keyword-form
            :keyword-data="keywordObject"
            :keyword-group="keywordGroups"
            @cancel="showKeywordEdit=false"
            @confirm="saveKeyword"
          />
        </div>
      </el-dialog>
      <el-dialog
        width="60%"
        v-model="showKeywordDetail"
        title="组件详情"
        :close-on-click-modal="false"
      >
        <div class="content">
          <keyword-detail
            :keyword-data="keywordObject"
            :keyword-group="keywordGroups"
            @cancel="showKeywordDetail=false"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import GroupForm from "@/views/setting/keyword/components/GroupForm";
import GroupUpdate from "@/views/setting/keyword/components/GroupUpdate";
import ReadyForm from "@/views/setting/keyword/components/ReadyForm";
import KeywordForm from "@/views/setting/keyword/components/KeywordForm";
import KeywordDetail from "@/views/setting/keyword/components/KeywordDetail";
import { deepCopy } from "@/utils/dcopy";
import { fetchKeywordGroup, createKeywordGroup, updateKeywordGroup, deleteKeywordGroup } from "@/api/kgroup";
import { createKeyword, updateKeyword, getLibKeywordByGroup, getReadyLibKeyword } from "@/api/keyword";

export default {
  name: 'Keyword',
  components: {
    GroupForm,
    GroupUpdate,
    ReadyForm,
    KeywordForm,
    KeywordDetail
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
      showGroupForm: false,
      showGroupUpdate: false,
      activeReady: false,
      readyKeywords: [],
      showReadyFlag: false,
      keywordObject: {},
      showKeywordEdit: false,
      showKeywordDetail: false
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
        // expand
        const [newOpenGroupId] = this.activeNames.slice(-1)
        getLibKeywordByGroup(newOpenGroupId).then(response => {
          this.groupKeywordMap[newOpenGroupId] = response.data
        })
      }
      this.rawActiveNames = deepCopy(this.activeNames)
    },
    createGroup(data) {
      createKeywordGroup(data).then(() => {
        this.showGroupForm = false
        this.getKeywordGroup()
      })
    },
    updateGroup(data) {
      const groupId = data.id
      delete data['id']
      updateKeywordGroup(groupId, data).then(() => {
        this.showGroupUpdate = false
        this.getKeywordGroup()
      })
    },
    deleteGroup(groupId) {
      deleteKeywordGroup(groupId).then(() => {
        this.showGroupUpdate = false
        this.getKeywordGroup()
      })
    },
    getReadyKeywordList() {
      getReadyLibKeyword().then(response => {
        this.readyKeywords = response.data
        if (this.readyKeywords.length === 0) {
          this.$message.warning('暂无新增组件')
        }
      })
    },
    showReadyConfirm(row) {
      this.keywordObject = row
      this.showReadyFlag = true
    },
    saveReadyKeyword(data) {
      createKeyword(data).then(response => {
        this.showReadyFlag = false
        for (let i = 0; i < this.readyKeywords.length; i++) {
          if (response.data.name === this.readyKeywords[i]['name']) {
            this.readyKeywords.splice(i, 1)
            break
          }
        }
        this.$message.success('操作成功')
      })
    },
    editKeyword(row) {
      this.keywordObject = row
      this.showKeywordEdit = true
    },
    saveKeyword(keywordData) {
      const keywordId = keywordData['id']
      updateKeyword(keywordId, keywordData).then(() => {
        this.showKeywordEdit = false
        this.$message.success('保存成功')
      })
    },
    keywordDetail(row) {
      this.keywordObject = row
      this.showKeywordDetail = true
    }
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
      //border-bottom: 1px solid #e4e7ed;
      cursor: pointer;
      .ready-content {
        background-color: #ffde9c;
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
      font-weight: 500;
    }
  }
}
:deep(.el-collapse) {
  .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
