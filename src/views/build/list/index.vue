<template>
  <div class="build-list">
    <div class="instantly-item">
      <span>即将构建</span>
      <div></div>
    </div>
    <div class="recently-item">
      <span>最近构建</span>
      <div class="item-list"></div>
    </div>
  </div>
</template>

<script>
import { fetchHistories } from '@/api/build'

export default {
  name: 'BuildList',
  data() {
    return {
      historyList: [],
    }
  },
  created() {
    // this.getHistoryList()
  },
  methods: {
    getHistoryList() {
      fetchHistories(10, 1).then(response => {
        this.historyList = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.build-list {
  width: 100%;
  height: 100%;
  .instantly-item {
    min-height: 200px;
  }
  .recently-item {}
}
</style>
