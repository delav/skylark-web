<template>
  <div class="const">
    <div class="const-config">
      <div class="content">
        <div class="env-header">
          <span class="env-desc">环境</span>
          <el-tooltip
            popper-class="custom-tooltip"
            placement="top-start"
            effect="dark"
            :content="envDesc"
          >
            <svg-icon class="env-tip" icon-class="question"></svg-icon>
          </el-tooltip>
          <span>：</span>
          <el-select size="small" class="head-selector" v-model="fileObject.env_id" placeholder="env">
            <el-option
              v-for="(item, index) in allEnvList"
              :key="index"
              :label="item['name']"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="region-header" v-if="showRegion">
          <span class="region-desc">地区</span>
          <el-tooltip
            popper-class="custom-tooltip"
            placement="top-start"
            effect="dark"
            :content="regionDesc"
          >
            <svg-icon class="region-tip" icon-class="question"></svg-icon>
          </el-tooltip>
          <span>：</span>
          <el-select size="small" class="head-selector" v-model="fileObject.region_id" placeholder="region">
            <el-option
              v-for="(item, index) in allRegionList"
              :key="index"
              :label="item['name']"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="file-editor">
          <el-button size="small" v-if="!editMode" type="info" @click="editFileContent" plain>编辑</el-button>
          <el-button size="small" v-else type="info" @click="restoreFileContent" plain>取消</el-button>
          <el-button size="small" type="info" @click="saveFileContent" plain>保存</el-button>
        </div>
      </div>
    </div>
    <div class="code-editor">
      <el-input type="textarea" :disabled="!editMode" v-model="fileObject.file_text" rows="30"></el-input>
    </div>
  </div>
</template>

<script>
import { fetchFileContent, saveFileContent } from "@/api/file";

export default {
  name: 'Const',
  data() {
    return {
      fileObject: {
        env_id: 0,
        region_id: 0,
        file_text: '',
      },
      editMode: false,
      rawContent: '',
      envDesc: '文件默认所有环境可用，指定环境后，其他环境将无法使用该文件的变量',
      regionDesc: '文件默认所有地区可用，指定地区后，其他地区将无法使用该文件的变量'
    }
  },
  computed: {
    allEnvList() {
      return this.$store.state.base.containAllEnvList
    },
    allRegionList() {
      return this.$store.state.base.containAllRegionList
    },
    showRegion() {
      return this.$store.state.base.showRegion
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const nodeInfo = this.$store.state.tree.selectedNode
        if (JSON.stringify(nodeInfo) === '{}') {
          return
        }
        this.getFileContent(nodeInfo['meta']['id'])
      },
      immediate: true
    },
  },
  methods: {
    getFileContent(suiteId) {
      fetchFileContent(suiteId).then(response => {
        const fileRes = response.data
        if (fileRes['env_id'] === null) {
          fileRes['env_id'] = 0
        }
        if (fileRes['region_id'] === null) {
          fileRes['region_id'] = 0
        }
        this.fileObject = fileRes
      })
    },
    editFileContent() {
      const editMode = this.fileObject['edit_file'] && true
      if (!editMode) {
        this.$message.warning('该文件不允许编辑')
        return
      }
      this.rawContent = this.fileObject.file_text
      this.editMode = editMode
    },
    saveFileContent() {
      const params = {}
      if (this.fileObject['env_id'] !== 0) {
        params['env_id'] = this.fileObject['env_id']
      }
      if (this.fileObject['region_id'] !== 0) {
        params['region_id'] = this.fileObject['region_id']
      }
      let nodeList = []
      let node = this.$store.state.tree.selectedNode
      params['suite_id'] = node.mid
      params['file_name'] = node.name
      params['file_text'] = this.fileObject.file_text
      node = node.getParentNode()
      while (node !== null) {
        nodeList.push(node.name)
        node = node.getParentNode()
      }
      nodeList.push(this.$store.state.tree.projectName)
      let fullPath = ''
      for (let i = nodeList.length-1; i >= 0; i--) {
        fullPath = fullPath + '/' + nodeList[i]
      }
      params['file_path'] = fullPath
      saveFileContent(params).then(response => {
        const fileRes = response.data
        if (fileRes['env_id'] === null) {
          fileRes['env_id'] = 0
        }
        if (fileRes['region_id'] === null) {
          fileRes['region_id'] = 0
        }
        this.fileObject = fileRes
        this.editMode = false
      })
    },
    restoreFileContent() {
      this.fileObject.file_text = this.rawContent
      this.editMode = false
    }
  }
}
</script>

<style lang="scss" scoped>
.const {
  width: 100%;
  height: 100%;
  padding: 5px;
  .const-config {
    width: 100%;
    margin-bottom: 5px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    .content {
      display: flex;
      padding: 5px;
      flex-flow: row wrap;
      align-items: flex-start;
      justify-content: left;
      .env-header {
        color: #555555;
        font-size: 14px;
      }
      .region-header {
        color: #555555;
        margin-left: 15px;
        font-size: 14px;
      }
      .file-editor {
        margin-left: auto;
      }
    }
    .head-selector {
      width: 150px;
      min-width: 100px;
    }
  }
  .code-editor {
    overflow-y: auto;
  }
}
:deep(.el-textarea.is-disabled) {
  cursor: auto;
  .el-textarea__inner {
    cursor: auto;
  }
}
</style>
