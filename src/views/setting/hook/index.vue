<template>
  <div class="hook-config">
    <div class="card-header">
      <span class="item-desc">Hook类型：</span>
      <el-select class="item-value" v-model="hookType">
        <el-option
          v-for="item in hookTypeList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <div class="group-button" @click="showCreateHook">
        <el-button type="primary">
          <el-icon class="el-icon--left"><Plus /></el-icon>
          新建webhook
        </el-button>
      </div>
    </div>
    <div class="card-body">
      <div class="header-alter">
        <el-alert
          title="Tips"
          type="warning"
          description="Hook使得可通过接口的方式让平台执行相应的功能，如计划构建、代码合入等。"
          :closable="false"
        />
      </div>
      <div class="hook-list">
        <el-table
          v-loading="loading"
          :data="webhookList"
          :header-cell-style="{fontSize:'13px', background: '#f4f5f7'}"
          :cell-style="{color: '#666', fontSize:'14px'}"
          border
          stripe
          style="width: 100%">
          <el-table-column prop="name" label="Hook名称" min-width="150" show-overflow-tooltip />
          <el-table-column prop="payload_url" label="Hook地址" min-width="250" show-overflow-tooltip>
            <template #default="scope">
              <el-button type="primary" @click="copyPayloadUrl(scope.row.payload_url)" link>
                <el-icon size="16"><DocumentCopy /></el-icon>
              </el-button>
              <span>{{scope.row.payload_url}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="hook_type" label="Hook类型" min-width="100">
            <template #default="scope">
              <span>{{getTypeNameById(scope.row.hook_type)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_by" label="创建用户" min-width="100" show-overflow-tooltip />
          <el-table-column prop="create_at" label="创建时间" min-width="100" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" width="110">
            <template #default="scope">
              <el-button-group>
                <el-button type="primary" size="small" @click="showHookDetailAction(scope.row)" link>详情</el-button>
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  :hide-icon="true"
                  :hide-after="50"
                  title="确定删除该Hook？"
                  @confirm="confirmDeleteHook(scope.row.id)"
                >
                  <template #reference>
                    <el-button type="danger" size="small" link>删除</el-button>
                  </template>
                </el-popconfirm>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="dialog">
      <el-dialog
        width="700px"
        v-model="showHookCreate"
        title="Hook 创建"
        :close-on-click-modal="false"
      >
        <div class="content">
          <hook-form
            :hook-type="hookType"
            @cancel="showHookCreate=false"
            @confirm="saveWebhook"
          />
        </div>
      </el-dialog>
      <el-dialog
        width="60%"
        v-model="showHookDetail"
        title="Hook 详情"
        :close-on-click-modal="false"
      >
        <div class="content">
          <hook-detail
            :hook-data="hookDetailData"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import HookForm from "@/views/setting/hook/components/HookForm";
import HookDetail from "@/views/setting/hook/components/HookDetail";
import { deepCopy } from "@/utils/dcopy";
import { fetchWebhooks, createWebhook, deleteWebhook } from "@/api/webhook";

export default {
  name: 'Hook',
  components: {
    HookForm,
    HookDetail
  },
  data() {
    return {
      loading: true,
      webhookList: [],
      hookTypeList: [],
      hookType: 0,
      showHookCreate: false,
      showHookDetail: false,
      hookDetailData: {}
    }
  },
  mounted() {
    this.getWebhookList()
  },
  methods: {
    getWebhookList() {
      fetchWebhooks().then(response => {
        const result = response.data
        this.webhookList = result['webhook_list']
        this.hookTypeList = result['type_list']
        if (this.hookTypeList.length !== 0) {
          this.hookType = this.hookTypeList[0]['value']
        }
        this.loading = false
      })
    },
    showCreateHook() {
      if (this.hookType === '') {
        this.$message.warning('请选择Hook类型')
        return
      }
      if (this.hookType === 1) {
        this.showHookCreate = true
      }
    },
    saveWebhook(data) {
      createWebhook(data).then(response => {
        this.showHookCreate = false
        this.webhookList.push(response.data)
        this.$message.success('创建成功')
      })
    },
    getTypeNameById(hookTypeId) {
      for (let i = 0; i < this.hookTypeList.length; i++) {
        if (this.hookTypeList[0]['value'] === hookTypeId) {
          return this.hookTypeList[0]['name']
        }
      }
      return 'Unknown'
    },
    copyPayloadUrl(payloadUrl) {
      const cInput = document.createElement('input')
      cInput.value = payloadUrl
      document.body.appendChild(cInput)
      cInput.select()
      document.execCommand('Copy')
      cInput.remove()
      this.$message({
        type: 'success',
        message: '复制成功',
        duration: 1500
      })
    },
    confirmDeleteHook(hookId) {
      deleteWebhook(hookId).then(() => {
        this.getWebhookList()
      })
    },
    showHookDetailAction(hookData) {
      this.hookDetailData = deepCopy(hookData)
      this.hookDetailData['hook_type'] = this.getTypeNameById(this.hookDetailData['hook_type'])
      this.showHookDetail = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.hook-config {
  width: 100%;
  height: 100%;
  padding: 0 5px;
  .card-header {
    padding: 10px 0;
    margin-bottom: 10px;
    //border: 1px solid #e4e7ed;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .item-desc {
      color: $textColor;
      font-size: 14px;
    }
    .item-value {
    }
    .group-button {
      //margin-left: auto;
      margin-left: 20px;
    }
  }
  .card-body {
    .header-alter {
      margin-bottom: 15px;
    }
  }
}
</style>
