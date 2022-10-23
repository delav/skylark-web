<template>
  <div class="keyword-list">
    <div class="head">
      <p class="kw-title">
        <svg-icon style="height: 36px;width: 36px" icon-class="fold" />
        <span style="line-height: 36px;font-weight: bold;">组件库</span>
        <el-input style="width: 100px" v-model="searchKeyword" placeholder="Please input"></el-input>
      </p>
    </div>
    <div class="content">
      <el-collapse v-model="groupNames">
        <el-collapse-item v-for="(group, index) in keywordArray" :key="index" :title="group['group_name']">
          <draggable
            :list="group['keywords']"
            :group="dragSetting"
            item-key="id"
            class="list-group"
            ghost-class="ghost"
          >
            <template #item="{ element }">
              <keyword-item :keyword-data="element" v-on:dblclick="appendKeywordToCase"/>
            </template>
          </draggable>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import KeywordItem from './components/KeywordItem'
import { getLibKeyword } from '@/api/keyword'

export default {
  name: 'KeywordList',
  components: {
    draggable,
    KeywordItem,
  },
  data() {
    return {
      keywordArray: [],
      dragSetting: {
        name: 'kws',
        put: false,
        pull: 'clone',
      },
      groupNames: [],
      searchKeyword: ''
    }
  },
  computed: {
    projectId() {
      return this.$store.state.tree.projectId
    }
  },
  created() {
    this.getLibKeywords()
  },
  methods: {
    getLibKeywords() {
      getLibKeyword(this.projectId).then(response => {
        this.keywordArray = response.data
      })
    },
    appendKeywordToCase() {}
  }
}
</script>

<style lang="scss" scoped>
$selectorHeight: 40px;

.keyword-list {
  width: 100%;
  height: 100%;
  .head {
    height: $selectorHeight;
    .kw-title {
      margin: 0;
    }
  }
}
</style>
