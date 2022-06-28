<template>
  <div class="login-container">
    <el-form 
      ref="loginForm" 
      :model="loginForm" 
      :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="login-logo" />
        </h3>
      </div>
 
      <el-form-item prop="mobile">
        <el-input
          v-model="loginForm.mobile"
          placeholder="Phone number"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="Password"
        />
        <!--
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
         -->
        
      </el-form-item>

      <el-button 
        class="loginBtn"
        :loading="loading" 
        type="primary" 
        style="width:100%;margin-bottom:30px;" 
        @click.native.prevent="handleLogin">Login</el-button>

      <div class="tips">
        <span style="margin-right:20px;">username: 13800000002</span>
        <span> password: 123456</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validMobile} from '@/utils/validate'
import { login} from '@/api/user'

export default {
  name: 'Login',
  data() {
    //#region
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    //#endregion
    const validateMobile = (rule,value,callback) => {
      if(validMobile(value)){
        callback();
      }else{
        callback(new Error('手机号格式不正确'));
      }
    }
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', message:'手机号不能为空' },
          {validator:validateMobile,trigger:'blur'}
        ],
        password: [{ required: true, trigger: 'blur', message:'密码不能为空' },
          {min:6,max:16,message:'密码的长度在6-16位之间',trigger:'blur'}
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // el-form 的方法，valid是一个布尔值
      this.$refs.loginForm.validate(async valid => {
        if(valid){
          this.loading = true;
          try{
            /* 此处dispatch 是异步的，因此要加上await */
            await this.$store.dispatch('user/userLogin',this.loginForm);
            console.log(this.$route.query);
            this.$router.push(this.$route.query.return_url || '/');
          }catch(err){
            console.log('发送请求失败：',err);
          }
          this.loading = false;
        }
      })
     
    }
  },
  
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#68b0fe;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    background:url('~@/assets/common/login.jpg') center;
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.7);
      border-radius: 5px;
      color: #454545;
    }
    .el-form-item_error{
      color:#fff;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    // 添加登录按钮样式
    .loginBtn {
      background:#407ffe;
      height:64px;
      line-height:32px;
      font-size:24px;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
