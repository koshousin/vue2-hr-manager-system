<template>
  <div class="settings-container">
    <div class="app-container">
        <el-card>
          <el-tabs>
            <el-tab-pane label="角色管理">
              <el-row style="height:60px">
                <el-button
                  icon="el-icon-plus"
                  size="small"
                  type="primary"
                  @click="openDialog"
                >新增角色</el-button>
              </el-row>
              <el-table :data="roles">
                <el-table-column 
                  label="序号" 
                  type="index"
                  :index="startIndex"  width="120">
                </el-table-column>
                <el-table-column label="角色名称" width="240" prop="name">
                </el-table-column>
                <el-table-column label="描述" prop="description" />
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button 
                      @click="handleAssign(scope.row.id)"
                      size="small" 
                      type="success">分配权限</el-button>
                    <el-button
                      @click="handleEdit(scope.row)"
                      size="small" type="primary">编辑</el-button>
                    <el-button 
                      @click="handleDelete(scope.row.id,$event)"
                      size="small" type="danger">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row type="flex" justify="center" align="middle" style="height: 60px">
                <!-- 分页组件 -->
                <el-pagination
                  :total="total"
                  @current-change="handlePageChange"
                  :hide-on-single-page="isSingle"
                  :current-page="pageParams.page"
                  :page-size="pageParams.pagesize"
                  layout="prev,pager,next" />
              </el-row>
            </el-tab-pane>
          </el-tabs>
          <!-- 编辑/新增角色弹窗 -->
          <el-dialog
            :title="isEdit ? '编辑角色' : '新增角色' "
            :visible.sync="centerDialogVisible"
            @close="handleClose"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
          >
            <el-form
              ref="settingFormRef"
             label-width="80px" width="50%" :model="formData" :rules="rules">
              <el-form-item label="角色名称" prop="name">
                <el-input required v-model="formData.name"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="description">
                <el-input v-model="formData.description"></el-input>
              </el-form-item>
            </el-form>
            <el-row slot="footer" type="flex" justify="center">
              <el-button size="small" type="primary" @click="handleSubmit">确认</el-button>
              <el-button size="small" @click="handleCancel">取消</el-button>
            </el-row>
          </el-dialog>
          <!-- 分配权限弹窗 -->
          <el-dialog 
            :visible.sync="assignDialogShow"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            title="分配权限(一级为路由页面查看权限-二级为按钮操作权限)" 
          >
          <assign-permission 
            ref="assignRef"
            :id="curId"
            @close="assignDialogShow = false" />
        </el-dialog>
        </el-card>
    </div>
  </div>
</template>
<script>
  import {
    getRoles,
    deleteRole,
    addRole,
    getRoleById,
    updateRole
  } from '@/api/settings'
  import AssignPermission from './assignPermission.vue'
  export default {
    name:'Settings',
    components:{AssignPermission},
    created(){
      this.loadRoles();
    },
    data(){
      return {
        roles:[],
        activeName:'first',
        startIndex:1, // 每页的起始索引值
        centerDialogVisible:false,
        assignDialogShow:false,
        total:0,
        isEdit:false,
        curId:'',     // 点击分配权限所在行角色的ID
        pageParams:{
          page:1,
          pagesize:2
        },
        formData:{
          name:'',
          description:''
        },
        rules:{
          name:[
            {validator:(rule,value,callback) => {
              if(value){
                callback();
              }else{
                callback(new Error('请输入角色名称'));
              }
            },trigger:'blur'}
          ]
        }
      }
    },
    computed:{
      isSingle(){
        return Math.ceil(this.total / this.pageParams.pagesize) === 1
      }
    },
    methods: {
      async loadRoles(){
        try{
          const {data:res} = await getRoles(this.pageParams);
          this.roles = res.rows;
          this.total = res.total;
          this.startIndex = this.pageParams.pagesize * (this.pageParams.page-1) + 1 ;
        }catch(err){
          console.log('获取角色列表失败');
        }
      },
      handlePageChange(curPage){
        //console.log(curPage)
        this.pageParams.page = curPage;
        this.loadRoles();
        //this.startIndex = this.pageParams.pagesize * (curPage-1) + 1 ;
        //console.log(this.startIndex);
       
      },
      async doDelete(id){
        try {
          await deleteRole(id)
          //console.log(res)
          // 1. 提示
          this.$message.success('删除成功')
          if(this.roles.length === 1){   // 判断是否删除的是最后一页最后一条
            this.pageParams.page -= 1;
            if (this.pageParams.page <= 0) {
              this.pageParams.page = 1
            }
          }
          // 2. 重新请求
          this.loadRoles()
        } catch (err) {
          console.log(err)
          this.$message.error('删除失败')
        }
      },
      async doAdd(){
        try{
          await addRole(this.formData);
          this.centerDialogVisible = false
          this.$message.success('添加成功')
          // 实现添加完成后自动跳转最后一页
          this.total += 1;
          this.pageParams.page = Math.ceil(this.total / this.pageParams.pagesize);
          this.loadRoles()
          this.resetForm();
          
        }catch(err){
          this.$message.error('添加失败');
          this.centerDialogVisible = false
          //console.log('新增角色失败');
        }
      },
      async doUpdate(id){
        try{
          await updateRole(this.formData);
          this.centerDialogVisible = false
          this.$message.success('编辑成功')
          this.loadRoles()
          this.resetForm();
        }catch(err){
          this.$message.error('编辑失败');
          this.centerDialogVisible = false
          //console.log('新增角色失败');
        }
      },
      handleAssign(id){
        this.curId = id;
        this.assignDialogShow = true;
        this.$nextTick(()=>{
          this.$refs.assignRef.loadPermissionListById();
        });
      },
      handleSubmit(){
        this.$refs.settingFormRef.validate(valid => {
          if(valid){
            this.isEdit ? this.doUpdate() : this.doAdd();
          }
        })
      },
      handleDelete(id){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDelete(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      handleEdit(data){
        this.isEdit = true;
        this.centerDialogVisible = true;
        // 实现深拷贝，防止取消确认造成数据脏写入
        this.formData = {...data};
      },
      openDialog(){
        this.isEdit = false;

        this.centerDialogVisible = true;
      },
      handleCancel(){
        this.centerDialogVisible =false;
      },
      handleClose(){
        this.resetForm();
      },
      resetForm(){
        this.formData = {
          name:'',
          description:''
        }
        this.$refs.settingFormRef.resetFields();
      }
    }
     
  }
</script>
<style scoped>
</style>