<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 start -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 头像 end -->

      <div class="form-box">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
          @submit.native.prevent="login('ruleForm')"
        >
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>

          <el-form-item class="form-btns">
            <el-button type="primary" native-type="submit" xxxxclick="submitForm('ruleForm')">登录</el-button>
            <el-button native-type="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        username: 'admin', password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login (formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.ruleForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)

        // 保存token
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2d4d6d;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .avatar-box {
      height: 130px;
      width: 130px;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      border: solid 1px #eee;
      transform: translateY(-50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .form-box {
      width: 100%;
      box-sizing: border-box;
      padding: 0 30px;
      transform: translateY(-10%);
      .form-btns {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
