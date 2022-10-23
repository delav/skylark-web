<template>
  <div class="keyword-item">
    <p>{{keywordData.name}}</p>
  </div>
</template>

<script>
export default {
  name: 'KeywordItem',
  props: {
    keywordData: {}
  }
}
</script>

<style lang="scss" scoped>
.keyword-list {
  p {
    margin: 0;
    cursor: move;
  }
}
</style>
