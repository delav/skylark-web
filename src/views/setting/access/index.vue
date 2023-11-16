<template>
  <div class="access-config">
    <div class="card-body">
      <el-table
        v-loading="loading"
        :data="accessProjectList"
        :header-cell-style="{fontSize:'14px', background: '#f4f5f7'}"
        :cell-style="{color: '#666', fontSize:'14px', padding: '12px 0'}"
        stripe
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div class="user-list">
              <el-table
                :data="props.row['user_list']"
                :header-cell-style="{padding: '4px 0', fontSize:'13px'}"
                :cell-style="{color: '#666', fontSize:'13px', padding: '4px 0'}"
              >
                <el-table-column label="用户名" min-width="100" prop="username" />
                <el-table-column label="邮箱地址" min-width="120" prop="email" />
                <el-table-column label="所属团队" min-width="100" prop="group_name" />
                <el-table-column label="所属部门" min-width="100" prop="department_name" />
                <el-table-column label="加入时间" min-width="120" prop="date_joined" />
                <el-table-column fixed="right" label="操作" width="80">
                  <template #default="scope">
                    <el-popconfirm
                      v-if="userEmail!==scope.row.email"
                      confirm-button-text="确定"
                      cancel-button-text="取消"
                      title="移除后该用户将不再有权访问该项目，确定移除吗?"
                      :hide-icon="true"
                      :hide-after="50"
                      @confirm="removeUserPermission(scope.row.id, props.row.id)"
                    >
                      <template #reference>
                        <el-button type="primary" size="small" link>移除</el-button>
                      </template>
                    </el-popconfirm>
                    <span v-else></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" min-width="150" prop="name" />
        <el-table-column label="创建时间" min-width="150" prop="create_at" />
        <el-table-column label="创建用户" min-width="150" prop="create_by" />
        <el-table-column fixed="right" label="" width="100">
          <template #header>
            <el-button type="primary" size="small" @click="showAddPermission=true">添加用户</el-button>
          </template>
          <template #default="scope">
            <el-popover trigger="hover" placement="left-start" :width="160">
              <p style="margin: 0;font-size: 13px">
                个人项目只有自己可以查看和编辑，如果需要公开此项目，点击【公开项目】，公开后的项目将不再可以设置为个人项目
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="small" @click="updatePersonalProject(scope.row.id)">公开项目</el-button>
              </div>
              <template #reference>
                <el-tag v-if="scope.row.personal">个人项目</el-tag>
                <span v-else></span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog">
      <el-dialog
        width="600px"
        v-model="showAddPermission"
        title="为用户添加项目权限"
        :close-on-click-modal="false"
        destroy-on-close
      >
        <div class="content">
          <el-form
            ref="ruleForm"
            :model="permissionForm"
            :rules="formRules"
            label-width="80px"
            status-icon
          >
            <el-form-item label="项目" prop="project_id">
              <el-select
                style="width: 100%"
                v-model="permissionForm.project_id"
                filterable
                placeholder="选择项目">
                <el-option
                  v-for="(item, index) in accessProjectList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户" prop="user_id">
              <el-select
                style="width: 100%"
                v-model="permissionForm.user_id"
                filterable
                placeholder="选择用户">
                <el-option
                  v-for="(item, index) in userList"
                  :key="index"
                  :label="item.email"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div class="form-footer">
            <el-button @click="showAddPermission=false">取消</el-button>
            <el-button type="primary" @click="addUserPermission">确定</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchAccessProjects, updateAccessProject } from "@/api/access";
import { updateProject } from "@/api/project";

export default {
  name: 'Access',
  computed: {
    userList() {
      return this.$store.state.base.userList
    },
    userEmail() {
      return this.$store.state.user.info.email
    }
  },
  data() {
    return {
      loading: true,
      accessProjectList: [],
      showAddPermission: false,
      permissionForm: {
        'user_id': '',
        'project_id': ''
      },
      formRules: {
        user_id: [
          { required: true, message: '请选择用户', trigger: 'change' },
        ],
        project_id: [
          { required: true, message: '请选择项目', trigger: 'change' },
        ],
      }
    }
  },
  mounted() {
    this.getAccessProjects()
  },
  methods: {
    getAccessProjects() {
      fetchAccessProjects().then(response => {
        this.loading = false
        this.accessProjectList = response.data
      }).catch(() => {
        this.loading = false
      })
    },
    updatePersonalProject(projectId) {
      const params = {'personal': false}
      updateProject(projectId, params).then(() => {
        this.$message.success('操作成功')
        this.getAccessProjects()
      })
    },
    addUserPermission() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const params = {
          'action_type': 1,
          'user_id': this.permissionForm.user_id,
          'project_id': this.permissionForm.project_id,
        }
        updateAccessProject(params).then(() => {
          this.$message.success('添加用户权限成功')
          this.showAddPermission = false
          this.getAccessProjects()
        })
      })
    },
    removeUserPermission(userId, projectId) {
      const params = {
        'action_type': 2,
        'user_id': userId,
        'project_id': projectId,
      }
      updateAccessProject(params).then(() => {
        this.$message.success('移除用户权限成功')
        this.getAccessProjects()
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.access-config {
  width: 100%;
  height: 100%;
  padding: 0 5px;
  .card-body {
    .user-list {
      margin-left: 48px;
    }
  }
  .dialog {
    .form-footer {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
