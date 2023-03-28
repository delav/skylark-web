<template>
  <div class="case-tree">
    <div class="check-header">快捷选择</div>
    <div class="checker">
      <tree
        ref="zTree"
        :setting="zTreeSetting"
        :nodes="treeArray"
        @onCreated="zTreeOnCreated">
      </tree>
    </div>
    <div class="check-footer">
      <el-button>取消</el-button>
      <el-button>确认</el-button>
    </div>
  </div>
</template>

<script>
import tree from 'vue-giant-tree-3'
import NODE from '@/constans/node'

export default {
  name: 'CaseTree',
  components: {
    tree,
  },
  props: {
    treeArray: Array
  },
  data() {
    return {
      zTreeSetting: {
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: NODE.RootPId
          },
          keep: { parent: true }
        },
        view: {
          showIcon: false,
        },
        callback: {
          onCheck: this.zTreeOnCheck
        },
      },
      zTreeObj: null,
      checkedNodes: []
    }
  },
  methods: {
    zTreeOnCreated(zTreeObj) {
      this.zTreeObj = zTreeObj
    },
    zTreeOnCheck() {
      this.checkedNodes = this.zTreeObj.getCheckedNodes(true)
    },
    confirmCheck() {}
  }
}
</script>

<style lang="scss" scoped>
.case-tree {
  min-width: 300px;
}
</style>
