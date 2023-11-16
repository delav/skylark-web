<template>
  <div class="hook-config">
    <div class="card-header">
      <div class="group-button">
        <el-button type="primary"><el-icon class="el-icon--left"><Plus /></el-icon>新建webhook</el-button>
      </div>
    </div>
    <div class="card-body">
      <div></div>
    </div>
    <div class="dialog">
      <div class="ready-dialog">
        <el-dialog
          width="700px"
          v-model="showBuildTrigger"
          title="生成构建webhook"
          :close-on-click-modal="false"
        >
          <div class="content">
            <build-trigger
              :hook-type="hookType"
              @cancel="showBuildTrigger=false"
              @confirm="saveBuildWebhook"
            />
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import BuildTrigger from "@/views/setting/hook/components/BuildTrigger";
import { fetchWebhookList, createBuildWebhook } from "@/api/webhook";

export default {
  name: 'Hook',
  components: {
    BuildTrigger,
  },
  data() {
    return {
      loading: true,
      webhookList: [],
      hookTypeList: [],
      hookType: '',
      showBuildTrigger: false
    }
  },
  mounted() {
    this.getWebhookList()
  },
  methods: {
    getWebhookList() {
      fetchWebhookList().then(response => {
        const result = response.data
        this.webhookList = result['webhook_list']
        this.hookTypeList = result['type_list']
      })
    },
    saveBuildWebhook(data) {
      createBuildWebhook(data).then(response => {
        this.showBuildTrigger = false
        this.webhookList.push(response.data)
        this.$message.success('创建成功')
      })
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
    justify-content: center;
    .item-desc {
      color: $textColor;
      font-size: 14px;
    }
    .team {
      margin-left: 20px;
    }
    .item-value {
      min-width: 100px;
      max-width: 220px;
    }
    .group-button {
      margin-left: auto;
      margin-right: 10px;
    }
  }
  .card-body {
    .ready-keyword {
      //border-bottom: 1px solid #e4e7ed;
      cursor: pointer;
      .ready-content {
        background-color: #fff995;
        .ready-title {
          color: #bd0000;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          margin: 0;
          line-height: 64px;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .collapse-title {
      color: $textColor;
      font-size: 14px;
      font-weight: 500;
    }
  }
}
:deep(.el-collapse) {
  .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
