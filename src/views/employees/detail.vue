<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <login-setting />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <job-info/>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
  import { getEmployeeDetail} from '@/api/employees'
  import JobInfo from './children/jobInfo.vue'
  import LoginSetting from './children/loginSetting.vue'
  import UserInfo from './children/userInfo.vue'
  export default{
    name:'Detail',
    components:{JobInfo,LoginSetting,UserInfo},
    created(){
      //console.log(this.$route);
    },
    data(){
      return {

      }
    },
    methods:{
      
    }
  }
</script>

