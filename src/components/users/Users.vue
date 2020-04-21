<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="dialogFormVisible=true">添加</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" id="out-table" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template scope="props">
            <el-switch
              v-model="props.row.mg_state"
              @change="changeUserStatus(props.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="props">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditUserDialog(props.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(props.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="info" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>

      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--弹窗添加-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="addUserForm" ref="addUserForm" @submit.native.prevent="addUser('addUserForm')">
        <el-form-item label="用户名" label-width="70px" :rules="[
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min:3,max:15, message: '用户名在3-15个字符之间', trigger: ['blur', 'change'] }
    ]" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" label-width="70px" :rules="[
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min:6,max:20, message: '用户名在6-20个字符之间', trigger: ['blur', 'change'] }
    ]" prop="password">
          <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" label-width="70px" :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="手机号" label-width="70px" :rules="[
      { required: true, message: '请输入手机号', trigger: 'blur' }
    ]" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item class="form-btns">
          <el-button type="primary" native-type="submit">保存</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>

    <!--弹窗修改-->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="editUserForm" ref="editUserForm" @submit.native.prevent="saveUser('editUserForm')">
        <el-input type="hidden" v-model="editUserForm.id"></el-input>
        <el-form-item label="用户名" label-width="70px" :rules="[
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min:3,max:15, message: '用户名在3-15个字符之间', trigger: ['blur', 'change'] }
    ]" prop="username">
          <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" label-width="70px" :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]" prop="email">
          <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="手机号" label-width="70px" :rules="[
      { required: true, message: '请输入手机号', trigger: 'blur' }
    ]" prop="mobile">
          <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item class="form-btns">
          <el-button type="primary" native-type="submit">保存</el-button>
          <el-button @click="dialogFormVisibleEdit=false">取消</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1, // 第{}页
        pagesize: 10// 每页显示条数
      },
      userList: [],
      total: 0,

      dialogFormVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      dialogFormVisibleEdit: false,
      editUserForm: {
        id: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {

  },

  watch: {
    // 监听queryinfo变化
    queryInfo: {
      handler (newName, oldName) {
        this.queryInfo = newName
        this.getUserList()
      },
      deep: true,
      immediate: true
    },
    dialogFormVisible: {
      handler (newName, oldName) {
        if (newName === false && this.$refs.addUserForm !== undefined) {
          this.$refs.addUserForm.resetFields()
          if (this.addUserForm.id !== undefined) {
            this.addUserForm = {
              username: '',
              password: '',
              email: '',
              mobile: ''
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },

    async changeUserStatus (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      // this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      // this.getUserList()
    },

    addUser (form) {
      this.$refs[form].validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.dialogFormVisible = false
        this.getUserList()
        this.$message.success(res.meta.msg)
      })
    },

    saveUser (form) {
      this.$refs[form].validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(`users/${this.editUserForm.id}`, this.editUserForm)

        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.dialogFormVisibleEdit = false
        this.getUserList()
        this.$message.success(res.meta.msg)
      })
    },

    async showEditUserDialog (id) {
      this.dialogFormVisibleEdit = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editUserForm = res.data
    },

    async deleteUser (id) {
      const confirmRes = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmRes !== 'confirm') return

      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getUserList()
      this.$message.success(res.meta.msg)
    }

  }

}
</script>

<style scoped>
  .form-btns {
    display: flex;
    justify-content: center;
  }
</style>
