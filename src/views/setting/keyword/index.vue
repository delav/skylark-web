<template>
  <div class="keyword-config">
    <div class="card-header">
      <span class="item-desc department">部门：</span>
      <el-input class="item-value" v-model="departmentName" :disabled="true"></el-input>
      <span class="item-desc team">团队：</span>
      <el-input class="item-value" v-model="teamName" :disabled="true"></el-input>
      <div class="group-button">
        <el-button type="primary"><el-icon class="el-icon--left"><Search /></el-icon>扫描组件</el-button>
        <el-button type="primary"><el-icon class="el-icon--left"><Plus /></el-icon>新建分组</el-button>
      </div>
    </div>
    <div class="card-body">
      <el-collapse
        v-model="activeNames"
        @change="handleChange"
      >
        <el-collapse-item
          v-for="(group, index) in keywordGroups"
          :name="group['id']"
          :key="index"
          :title="group['name']"
        >
          <el-table
            :data="groupKeywordMap[group['id']]"
            :header-cell-style="{padding: '3px', fontSize:'13px'}"
            :cell-style="{padding: '3px', color: '#666', fontSize:'13px'}"
          >
            <el-table-column label="用户名" min-width="100" prop="username" />
            <el-table-column label="邮箱地址" min-width="120" prop="email" />
            <el-table-column label="所属团队" min-width="100" prop="group_name" />
            <el-table-column label="所属部门" min-width="100" prop="department_name" />
            <el-table-column label="加入时间" min-width="120" prop="date_joined" />
            <el-table-column fixed="right" label="操作" width="80">
              <template #default="scope">
                <el-button type="primary" size="small" @click="editKeyword(scope.row)" link>编辑</el-button>
                <el-button type="primary" size="small" @click="showKeywordDetail(scope.row)" link>详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { deepCopy } from "@/utils/dcopy";
import { fetchKeywordGroup } from "@/api/kgroup";
import { getLibKeywordByGroup } from "@/api/keyword";

export default {
  name: 'Keyword',
  data() {
    return {
      loading: true,
      departmentName: '',
      teamName: '',
      rawActiveNames: [],
      activeNames: [],
      keywordGroups: [],
      groupKeywordMap: {}
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
}
</style>
