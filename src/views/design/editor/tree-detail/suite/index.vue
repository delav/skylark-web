<template>
  <div class="suite-detail">
    <test-suite
      v-if="isTestSuite"
      :suite-info="testSuiteData"
    />
    <keyword-suite
      v-else-if="isKeywordSuite"
      :suite-info="keywordSuiteData"
    />
    <const
      v-else-if="isConst"
      :file-info="fileData"
      @update="saveFileInfo"
    />
    <file
      v-else-if="isFile"
      :file-info="fileData"
    />
  </div>
</template>

<script>
import NODE from "@/constans/node";
import Const from "@/views/design/editor/tree-detail/suite/components/Const";
import File from "@/views/design/editor/tree-detail/suite/components/File";
import KeywordSuite from '@/views/design/editor/tree-detail/suite/components/KeywordSuite';
import TestSuite from '@/views/design/editor/tree-detail/suite/components/TestSuite';
import { fetchFileContent, saveFileContent } from "@/api/file";

export default {
  name: 'SuiteDetail',
  components: {
    TestSuite,
    Const,
    File,
    KeywordSuite,
  },
  computed: {
    isTestSuite() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.TESTCASE
    },
    isConst() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.VARIABLE
    },
    isFile() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.PROJECTFILE
    },
    isKeywordSuite() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.KEYWORD
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const detailType = this.$store.state.tree.detailType
        if (detailType !== NODE.DetailType.SUITE) {
          return
        }
        const nodeInfo = this.$store.state.tree.selectedNode
        if (JSON.stringify(nodeInfo) === '{}') {
          return
        }
        if (this.isConst || this.isFile) {
          this.getFileInfo(nodeInfo['meta']['id'])
        }
        if (this.isTestSuite) {
          this.testSuiteData.document = nodeInfo['meta']['document']
          this.testSuiteData.fixture = nodeInfo['meta']['extra_data'][NODE.ExtraDataKey.FIXTURE]
          this.testSuiteData.variable = nodeInfo['meta']['extra_data'][NODE.ExtraDataKey.VARIABLE]
        }
        if (this.isKeywordSuite) {
          this.keywordSuiteData.document = nodeInfo['meta']['document']
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      fileData: {},
      keywordSuiteData: {},
      testSuiteData: {}
    }
  },
  methods: {
    getFileInfo(suiteId) {
      fetchFileContent(suiteId).then(response => {
        this.fileData = response.data
      })
    },
    saveFileInfo(params) {
      saveFileContent(params).then(response => {
        this.fileData = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
