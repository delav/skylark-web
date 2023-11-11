<template>
  <div class="notice-config">
    <div class="notice-header">
      <span class="item-label">项目：</span>
      <el-select
        class="project-selector"
        v-model="noticeForm.project_id"
        placement="bottom-start"
        placeholder="选择项目"
        :popper-append-to-body="false"
        @change="changeProject"
      >
        <el-option
          v-for="(item, index) in projectList"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="notice-body">
      <div class="card-body">
        <div class="notice-form" v-if="noticeForm.project_id!==''">
          <el-form
            ref="ruleFormRef"
            :model="noticeForm"
            :rules="formRules"
            label-width="120px"
            style="max-width: 800px"
            status-icon
          >
            <el-form-item label="企业群通知" prop="notice_switch">
              <el-switch
                v-model="noticeForm.notice_switch"
                inline-prompt
                style="--el-switch-on-color: #00acc1; --el-switch-off-color: #9DA3A4FF"
                active-text="开"
                inactive-text="关"
              />
            </el-form-item>
            <el-form-item label="群通知类型" prop="notice_mode">
              <el-radio-group v-model="noticeForm.notice_mode">
                <el-radio
                  v-for="(item, index) in noticeModeList"
                  :key="index"
                  :label="item.mode"
                >
                  {{ item['name'] }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="微信群Token" prop="wecom_token" v-show="noticeForm.notice_mode===1">
              <el-input v-model="noticeForm.wecom_token"></el-input>
            </el-form-item>
            <el-form-item label="钉钉群Token" prop="ding_token" v-show="noticeForm.notice_mode===2">
              <el-input v-model="noticeForm.ding_token"></el-input>
            </el-form-item>
            <el-form-item label="飞书群Token" prop="lark_token" v-show="noticeForm.notice_mode===3">
              <el-input v-model="noticeForm.lark_token"></el-input>
            </el-form-item>
            <el-form-item label="机器人关键词" prop="wecom_token" v-show="noticeForm.notice_mode===1">
              <el-input v-model="noticeForm.wecom_keyword"></el-input>
            </el-form-item>
            <el-form-item label="机器人关键词" prop="ding_keyword" v-show="noticeForm.notice_mode===2">
              <el-input v-model="noticeForm.ding_keyword"></el-input>
            </el-form-item>
            <el-form-item label="机器人关键词" prop="lark_keyword" v-show="noticeForm.notice_mode===3">
              <el-input v-model="noticeForm.lark_keyword"></el-input>
            </el-form-item>
            <el-form-item label="邮箱通知" prop="email_switch">
              <el-switch
                v-model="noticeForm.email_switch"
                inline-prompt
                style="--el-switch-on-color: #00acc1; --el-switch-off-color: #9DA3A4FF"
                active-text="开"
                inactive-text="关"
              />
            </el-form-item>
            <el-form-item label="接收邮箱地址" prop="rcv_email">
              <el-select
                style="width: 100%;"
                v-model="noticeForm.rcv_email"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder=" "
              >
                <el-option
                  v-for="(item, index) in userList"
                  :key="index"
                  :label="item.email"
                  :value="item.email"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="commitNotice">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotification, saveNotification } from "@/api/notify";

export default {
  name: 'Notice',
  computed: {
    projectList() {
      return this.$store.state.base.projectList
    },
    userList() {
      return this.$store.state.base.userList
    }
  },
  watch: {
    '$store.state.base.baseLoaded': {
      handler() {
        if (this.projectList.length !== 0 && this.noticeForm.project_id === '') {
          const globalProject = this.$store.state.base.globalProject
          if (globalProject !== '') {
            this.changeProject(globalProject)
          } else {
            this.changeProject(this.projectList[0]['id'])
          }
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      noticeForm: {
        'project_id': '',
        'notice_switch': false,
        'notice_mode': 1,
        'wecom_token': '',
        'wecom_keyword': '',
        'ding_token': '',
        'ding_keyword': '',
        'lark_token': '',
        'lark_keyword': '',
        'email_switch': false,
        'rcv_email': []
      },
      formRules: {},
      noticeModeList: [
        { mode: 1, name: '企业微信' },
        { mode: 2, name: '钉钉' },
        { mode: 3, name: '飞书' },
      ]
    }
  },
  methods: {
    changeProject(projectId) {
      Object.assign(this.$data, this.$options.data())
      this.noticeForm['project_id'] = projectId
      getNotification(projectId).then(response => {
        if (JSON.stringify(response.data) !== '{}') {
          this.noticeForm = response.data
        }
      })
    },
    commitNotice() {
      saveNotification(this.noticeForm).then(response => {
        this.noticeForm = response.data
        this.$message.success('保存成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.notice-config {
  width: 100%;
  height: 100%;
  padding: 0 5px;
  .notice-header {
    padding: 10px 0;
    margin-bottom: 10px;
    border: 1px solid #e4e7ed;
    overflow: hidden;
    .item-label {
      font-size: 14px;
      padding-left: 10px;
      color: $textColor;
    }
    .project-selector {
      padding-left: 5px;
    }
  }
  .notice-body {
    width: 100%;
    border: 1px solid #e4e7ed;
    padding: 10px;
    .card-body {
      width: 100%;
      min-height: 400px;
      min-width: 600px;
      .notice-form {
        .operate-footer {
          display: flex;
          justify-content: left;
          align-items: flex-start;
        }
      }
    }
  }
}
</style>
