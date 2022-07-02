<template>
  <!-- // 分配角色 -->
  <div>
    <el-checkbox-group v-model="roleIds">
      <el-checkbox 
        v-for="item in roles"
        :key="item.key"
        :label="item.id">{{item.name}}</el-checkbox>
    </el-checkbox-group>

    <div style="margin-top: 20px; text-align: right">
      <el-button
        @click="handleSave"
        type="primary">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script>
  import {getRoles} from '@/api/settings'
  import {getUserDetailById} from '@/api/user'
  import {assignRoles} from '@/api/employees'
  export default {
    props:{
      id:{
        type:String,
        required:true,
        default:''
      }
    },
    created(){
      this.loadRoles();
    },
    data() {
      return {
        roleIds: [],      // 选中的
        roles:[]      // 全部的
      }
    },
    watch:{
      id:{
        handler:function (newVal){
          //console.log(newVal,this);
          this.roleIds = [];
          this.loadRoles();
        },
        immediate:true
      }
    },
    methods: {
      async loadRoles(){
        try{
          if(!this.roles.length){
            const {data} = await getRoles({page:1,pagesize:100});
            this.roles = data.rows;
          }
          if(this.id){
            const {data} = await getUserDetailById(this.id);
            this.roleIds = data.roleIds;
          }
          //const {data} = await getUserDetailById(id);
        }catch(err){
          this.$message.error('加载角色列表失败');
        }
      },
      async doAssign(){
        try{
          await assignRoles({id:this.id,roleIds:this.roleIds});
          this.$message.success('分配角色成功');
          this.$emit('close');
        }catch(err){
          this.$message.error('分配角色失败');
        }
      },
      closeDialog() {
        this.$emit('close');
      },
      handleSave(){
        this.doAssign();
      }
    }
  }
</script>