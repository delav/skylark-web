<template>
  <div class="case-tree">
    <div class="check-header">
      <div class="priority-checkbox">
        <span>用例级别</span>
        <el-checkbox-group
          @change="handleCheck"
        >
          <el-checkbox v-for="(item, index) in shortcutOptions['priorityList']" :key="index" :label="item.name">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="tag-checkbox">
        <span>用例标签</span>
        <el-checkbox-group
          @change="handleCheck"
        >
          <el-checkbox v-for="(item, index) in shortcutOptions['tagList']" :key="index" :label="item.name">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
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
      <el-button>取消</el-button>
      <el-button @click="confirmCheck">确认</el-button>
    </div>
  </div>
</template>

<script>
import tree from 'vue-giant-tree-3'
import NODE from '@/constans/node'
import axios from 'axios'
import { fetchTagsByProject } from '@/api/tag'
import { fetchPriorities } from '@/api/priority'

export default {
  name: 'CaseTree',
  components: {
    tree,
  },
  props: {
    projectId: Number,
    treeArray: Array,
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
      },
      zTreeObj: null,
      shortcutOptions: {}
    }
  },
  created() {
    this.getShortcutOptions()
  },
  methods: {
    zTreeOnCreated(zTreeObj) {
      this.zTreeObj = zTreeObj
      console.log(this.zTreeObj.getNodes())
    },
    getShortcutOptions() {
      axios.all([fetchTagsByProject(this.projectId), fetchPriorities()]).then(
        axios.spread((r1, r2) => {
          this.shortcutOptions = {
            'tagList': r1.data,
            'priorityList': r2.data
          }
        })
      )
    },
    handleCheck(value) {
      console.log(value)
    },
    confirmCheck() {
      const params = {}
      const checkedCases = this.zTreeObj.getNodesByFilter(function (node) {
        return node.checked === true && node.desc === NODE.NodeDesc.CASE
      }, false)
      console.log(checkedCases)
      let caseIdStrings = ''
      for (let i = 0; i < checkedCases.length; i++) {
        const caseId = checkedCases[i].mid
        if (i !== checkedCases.length - 1) {
          caseIdStrings += caseId + ','
          continue
        }
        caseIdStrings += caseId
      }
      params['count'] = checkedCases.length
      params['cases'] = caseIdStrings
      params['options'] = this.shortcutOptions
      console.log(params)
      this.$emit('confirmAction', params)
    }
  }
}
</script>

<style lang="scss" scoped>
.case-tree {
  min-width: 300px;
}
</style>
