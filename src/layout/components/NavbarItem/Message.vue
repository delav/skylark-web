<template>
  <div class="message">
    <el-badge
      :value="messageList.length"
      :hidden="hideBadge"
      :max="9"
    >
      <el-popover
        popper-class="message-popover"
        placement="bottom"
        :width="250"
        title="通知"
        trigger="hover"
      >
        <template #reference>
          <el-link :underline="false">
            <el-icon :size="18"><Bell /></el-icon>
          </el-link>
        </template>
        <template #default>
          <div class="message-list">
            <p v-if="messageList.length===0"
               class="message-blank">
              暂无通知消息
            </p>
            <p v-else
               class="message-item"
               v-for="(item, index) in messageList"
               :key="index"
               @click="showMessageContent(item)"
            >
              {{item.title}}
            </p>
          </div>
        </template>
      </el-popover>
    </el-badge>
    <el-dialog
      class="message-dialog"
      width="600px"
      v-model="messageShow"
      center
    >
      <template #header>
        <span class="dialog-header">{{messageItem.title}}</span>
      </template>
      <div class="message-content">
          <span>
            {{messageItem.content}}
          </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Message',
  computed: {
    messageList() {
      return this.$store.state.base.sysMessageList
    },
    hideBadge() {
      const notices = this.$store.state.base.sysMessageList
      const newNoticeList = notices.filter((item) => {
        return item.new === true
      })
      return newNoticeList.length === 0
    },
  },
  data() {
    return {
      messageShow: false,
      messageItem: {
        'title': '',
        'content': ''
      }
    }
  },
  methods: {
    showMessageContent(item) {
      this.messageItem = item
      this.messageShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.message {
  width: 32px;
}
.message-popover {
  .message-list {
    .message-blank {
      color: #8a8a8a;
      font-size: 13px;
      text-align: center;
    }
    .message-item {
      font-size:13px;
      cursor: pointer;
      margin: 10px 0 0 0;
      color: #8a8a8a;
      border-bottom: 1px solid #e4e3e3;
      &:hover {
        color: $mainColor;
      }
    }
  }
}
.message-dialog {
  .dialog-header {
    font-size: 15px;
    font-weight: 600;
    color: #7d7d7e;
  }
  .message-content {
    min-height: 150px;
    font-size: 14px;
  }
}
:deep(.el-badge) {
  border-radius: 12px;
  font-size: 8px;
  padding: 4px;
}
</style>
