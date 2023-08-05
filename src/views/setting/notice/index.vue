<template>
  <div class="notice">
    <div class="notice-body">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-select
              class="project-selector"
              v-model="projectId"
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
        </template>
        <div class="card-body">
          <div class="notice-form" v-if="projectId!==''">
            <el-form
              ref="ruleFormRef"
              :model="noticeForm"
              :rules="formRules"
              label-width="120px"
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
                <el-radio-group v-model="noticeForm.notice_mode" @change="changeNoticeMode">
                  <el-radio v-for="item in noticeModeList" :key="item.id" :label="item.id">{{ item['name'] }}</el-radio>
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
              <el-form-item label="邮箱地址" prop="rcv_email">
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
                    v-for="(item, index) in userEmailList"
                    :key="index"
                    :label="item.email"
                    :value="item.email"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getNotice } from "@/api/notice";

export default {
  name: 'Notice',
  computed: {
    projectList() {
      return this.$store.state.base.projectList
    },
  },
  data() {
    return {
      projectId: '',
      noticeForm: {
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
        { id: 1, name: '企业微信' },
        { id: 2, name: '钉钉' },
        { id: 3, name: '飞书' },
      ],
      userEmailList: []
    }
  },
  methods: {
    changeProject(projectId) {
      getNotice(projectId).then(response => {
        if (JSON.stringify(response.data) !== '{}') {
          this.noticeForm = response.data
        }
      })
    },
    changeNoticeMode(noticeMode) {
      console.log(noticeMode)
    }
  }
}
</script>

<style lang="scss" scoped>
.notice {
  width: 100%;
  height: 100%;
  padding: 5px;
  .notice-body {
    width: 100%;
    height: 100%;
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
