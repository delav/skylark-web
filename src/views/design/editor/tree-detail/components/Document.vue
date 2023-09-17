<template>
  <div class="document">
    <div class="cate-document">
      <div class="disabled-content" @dblclick="editDocument" v-if="inputDisabled">
        <p class="document-text">
          {{ !documentStr?'Document':documentStr }}
        </p>
      </div>
      <div class="activate-content" v-else>
        <el-input
          v-model="documentStr"
          :rows="3"
          type="textarea"
          @blur="saveDocument"
          placeholder="Document"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import { updateDir } from "@/api/dir";
import { updateSuite } from "@/api/suite";
import { updateCase } from "@/api/case";

export default {
  name: 'Document',
  props: {
    cateDocument: String
  },
  watch: {
    cateDocument: {
      handler(val) {
        this.documentStr = val
      },
      immediate: true
    }
  },
  data() {
    return {
      inputDisabled: true,
      documentStr: '',
      rawDocument: ''
    }
  },
  methods: {
    getModuleFunc(params) {
      const selectedNode = this.$store.state.tree.selectedNode
      const moduleId = selectedNode.meta.id
      if (selectedNode.desc === NODE.NodeDesc.SUITE) {
        return updateSuite(moduleId, params)
      } else if (selectedNode.desc === NODE.NodeDesc.DIR) {
        return updateDir(moduleId, params)
      } else if (selectedNode.desc === NODE.NodeDesc.CASE) {
        return updateCase(moduleId, params)
      }
      return null
    },
    editDocument() {
      this.inputDisabled = false
      this.rawDocument = this.documentStr
    },
    cancelEdit() {
      this.inputDisabled = true
    },
    saveDocument() {
      const params = {'document': this.documentStr}
      if (this.rawDocument === this.documentStr){
        this.inputDisabled = true
        return
      }
      const postFunc = this.getModuleFunc(params)
      if (postFunc === null) {
        this.inputDisabled = true
        return
      }
      postFunc.then((response) => {
        this.inputDisabled = true
        this.documentStr = response.data.document
        this.updateTreeNode('document', this.documentStr)
      }).catch(() => {
        this.inputDisabled = false
      })
    },
    updateTreeNode(document, dataValue) {
      const selectedNode = this.$store.state.tree.selectedNode
      selectedNode.meta[document] = dataValue
      const treeId = this.$store.state.tree.treeId
      const treeObj = $.fn.zTree.getZTreeObj(treeId)
      treeObj.updateNode(selectedNode)
      this.$store.commit('tree/SET_SELECT_NODE', selectedNode)
    },
  }
}
</script>

<style lang="scss" scoped>
.document {
  width: 100%;
  height: 73px;
  .cate-document {
    height: 100%;
    .disabled-content {
      height: 100%;
      border-radius: 4px;
      border: 1px solid #e4e7ed;
      background-color: #f5f7fa;
      .document-text {
        padding: 5px 11px;
        margin: 0;
        color: #a9a9a9;
        font-size: 14px;
      }
    }
  }
}
:deep(.el-input.is-disabled) {
  cursor: auto;
  .el-input__inner {
    cursor: auto;
  }
}
:deep(.el-textarea) {
  cursor: auto;
  .el-textarea__inner {
    cursor: auto;
    border-radius: 4px;
  }
}
</style>
