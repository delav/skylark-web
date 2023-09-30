<template>
  <div class="navbar">
    <div class="logo">
      <img :src="logo" class="navbar-logo" alt="">
    </div>
    <div class="router">
      <el-menu class="menu" :default-active="activeMenu" mode="horizontal" router>
        <el-menu-item v-for="(route, i) in routes" :key="i" :index="resolvePath(route)">
          {{ route.meta.title }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="info">
      <div class="handbook">
        <el-link :underline="false">
          使用手册<el-icon style="margin-left: 3px"><Document /></el-icon>
        </el-link>
      </div>
      <div class="divider"></div>
      <div class="feedback">
        <el-link :underline="false" @click="feedbackShow=true">
          意见反馈<el-icon style="margin-left: 3px"><EditPen /></el-icon>
        </el-link>
      </div>
      <div class="divider"></div>
      <div class="notice">
        <el-badge
          :value="noticeList.length"
          :hidden="hideBadge"
          :max="9"
        >
          <el-popover
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
              <div class="notice-list">
                <p v-if="noticeList.length===0"
                   class="notice-blank">
                  暂无通知消息
                </p>
                <p v-else
                   class="notice-item"
                   v-for="(item, index) in noticeList"
                   :key="index"
                   @click="showNoticeContent(item)"
                >
                  {{item.title}}
                </p>
              </div>
            </template>
          </el-popover>
        </el-badge>
      </div>
      <div class="divider"></div>
      <div class="language">
        <el-dropdown trigger="hover" :command="changeLanguage">
          <span>
            {{ $t('Navbar._language') }}
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click.native="changeLanguage('CN')">
                <span>中文</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="changeLanguage('US')">
                <span>English</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="divider"></div>
      <div class="profile">
        <el-dropdown>
          <span>
            {{ userName }}
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="Setting">
                设置
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="logout" icon="Right">
                退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="navbar-dialog">
      <el-dialog
        class="notice-dialog"
        width="550px"
        v-model="noticeShow"
        center
      >
        <template #header>
          <span class="dialog-header">{{noticeItem.title}}</span>
        </template>
        <div class="content">
          <span>
            {{noticeItem.content}}
          </span>
        </div>
      </el-dialog>
      <el-dialog
        class="feedback-dialog"
        width="50%"
        v-model="feedbackShow"
        title="意见反馈"
      >
        <el-form
          ref="feedbackRef"
          :model="feedbackForm"
          :rules="formRules"
          label-width="120px"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="feedbackForm.title" />
          </el-form-item>
          <el-form-item label="模块" prop="module">
            <el-select v-model="feedbackForm.module" placeholder="选择模块">
              <el-option
                v-for="(item, index) in routes"
                :key="index"
                :label="item.meta.title"
                :value="item.meta.title"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" v-model="feedbackForm.content" :rows="5" />
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
              v-model="fileList"
              class="uploadPicture"
              action=""
              accept=".jpg,.png,.jpeg,.gif"
              :auto-upload="false"
              :limit="3"
              :on-change="handleChangeFile"
              :on-remove="handleRemoveFile"
              :on-exceed="handleNumberLimit"
            >
              <el-button type="primary">选择图片</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  仅支持上传.jpg, .png, .jpeg, .gif格式文件，文件大小不能超过5M，一次最多添加3个。
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="feedbackShow=false">取消</el-button>
            <el-button type="primary" @click="commitFeedback">
              提交
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import path from "path";
import { NotAuthUrl } from "@/utils/auth";
import { isExternal } from "@/utils/validate";

export default {
  name: 'Navbar',
  data() {
    return {
      logo: require('@/assets/logo.png'),
      lang: {
        'CN': '中文',
        'US': 'English',
      },
      noticeShow: false,
      noticeItem: {
        'title': '',
        'content': ''
      },
      feedbackShow: false,
      feedbackForm: {
        'title': '',
        'module': '',
        'content': ''
      },
      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
      },
      fileList: []
    }
  },
  computed: {
    routes() {
      const navbarRoutes = []
      const allRoutes = this.$router.options.routes
      allRoutes.forEach(item => {
        if (item.meta['navbar']) {
          navbarRoutes.push(item)
        }
      })
      return navbarRoutes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta['activeMenu']) {
        return meta['activeMenu']
      }
      return path
    },
    userName() {
      return this.$store.getters.name
    },
    noticeList() {
      return this.$store.state.base.sysNoticeList
    },
    hideBadge() {
      const notices = this.$store.state.base.sysNoticeList
      const newNoticeList = notices.filter((item) => {
        return item.new === true
      })
      return newNoticeList.length === 0
    },
  },
  methods: {
    changeLanguage(val) {
      console.log('切换语言')
      if (this.$i18n.locale === val) {
        return
      }
      this.$i18n.locale = val
      this.$root.$i18n.locale = val
    },
    hasOneShowingChild(children = []) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return showingChildren.length === 0
    },
    resolvePath(route) {
      if (isExternal(route.path)) {
        return route.path
      }
      if (this.hasOneShowingChild(route.children)) {
        return path.resolve(route.path, route.children[0].path)
      }
      return route.path
    },
    logout() {
      this.$store.dispatch('user/logout')
      return this.$router.push(`${NotAuthUrl.Login}?redirect=${this.$route.fullPath}`)
    },
    showNoticeContent(item) {
      this.noticeItem = item
      this.noticeShow = true
    },
    handleChangeFile(file, fileList) {
      this.fileList = fileList
      let imgSize = Number(file.size / 1024 / 1024)
      if (imgSize > 5) {
        const currIdx = this.uploadFiles.indexOf(file)
        this.fileList.splice(currIdx, 1)
        this.$message.error('文件大小不能超过5MB，请重新上传。')
        return false
      }
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList
    },
    handleNumberLimit() {
      this.$message.error('超过可上传的最大文件数量')
    },
    commitFeedback() {
      this.$refs['feedbackRef'].validate((valid) => {
        if (!valid) {
          return
        }
        this.feedbackShow = false
        this.$message.success('提交反馈成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-badge) {
  border-radius: 12px;
  font-size: 8px;
  padding: 4px;
}
// el-popover style must be here
.notice-list {
  .notice-blank {
    color: #8a8a8a;
    font-size: 13px;
    text-align: center;
  }
  .notice-item {
    font-size:13px;
    cursor: pointer;
    margin: 10px 0 0 0;
    color: #8a8a8a;
    border-bottom: 1px solid #e4e3e3;
    &:hover {
      color: #00acc1;
    }
  }
}
.navbar-dialog {
  .notice-dialog {
    .dialog-header {
      font-size: 15px;
      font-weight: 600;
      color: #7d7d7e;
    }
    .content {
      min-height: 150px;
      font-size: 14px;
    }
  }
}
</style>
