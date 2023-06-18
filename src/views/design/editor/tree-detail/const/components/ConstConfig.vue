<template>
  <div class="const-config">
    <div class="content">
      <div class="env-header">
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
        <el-select class="head-selector" v-model="fileRegion" placeholder="region">
          <el-option
            v-for="(item, index) in containNullRegionList"
            :key="index"
            :label="item['name']"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="file-type">
        <el-select class="head-selector" v-model="fileType" placeholder="file type" disabled >
          <el-option
            v-for="(item, index) in fileTypeList"
            :key="index"
            :label="item['name']"
            :value="item['name']"
          />
        </el-select>
      </div>
      <div class="file-editor">
        <el-button type="info" @click="editFileContent" plain>编辑</el-button>
        <el-button type="info" @click="saveFileContent" plain>保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { saveFileContent } from "@/api/file";

export default {
  name: 'ConstConfig',
  data() {
    return {
      containNullEnvList: [
        { id: 0, name: 'None' }
      ],
      containNullRegionList: [
        { id: 0, name: 'None' }
      ],
      fileEnv: '',
      fileRegion: '',
      fileType: '',
      fileEdit: true,
      fileTypeList: [
        { name: '.py' },
        { name: '.java' }
      ]
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
        this.fileType = fileObject['file_suffix']
        this.fileEdit = fileObject['edit_file']
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
      const editMode = this.fileEdit && true
      if (!editMode) {
        this.$message.warning('File not allowed edit')
        return
      }
      this.$store.commit('file/SET_EDIT_MODE', editMode)
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
        this.$store.commit('file/SET_EDIT_MODE', false)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.const-config {
  width: 100%;
  height: 100%;
  .content {
    display: flex;
    flex-flow: row wrap;
  }
  .head-selector {
    width: 150px;
    min-width: 100px;
  }
}
</style>
