<template>
  <div class="record-list">
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
import { fetchRecords } from '@/api/record'

export default {
  name: 'RecordList',
  data() {
    return {
      recordList: [],
    }
  },
  created() {
    // this.getRecordList()
  },
  methods: {
    getRecordList() {
      fetchRecords(10, 1).then(response => {
        this.historyList = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.record-list {
  width: 100%;
  height: 100%;
  .instantly-item {
    min-height: 200px;
  }
  .recently-item {}
}
</style>
