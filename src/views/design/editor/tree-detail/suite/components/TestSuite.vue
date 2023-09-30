<template>
  <div class="test-suite">
    <div class="document">
      <document :cate-document="suiteObject.document"/>
    </div>
    <div class="fixture-list">
      <el-collapse v-model="activeDetail" accordion>
        <el-collapse-item name="1">
          <template #title>
            <div class="collapse-title">编辑前置后置</div>
          </template>
          <fixture :cate-fixture="suiteObject.fixture"/>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="variable-list">
      <variable :variables="suiteObject.variable"/>
    </div>
  </div>
</template>

<script>
import Document from "@/views/design/editor/tree-detail/components/Document";
import Fixture from "@/views/design/editor/tree-detail/components/Fixture";
import Variable from '@/views/design/editor/tree-detail/components/Variable';

export default {
  name: 'TestSuite',
  components: {
    Document,
    Fixture,
    Variable,
  },
  props: {
    suiteInfo: Object
  },
  watch: {
    suiteInfo: {
      handler(val) {
        this.handlerSuiteInfo(val)
      },
      immediate: true
    },
  },
  data() {
    return {
      suiteObject: {
        document: '',
        fixture: {},
        variable: []
      },
      activeDetail: ''
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
.test-suite {
  width: 100%;
  height: 100%;
  padding: 5px;
  overflow-y: auto;
  .fixture-list {
    width: 100%;
    margin-top: 10px;
    .collapse-title {
      padding-left: 15px;
      color: #606266;
      font-size: 13px;
    }
  }
  .variable-list {
    width: 100%;
    margin-top: 10px;
  }
}
:deep(.el-collapse) {
  .el-collapse-item__header {
    border-radius: 0;
    box-shadow: 0 0 0 1px #e4e7ed;
    border-bottom: 0;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
    box-shadow: 0 0 0 1px #e4e7ed;
  }
  .el-collapse-item__content {
    padding: 0 5px 5px 5px;
  }
}
</style>
