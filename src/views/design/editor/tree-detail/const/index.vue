<template>
  <div class="const">
    <div class="const-config">
      <div class="content">
        <div class="env-header">
          <span>环境：</span>
          <el-select class="head-selector" v-model="fileEnv" placeholder="env">
            <el-option
              v-for="(item, index) in containNullEnvList"
              :key="index"
              :label="item['name']"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="region-header" v-if="showRegion">
          <span>地区：</span>
          <el-select class="head-selector" v-model="fileRegion" placeholder="region">
            <el-option
              v-for="(item, index) in containNullRegionList"
              :key="index"
              :label="item['name']"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="file-editor">
          <el-button v-if="!editMode" type="info" @click="editFileContent" plain>编辑</el-button>
          <el-button v-else type="info" @click="restoreFileContent" plain>取消</el-button>
          <el-button type="info" @click="saveFileContent" plain>保存</el-button>
        </div>
      </div>
    </div>
    <div class="code-viewer">
      <el-input type="textarea" :disabled="!editMode" v-model="fileText" rows="30"></el-input>
    </div>
  </div>
</template>

<script>
import { saveFileContent } from "@/api/file";
import { guid } from "@/utils/other";

export default {
  name: 'Const',
  data() {
    return {
      containNullEnvList: [
        { id: 0, name: 'ALL' }
      ],
      containNullRegionList: [
        { id: 0, name: 'ALL' }
      ],
      fileEnv: 0,
      fileRegion: 0,
      fileText: '',
      editMode: false
    }
  },
  computed: {
    showRegion() {
      return this.$store.state.base.showRegion
    }
  },
  watch: {
    '$store.state.file.syncFileFlag': {
      handler() {
        const fileObject = this.$store.state.file.fileContent
        if (JSON.stringify(fileObject) === '{}') return
        this.fileEnv = fileObject['env_id']
        this.fileRegion = fileObject['region_id']
        this.fileText = fileObject['file_text']
      },
      immediate: true
    }
  },
  created() {
    const envs = this.$store.state.base.envList
    this.containNullEnvList.push(...envs)
    const regions = this.$store.state.base.regionList
    this.containNullRegionList.push(...regions)
  },
  methods: {
    editFileContent() {
      const fileObject = this.$store.state.file.fileContent
      const editMode = fileObject['edit_file'] && true
      if (!editMode) {
        this.$message.warning('该文件不允许编辑')
        return
      }
      this.editMode = editMode
    },
    saveFileContent() {
      const params = this.$store.state.file.fileContent
      if (params['env_id'] === 0) {
        delete params['env_id']
      }
      if (params['region_id'] === 0) {
        delete params['region_id']
      }
      let nodeList = []
      let node = this.$store.state.tree.selectedNode
      params['suite_id'] = node.mid
      params['file_name'] = node.name
      params['file_text'] = this.fileText
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
        this.$store.commit('file/SET_FILE_CONTENT', response.data)
        this.editMode = false
        this.$store.commit('file/SET_FILE_SYNC_FLAG', guid())
      })
    },
    restoreFileContent() {
      this.editMode = false
      this.$store.commit('file/SET_FILE_SYNC_FLAG', guid())
    }
  }
}
</script>

<style lang="scss" scoped>
.const {
  width: 100%;
  height: 100%;
  .const-config {
    width: 100%;
    .content {
      margin: 5px;
      display: flex;
      flex-flow: row wrap;
      .env-header {

      }
      .region-header {
        margin-left: 15px;
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
}
:deep(.el-textarea.is-disabled) {
  cursor: auto;
  .el-textarea__inner {
    cursor: auto;
  }
}
</style>
