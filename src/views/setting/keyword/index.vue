<template>
  <div class="keyword-config">
    <div class="card-header">
      <div class="group-button">
        <el-button type="primary">新建分组</el-button>
      </div>
    </div>
    <div class="card-body">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          v-for="(group, index) in keywordGroups"
          :name="group['id']"
          :key="index"
          :title="group['name']"
        >
          <p>{{groupKeywordMap[group['id']]}}</p>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { fetchKeywordGroup } from "@/api/kgroup";
// import { getLibKeywordByGroup } from "@/api/keyword";

export default {
  name: 'Keyword',
  data() {
    return {
      loading: true,
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
        this.keywordGroups = response.data
      })
    },
    handleChange(groupIdArr) {
      console.log(groupIdArr)
      // const newOpenGroupId = this.activeNames[-1]
      // getLibKeywordByGroup(newOpenGroupId).then(response => {
      //   this.groupKeywordMap[newOpenGroupId] = response.data
      // })
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
    .item-label {
      font-size: 14px;
      padding-left: 10px;
      color: $textColor;
    }
    .project-selector {
      padding-left: 5px;
    }
    .group-button {
      margin-left: auto;
      margin-right: 10px;
    }
  }
}
</style>
