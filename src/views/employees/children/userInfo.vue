<template>
  <div class="user-info">
    <el-form
      ref="formRef"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
      :model="userInfo"
      :rules="rules"
    >
      <el-form-item label="手机" prop="mobile">
        <el-input 
          v-model="userInfo.mobile"
          placeholder="此处输入手机号码"
          style="width:300px" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          placeholder="请选择时间" 
          v-model="userInfo.timeOfEntry"
          value-format="yyyy-MM-dd"
          style="width:300px" />
      </el-form-item>
      <el-form-item label="员工头像">
        <upload-img v-model="userInfo.staffPhoto" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="handleSave">保存更新</el-button>
        <el-button size="small" @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { getUserDetailById } from '@/api/user'
  import {saveUserDetailById} from '@/api/employees'
  export default{
    name:'UserInfo',
    created(){
      this.loadEmployeeDetail();
    },
    data(){
      return{
        userInfo:{
          mobile:'',
          timeOfEntry:'',
          staffPhoto:''
        },
        rules:{
          mobile:[
            {required:true,message:'手机号码不能为空',trigger:'blur'},
            {pattern:/^1[3-9]\d{9}$/,message:'手机号格式不正确',trigger:'blur'}
          ],
          timeOfEntry:[
            {required:true,message:'入职日期不能为空',trigger:'blur'}
          ],
          
        }
      }
    },
    methods:{
      async loadEmployeeDetail(id){
        try{
          const {data:res} = await getUserDetailById(this.$route.query.id);
          this.userInfo = res;
        }catch(err){
          this.$message.error('加载员工详情失败!');
        }
      },
      async doSave(){
        try{
          await saveUserDetailById(this.userInfo);
          this.$message.success('保存上传成功');
          this.$router.back();
        }catch(err){
          this.$message.error('保存失败!');
        }
      },
      handleSave(){
        this.$refs.formRef.validate(valid => {
          if(valid){
            this.doSave();
          }
        })
      }
    }
  }
</script>