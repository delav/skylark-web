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
          <el-button size="small" v-if="!editMode" type="primary" @click="editFileContent" plain>编辑</el-button>
          <el-button size="small" v-else type="primary" @click="restoreFileContent" plain>取消</el-button>
          <el-button size="small" type="primary" @click="saveFileContent" plain>保存</el-button>
        </div>
      </div>
    </div>
    <div class="code-edit">
<!--      <el-input type="textarea" :disabled="!editMode" v-model="fileObject.file_text" rows="30"></el-input>-->
      <codemirror
        v-model="fileObject.file_text"
        :style="{ height: '100%'}"
        :disabled="!editMode"
        :indent-with-tab="true"
        :tab-size="tabSize"
        :extensions="extensions"
      />
    </div>
  </div>
</template>

<script>
import { isJsonString } from "@/utils/other";
import { fetchFileContent, saveFileContent } from "@/api/file";
import { Codemirror } from "vue-codemirror";
// import { oneDark } from "@codemirror/theme-one-dark";
import { python } from "@codemirror/lang-python";
import { json } from "@codemirror/lang-json";
import { StreamLanguage } from "@codemirror/language";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";

export default {
  name: 'Const',
  components: {
    Codemirror
  },
  data() {
    return {
      cmMode: 'python',
      tabSize: 4,
      extensions: [python()],
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
        this.fileObject = this.handlerFileContent(response.data)
      })
    },
    handlerFileContent(fileObj) {
      if (fileObj['env_id'] === null) {
        fileObj['env_id'] = 0
      }
      if (fileObj['region_id'] === null) {
        fileObj['region_id'] = 0
      }
      const suffix = fileObj['file_suffix']
      if (suffix === '.py') {
        this.cmMode = 'python'
        this.tabSize = 4
        this.extensions = [python()]
      } else if (suffix === '.json') {
        const jsonFormat = JSON.parse(fileObj['file_text'])
        fileObj['file_text'] = JSON.stringify(jsonFormat, null, 4)
        this.cmMode = 'json'
        this.tabSize = 2
        this.extensions = [json()]
      } else if (suffix === '.yaml') {
        this.cmMode = 'yaml'
        this.tabSize = 2
        this.extensions = [StreamLanguage.define(yaml)]
      }
      return fileObj
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
      let node = this.$store.state.tree.selectedNode
      params['suite_id'] = node.mid
      params['file_text'] = this.fileObject.file_text
      if (this.cmMode === 'json') {
        const formatJson = this.fileObject.file_text.replace(/\s/g, '')
        const isJson = isJsonString(formatJson)
        if (!isJson) {
          this.$message.error('json格式错误')
          return
        }
        params['file_text'] = formatJson
      }
      saveFileContent(params).then(response => {
        this.fileObject = this.handlerFileContent(response.data)
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
    border-bottom: 1px solid #dcdfe6;
    //border-radius: 4px;
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
  .code-edit {
    overflow-y: auto;
  }
}
</style>
