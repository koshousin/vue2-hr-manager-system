<template>
  <div class="login-setting">
    <el-form
      ref="formRef"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
      :model="userInfo"
      :rules="rules"
    >
      <el-form-item label="姓名" prop="username">
        <el-input 
          v-model="userInfo.username"
          placeholder="用户名" style="width:300px" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input 
          v-model="userInfo.password"
          placeholder="此处输入密码" 
          type="password"
          style="width:300px" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    getEmployeeDetail,
    saveUserDetailById
  } from '@/api/employees'
  export default {
    name:'LoginSetting',
    created(){
      this.loadEmployeeDetail(this.$route.query.id);
    },
    data(){
      return {
        userInfo:{
          username:'',
          password:''
        },
        rules:{
          username:[
            {required:true,message:'用户名不能为空',trigger:'blur'},
            {min:1,max:4,message:'用户名位1-4位',trigger:'blur'}
          ],
          password:[
            {required:true,message:'密码不能为空',trigger:'blur'},
            {min:5,message:'密码不能低于6位',trigger:'blur'}
          ]
        }
      }
    },
    methods:{
      async loadEmployeeDetail(id){
        try{
          const {data:res} = await getEmployeeDetail(id);
          //console.log(res);
          this.userInfo = res;
        }catch(err){
          this.$message.error('获取员工详情失败！');
        }
      },
      async doEmpDetailUpdate(){
        try{
          await saveUserDetailById(this.userInfo);
          this.$message.success('更新用户信息成功！');
        }catch(err){
          this.$message.error('修改失败！');
        }
      },
      onSubmit(){
        // 兜底验证
        this.$refs.formRef.validate(valid =>{
          if(valid){
            this.doEmpDetailUpdate();
          }
        })
      }
    },
  }
</script>