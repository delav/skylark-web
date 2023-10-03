<template>
  <div v-loading="reportLoading" ref="reportHTML" v-html="htmlText" class="web-con" v-once></div>
</template>

<script>

export default {
  name: 'HtmlViewer',
  props: {
    buildId: String
  },
  data() {
    return {
      htmlText: '',
      reportLoading: true
    }
  },
  mounted() {
    this.getHtmlLog()
  },
  methods: {
    getHtmlLog() {
    }
  }
}
</script>

<style scoped>

</style>
