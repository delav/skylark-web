<template>
  <div class="message">
    <el-badge
      :value="bellNumber"
      :hidden="bellNumber===0"
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
               :style="{ color: item.read ? '#8f8f8f' : '' }"
            >
              <span class="title" @click="showMessageContent(item)">{{item.title}}</span>
              <el-icon class="close-icon" @click="removeMessage(item)"><Close /></el-icon>
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
import { readSystemMessage, removeSystemMessage } from "@/api/system";

export default {
  name: 'Message',
  computed: {
    messageList() {
      return this.$store.state.base.sysMessageList
    },
    bellNumber() {
      const messages = this.$store.state.base.sysMessageList
      if (messages.length === 0) {
        return 0
      }
      const unread = messages.filter((item) => {
        return item.read === false
      })
      return unread.length
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
      if (item.read) {
        return
      }
      const params = {'message_id': item.id}
      readSystemMessage(params).then(() => {
        let newMessageList = this.messageList
        for (let i = 0; i < newMessageList.length; i++) {
          if (newMessageList[i]['id'] === item.id) {
            newMessageList[i]['read'] = true
          }
        }
        this.$store.commit('base/SET_SYSTEM_MESSAGE_LIST', newMessageList)
      })
    },
    removeMessage(item) {
      const params = {'message_id': item.id}
      removeSystemMessage(params).then(() => {
        let newMessageList = this.messageList
        newMessageList = newMessageList.filter((m) => {
          return m.id === item.id
        })
        this.$store.commit('base/SET_SYSTEM_MESSAGE_LIST', newMessageList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.message {
  padding: 0 6px;
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
      margin: 10px 0 0 0;
      //color: #8a8a8a;
      border-bottom: 1px solid #e4e3e3;
      .title {
        cursor: pointer;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          color: $mainColor;
        }
      }
      .close-icon {
        float: right;
        cursor: pointer;
        &:hover {
          color: $mainColor;
        }
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
