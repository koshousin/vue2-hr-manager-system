<template>

  <div class="assign-container">
    <el-tree
      ref="refTree"
      show-checkbox
      default-expand-all
      check-strictly
      node-key="id"
      :data="list"
      :props="{ label: 'name' }"
    />
    <el-row type="flex" justify="center">
      <el-button size="small" type="primary" @click="handleSubmit">确认</el-button>
      <el-button size="small" @click="handleCancel">取消</el-button>
    </el-row>
  </div>
</template>
<script>
  import {
    getPermissionList,
  } from '@/api/permission'
  import{
    getRoleDetail,
    assignPerm
  } from '@/api/settings'
  import {trainList2TreeData} from '@/utils'
  export default {
    name:'AssignPermission',
    props:{
      id:{
        type:String,
        required:true,
        default:''
      }
    },
    created(){
      this.loadPermissionList();
      //this.loadPermissionListById();
    },
    data(){
      return {
        list:[],
        //permIds:[]
      }
    },
    methods:{
      async loadPermissionList(){
        try{
          const {data} = await getPermissionList();
          this.list = trainList2TreeData(data);
        }catch(err){
          this.$message.error('获取权限列表失败');
        }
      },
      async loadPermissionListById(){
        try{
          const {data} = await getRoleDetail(this.id);
          this.$refs.refTree.setCheckedKeys(data.permIds)
        }catch(err){
          this.$message.error('加载用户权限失败');
        }
        //console.log(data.permIds);
      },
      async doSavePermission(){
        const permIds = this.$refs.refTree.getCheckedKeys();
        try{
          await assignPerm({
            id:this.id,
            permIds
          });
          this.$message.success('权限分配成功');
          this.handleCancel();
        }catch(err){
          this.$message.error('权限分配失败');
        }
      },
      handleSubmit(){
        this.doSavePermission();
      },
      handleCancel(){
        this.$emit('close');
        this.$refs.refTree.setCheckedKeys([])
      }
    }
  }
</script>
