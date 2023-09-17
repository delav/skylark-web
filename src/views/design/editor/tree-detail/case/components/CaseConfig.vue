<template>
  <div class="case-config">
    <el-collapse v-model="activeDetail" accordion>
      <el-collapse-item name="1">
        <template #title>
          <div v-if="activeDetail!=='1'" class="collapse-title">
            <span class="title-pri">{{ priorityName }}</span>
            <el-tag
              class="title-tag"
              v-for="(tagName, index) in selectTags"
              :key="index"
            >
              {{ tagName }}
            </el-tag>
          </div>
          <div v-else class="collapse-title"></div>
        </template>
        <div class="config-detail">
          <div class="detail-item">
            <span class="item-title">用例说明：</span>
            <div class="item-content">
              <el-input
                @change="saveCaseDoc"
                v-model="caseInfo.document"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="Test Case Document"
              />
            </div>
          </div>
          <div class="detail-item">
            <span class="item-title">用例级别：</span>
            <div class="item-content">
              <el-select v-model="caseInfo.priority_id" @change="savePriority" placeholder="Select">
                <el-option
                  v-for="item in priorityList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
          <div class="detail-item">
            <span class="item-title">用例标签：</span>
            <div class="item-content">
              <el-select
                style="width: 100%;"
                v-model="selectTags"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                @change="addCaseTag"
                @remove-tag="deleteCaseTag"
                placeholder="选择标签"
              >
                <el-option
                  v-for="(item, index) in tagList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </div>
          </div>
          <div class="detail-item">
            <span class="item-title">超时时间：</span>
            <div class="item-content">
              <el-input
                @change="saveCaseTimeout"
                v-model="timeNum"
                placeholder="Please input"
                class="input-with-select"
              >
                <template #append>
                  <el-select @change="saveCaseTimeout" v-model="timeUnit" placeholder="Select" style="width: 80px">
                    <el-option
                      v-for="(item, index) in timeUnitList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import { createTag, deleteTag } from "@/api/tag";
import { updateCase } from "@/api/case";

export default {
  name: 'CaseConfig',
  data() {
    return {
      activeDetail: '',
      caseInfo: {},
      selectTags: [],
      cacheSelect: '',
      timeUnitList: [
        {label: '秒', value: 'seconds'},
        {label: '分', value: 'minutes'}
      ],
      timeNum: '',
      timeUnit: '',
      priorityName: ''
    }
  },
  computed: {
    tagList() {
      return this.$store.state.scalar.projectTags
    },
    priorityList() {
      return this.$store.state.scalar.priorities
    },
    priorityMap() {
      return this.$store.state.scalar.priorityMap
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const category = this.$store.state.tree.nodeCategory
        const detailType = this.$store.state.tree.detailType
        if (detailType === NODE.DetailType.CASE && category === NODE.NodeCategory.TESTCASE) {
          this.initCaseData()
        }
      },
      immediate: true
    },
  },
  methods: {
    initCaseData() {
      Object.assign(this.$data, this.$options.data())
      const nodeInfo = this.$store.state.tree.selectedNode
      if (JSON.stringify(nodeInfo) === '{}') {
        return
      }
      this.caseInfo = nodeInfo['meta']
      this.handlerTimeout(this.caseInfo.timeout)
      this.handlerPriority(this.caseInfo.priority_id)
      this.handlerTags(this.caseInfo['extra_data'][NODE.ExtraDataKey.TAG])
    },
    handlerTags(itemTags) {
      if (!itemTags) {
        return
      }
      const tagNames = []
      for (let i = 0; i < itemTags.length; i++) {
        tagNames.push(itemTags[i].name)
      }
      this.selectTags = tagNames
      this.cacheSelect = JSON.stringify(this.selectTags)
    },
    handlerTimeout(timeoutStr) {
      if (!timeoutStr) {
        return
      }
      const numUnit = timeoutStr.split(' ')
      if (numUnit.length !== 2) {
        return
      }
      this.timeNum = numUnit[0]
      this.timeUnit = numUnit[1]
    },
    handlerPriority(priorityId) {
      if (priorityId in this.priorityMap) {
        this.priorityName = this.priorityMap[priorityId]
      }
    },
    updateTreeNode() {
      const treeId = this.$store.state.tree.treeId
      const treeObj = $.fn.zTree.getZTreeObj(treeId)
      const caseNode = this.$store.state.tree.selectedNode
      caseNode['meta'] = this.caseInfo
      treeObj.updateNode(caseNode)
      this.$store.commit('tree/SET_SELECT_NODE', caseNode)
    },
    saveCaseDoc() {
      const params = {'document': this.caseInfo.document}
      updateCase(this.caseInfo.id, params).then((response) => {
        this.caseInfo.document = response.data.document
        this.updateTreeNode()
      })
    },
    savePriority() {
      const params = {'priority_id': this.caseInfo.priority_id}
      updateCase(this.caseInfo.id, params).then((response) => {
        const newPriorityId = response.data.priority_id
        this.handlerPriority(newPriorityId)
        this.caseInfo.priority_id = newPriorityId
        this.updateTreeNode()
      })
    },
    saveCaseTimeout() {
      const timeout = this.timeNum + ' ' + this.timeUnit
      const params = {'timeout': timeout}
      updateCase(this.caseInfo.id, params).then((response) => {
        const timeoutStr = response.data.timeout
        this.caseInfo.timeout = timeoutStr
        this.handlerTimeout(timeoutStr)
        this.updateTreeNode()
      })
    },
    addCaseTag(values) {
      const cacheTags = JSON.parse(this.cacheSelect)
      // add operate
      if (cacheTags.length < values.length) {
        const newAddItem = values.pop()
        this.createCaseTag(newAddItem)
      }
    },
    deleteCaseTag(tagName) {
      const caseTagList = this.caseInfo['extra_data'][NODE.ExtraDataKey.TAG]
      const tagItem = caseTagList.find(item => item.name === tagName)
      if (tagItem === undefined) {
        return
      }
      const tagId = tagItem.id
      deleteTag(tagId).then(() => {
        this.cacheSelect = JSON.stringify(this.selectTags)
        this.caseInfo['extra_data'][NODE.ExtraDataKey.TAG] = caseTagList.filter(function (item) {
          return item.id !== tagId
        })
        this.updateTreeNode()
      })
    },
    createCaseTag(newName) {
      const params = {
        'project_id': this.$store.state.tree.projectId,
        'name': newName,
        'module_id': this.caseInfo.id,
        'module_type': NODE.ModuleType.CASE
      }
      createTag(params).then((response) => {
        const newCaseTag = response.data
        this.updateTagCache({id: newCaseTag.id, name: newCaseTag.name})
        this.selectTags.push(newCaseTag.name)
        this.cacheSelect = JSON.stringify(this.selectTags)
        this.caseInfo['extra_data'][NODE.ExtraDataKey.TAG].push(newCaseTag)
        this.updateTreeNode()
        // const projectId = this.$store.state.tree.projectId
        // fetchTagsByProject(projectId).then(response => {
        //   this.$store.commit('tree/SET_PROJECT_TAGS', response.data)
        // })
      })
    },
    updateTagCache(tagItem) {
      const tagArray = this.tagList
      const exist = tagArray.find(item => item.name === tagItem.name)
      if (exist === undefined) {
        tagArray.push(tagItem)
        this.$store.commit('scalar/SET_PROJECT_TAGS', tagArray)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.case-config {
  width: 100%;
  .collapse-title {
    .title-pri {
      color: $mainColor;
      font-size: 15px;
      margin-right: 15px;
    }
    .title-tag {
      margin-left: 5px;
    }
  }
  .config-detail {
    width: 100%;
    padding: 5px;
    .detail-item {
      display: flex;
      padding-bottom: 5px;
      .item-title {
        width: 80px;
        line-height: 32px;
      }
      .item-content {
        width: calc(100% - 80px);
      }
    }
  }
}
:deep(.el-collapse) {
  box-sizing: border-box;
  padding-left: 10px;
  border: none;
  .collapse-title {
    flex: 1 0 90%;
    order: 1;
    height: 40px;
    line-height: 40px;
  }
  .el-collapse-item__header {
    height: 40px;
    border: none;
    background-color: transparent;
  }
  .el-collapse-item__wrap {
    background-color: transparent;
    border: none;
    .el-collapse-item__content {
      padding: 0;
    }
  }
}
</style>
