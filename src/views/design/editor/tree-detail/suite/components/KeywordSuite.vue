<template>
  <div class="keyword-suite">
    <div class="document">
      <document :cate-document="suiteObject.document"/>
    </div>
  </div>
</template>

<script>
import Document from "@/views/design/editor/tree-detail/components/Document";

export default {
  name: 'KeywordSuite',
  components: {
    Document
  },
  props: {
    suiteInfo: Object
  },
  watch: {
    suiteInfo: {
      handler(val) {
        this.handlerSuiteInfo(val)
      },
      deep: true,
      immediate: true
    },
  },
  data() {
    return {
      suiteObject: {
        document: ''
      },
    }
  },
  methods: {
    handlerSuiteInfo(suiteObj) {
      for (const key in suiteObj) {
        if (key in this.suiteObject) {
          this.suiteObject[key] = suiteObj[key]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.keyword-suite {
  width: 100%;
  height: 100%;
  padding: 5px;
  overflow-y: auto;
}
</style>
