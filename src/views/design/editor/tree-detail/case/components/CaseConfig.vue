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
                oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
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
          <div class="detail-item">
            <span class="item-title">执行序号：</span>
            <div class="item-content">
              <el-input
                @change="saveCaseOrder"
                v-model.number="orderNumber"
                oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                placeholder="Please input"
                class="input-with-select"
              >
              </el-input>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>

export default {
  name: 'CaseConfig',
  props: {
    caseExtra: Object
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
    caseExtra: {
      handler(val) {
        this.caseInfo = val
        this.initCaseExtraData()
      },
      deep: true,
      immediate: true
    },
  },
  data() {
    return {
      activeDetail: '',
      caseInfo: this.caseExtra,
      selectTags: [],
      cacheSelect: '',
      timeUnitList: [
        {label: '秒', value: 'seconds'},
        {label: '分', value: 'minutes'}
      ],
      timeNum: '',
      timeUnit: '',
      priorityName: '',
      orderNumber: ''
    }
  },
  methods: {
    initCaseExtraData() {
      this.handlerPriority(this.caseInfo.priority_id)
      this.handlerTags(this.caseInfo.tag)
      this.handlerOrder(this.caseInfo.order)
      this.handlerTimeout(this.caseInfo.timeout)
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
    handlerOrder(orderNumber) {
      if (orderNumber) {
        this.orderNumber = orderNumber
      }
    },
    saveCaseDoc() {
      const params = {'document': this.caseInfo.document}
      this.$emit('update', params)
    },
    savePriority() {
      const params = {'priority_id': this.caseInfo.priority_id}
      this.$emit('update', params)
    },
    saveCaseTimeout() {
      const timeout = this.timeNum + ' ' + this.timeUnit
      const params = {'timeout': timeout}
      this.$emit('update', params)
    },
    saveCaseOrder() {
      const params = {'order': this.orderNumber}
      this.$emit('update', params)
    },
    addCaseTag(values) {
      const cacheTags = JSON.parse(this.cacheSelect)
      // not new tag add
      if (cacheTags.length >= values.length) {
        return
      }
      const params = {
        operate: 'add',
        tagName: values.pop()
      }
      this.$emit('updateTag', params)
    },
    deleteCaseTag(tagName) {
      const params = {
        operate: 'del',
        tagName: tagName
      }
      this.$emit('updateTag', params)
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
