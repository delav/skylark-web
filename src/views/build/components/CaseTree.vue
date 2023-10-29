<template>
  <div class="case-tree">
    <div class="check-header">
      <div class="auto-select">
        <span class="select-label">
          自动全选
          <el-tooltip
            class="box-item"
            effect="dark"
            content="推荐使用。开启后，将自动执行该项目分支下所有的最新测试用例"
            placement="left-start"
          >
            <el-icon style="vertical-align: -12%" size="15px" color="#bfcbd9"><QuestionFilled /></el-icon>
          </el-tooltip>：
        </span>
        <el-switch
          v-model="caseLatest"
          @change="changeAutoSelect"
          active-text="开启"
          inactive-text="关闭"
        />
      </div>
      <div class="priority-checkbox">
        <span class="priority-label">级别筛选</span>
        <el-checkbox-group
          v-model="checkedPriList"
          @change="quickCheck"
        >
          <el-checkbox v-for="(item, index) in shortcutOptions['priList']" :key="index" :label="item.id">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="tag-checkbox">
        <span class="tag-label">标签筛选</span>
        <el-checkbox-group
          v-model="checkedTagList"
          @change="quickCheck"
        >
          <el-checkbox v-for="(item, index) in shortcutOptions['tagList']" :key="index" :label="item.name">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="check-info">
      <p class="content">
        <span>已选用例：</span>
        <span>{{selectCases}}/{{totalCases}}</span>
      </p>
    </div>
    <div class="checker">
      <tree
        ref="zTree"
        :setting="zTreeSetting"
        :nodes="treeArray"
        @onCreated="zTreeOnCreated">
      </tree>
    </div>
    <div class="check-footer">
      <el-button @click="cancelCheck">取消</el-button>
      <el-button type="primary" @click="confirmCheck">确定</el-button>
    </div>
  </div>
</template>

<script>
import tree from "@/components/GiantTree";
import NODE from "@/constans/node";
import axios from "axios";
import { fetchTagsByProject } from "@/api/tag";
import { fetchPriorities } from "@/api/priority";

export default {
  name: 'CaseTree',
  components: {
    tree,
  },
  props: {
    projectId: Number,
    treeArray: Array,
    checkedCases: Array,
    autoLatest: Boolean
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
          onCheck: this.countCheckedCases,
        }
      },
      caseLatest: false,
      zTreeObj: null,
      totalCases: 0,
      selectCases: 0,
      shortcutOptions: {
        'priList': [],
        'tagList': []
      },
      checkedPriList: [],
      checkedTagList: []
    }
  },
  created() {
    this.getShortcutOptions()
    this.caseLatest = this.autoLatest? this.autoLatest:false
  },
  methods: {
    zTreeOnCreated(zTreeObj) {
      this.zTreeObj = zTreeObj
      const caseNodes = this.zTreeObj.getNodesByFilter(function (node) {
        return node.desc === NODE.NodeDesc.CASE
      }, false)
      this.totalCases = caseNodes.length
      if (this.checkedCases.length === 0) {
        return
      }
      this.selectCases = this.checkedCases.length
      for (let i = 0; i < caseNodes.length; i++) {
        const caseId = caseNodes[i]['mid']
        if (this.checkedCases.indexOf(caseId) === -1 && !this.autoLatest) {
          continue
        }
        this.zTreeObj.checkNode(caseNodes[i], true, true)
      }
    },
    getShortcutOptions() {
      axios.all([fetchTagsByProject(this.projectId), fetchPriorities()]).then(
        axios.spread((r1, r2) => {
          this.shortcutOptions = {
            'tagList': r1.data,
            'priList': r2.data
          }
        })
      )
    },
    changeAutoSelect(flag) {
      if (flag) {
        this.zTreeObj.checkAllNodes(flag)
        this.countCheckedCases()
      }
    },
    countCheckedCases() {
      const checkedCases = this.zTreeObj.getNodesByFilter(function (node) {
        return node.checked === true && node.desc === NODE.NodeDesc.CASE
      }, false)
      this.selectCases = checkedCases.length
    },
    quickCheck() {
      const caseNodes = this.zTreeObj.getNodesByFilter(function (node) {
        return node.desc === NODE.NodeDesc.CASE
      }, false)
      let checkPriFlag = false
      let checkTagFlag = false
      if (this.checkedPriList.length !== 0) {
        checkPriFlag = true
      }
      if (this.checkedTagList.length !== 0) {
        checkTagFlag = true
      }
      for (let i = 0; i < caseNodes.length; i++) {
        const node = caseNodes[i]
        let checkNodeFlag = false
        if (checkPriFlag && checkTagFlag) {
          checkNodeFlag = this.isContainPri(node.extra['pri'], this.checkedPriList)
            && this.isContainTag(node.extra['tag'], this.checkedTagList)
        } else if (checkPriFlag && !checkTagFlag) {
          checkNodeFlag = this.isContainPri(node.extra['pri'], this.checkedPriList)
        } else if (!checkPriFlag && checkTagFlag) {
          checkNodeFlag = this.isContainTag(node.extra['tag'], this.checkedTagList)
        }
        if (checkNodeFlag) {
          this.zTreeObj.checkNode(node, true, true)
        } else {
          this.zTreeObj.checkNode(node, false, true)
        }
      }
      this.countCheckedCases()
    },
    isContainPri(casePri, checkPris) {
      return checkPris.indexOf(casePri) !== -1
    },
    isContainTag(caseTags, checkTags) {
      for (let j = 0; j < caseTags.length; j++) {
        const  caseTag = caseTags[j]
        if (checkTags.indexOf(caseTag) !== -1) {
          return true
        }
      }
      return false
    },
    cancelCheck() {
      this.$emit('cancel')
    },
    confirmCheck() {
      const checkedCases = this.zTreeObj.getNodesByFilter(function (node) {
        return node.checked === true && node.desc === NODE.NodeDesc.CASE
      }, false)
      let caseIdList = []
      for (let i = 0; i < checkedCases.length; i++) {
        const caseId = checkedCases[i]['mid']
        caseIdList.push(caseId)
      }
      const confirmData = {
        'caseList': caseIdList,
        'autoLatest': this.caseLatest,
        'totalCase': caseIdList.length
      }
      this.$emit('confirm', confirmData)
    }
  }
}
</script>

<style lang="scss" scoped>
.case-tree {
  min-width: 300px;
  .check-header {
    margin-bottom: 10px;
    //background-color: #f4f5f7;
    //padding: 0 5px;
    .auto-select {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 10px;
      .select-label {
        font-size: 15px;
        padding-right: 10px;
        padding-bottom: 3px;
      }
    }
    .priority-checkbox {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .priority-label {
        width: 75px;
        font-size: 14px;
        flex-shrink: 0;
      }
    }
    .tag-checkbox {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .tag-label {
        width: 75px;
        font-size: 14px;
        flex-shrink: 0;
      }
    }
  }
  .check-info {
    padding: 10px 0 5px 0;
    .content {
      margin: 0;
      font-size: 13px;
    }
  }
  .checker {
    padding: 5px;
    border: 1px solid #e4e7ed;
    min-height: 150px;
  }
  .check-footer {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
:deep(.el-checkbox) {
  margin-right: 15px;
  height: 28px;
  .el-checkbox__label {
    padding-left: 5px;
  }
}
</style>
