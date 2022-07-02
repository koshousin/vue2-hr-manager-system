<template>
  <div class="permissions-container">
    <div class="app-container">
        <el-card>
          <div style="text-align: right; margin-bottom: 20px">
            <el-button 
              @click="handleAdd(1,'0')"
              type="primary" 
              size="small">添加权限</el-button>
          </div>
          <el-table 
            border 
            row-key="id"
            :data="permissionList">
            <el-table-column label="名称" prop="name" />
            <el-table-column label="标识" prop="code" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作" >
              <template #default="{ row }">
                <el-button 
                  v-if="row.type === 1"
                  @click="handleAdd(2,row.id)"
                  type="text">添加</el-button>
                <el-button 
                  @click="handleEdit(row.id)"
                  type="text">编辑</el-button>
                <el-button
                  @click="handleDel(row)"
                  type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog 
            :visible.sync="dialogShow"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="handleClose"
            :title="isEdit ? '编辑权限' : '添加权限' ">
            <el-form 
              ref="formRef" 
              label-width="100px"
              :model="formData"
              :rules="rules"
            >
              <el-form-item label="权限名称" prop="name">
                <el-input
                  v-model="formData.name" />
              </el-form-item>
              <el-form-item label="权限标识" prop="code">
                <el-input
                  v-model="formData.code" />
              </el-form-item>
              <el-form-item label="权限描述" prop="description">
                <el-input
                  v-model="formData.description" />
              </el-form-item>
              <el-form-item label="权限启用">
                <el-switch
                  v-model="formData.enVisible"
                  active-text="启用"
                  inactive-text="不启用">
                </el-switch>
              </el-form-item>
            </el-form>

            <template #footer>
              <el-row type="flex" justify="center">
                <el-button @click="dialogShow = false">取消</el-button>
                <el-button @click="handleSave" type="primary">确定</el-button>
              </el-row>
            </template>
          </el-dialog>
        </el-card>
    </div>
  </div>
</template>
<script>
  import {
    getPermissionList,
    getPermissionDetail,
    updatePermission,
    addPermission,
    delPermission
  } from '@/api/permission'
  import {trainList2TreeData} from '@/utils'
  export default {
    name:'Permissions',
    created(){
      this.loadPermissionList();
    },
    data(){
      // 要分编辑时和添加时两种情况
      const validateName = (_,value,callback)=> {
        let totalName = null,totalElem=null;
        totalElem = this.permissionList
                      .filter(item => {
                        return (item.pid===this.formData.pid )
                      })
        if(this.isEdit){
          totalElem = totalElem.filter(item => item.code !== this.formData.code)
        }
        totalName = totalElem.map(item => item.name);
        //console.log(totalName);
        if(!totalName.map(item => item.trim()).includes(value)){
          callback();
        }else {
          callback(new Error('权限名称不能重复'));
        }
      }

      const validateCode = (_,value,callback) => {
        let totalElem = this.permissionList.reduce((total,cur)=>{
          return [...cur.children,cur,...total]
        },[])

        if(this.isEdit){
          totalElem = totalElem
                        .filter(item => item.id !== (this.formData.id || this.formData['_id']))
        }

        let totalCode = totalElem.map(item => item.code)

        //console.log(totalCode);

        if(!totalCode.includes(value)){
          callback();
        }else {
          callback(new Error('权限标识必须唯一'));
        }
      }
      return {
        permissionList:[],
        dialogShow:false,
        formData: {
          name: '', // 名称
          code: '', // 权限标识
          description: '', // 描述
          enVisible: '0', // 开启
          pid: '', // 添加到哪个节点下
          type: '' // 类型
        },
        rules:{
          name:[
            {required:true,message:'权限名称不能为空',trigger:'blur'},
            {validator:validateName,trigger:'blur'}
          ],
          code:[
            {required:true,message:'权限标识不能为空',trigger:'blur'},
            {validator:validateCode,trigger:'blur'}
          ],
          description:[
            {required:true,message:'请写一些权限描述',trigger:'blur'}
          ]
        },
        isEdit:false
      }
    },
    methods:{
      async loadPermissionList(){
        try{
          const {data} = await getPermissionList();
          //console.log(data);
          //this.permissionList = trainList2TreeData(data);
          //console.log(trainList2TreeData(data));
          this.permissionList = trainList2TreeData(data);
        }catch(err){
          this.$message.error('加载权限列表失败');
        }
      },
      async loadPermissionDetail(id){
        try{
          const{ data }= await getPermissionDetail(id);
          //console.log(data);
          this.formData = data;
        }catch(err){
          this.$message.error('获取权限详情失败');
        }
      },
      async doAddPermission(){
        try {
          await addPermission(this.formData);
          this.loadPermissionList();
          this.dialogShow = false;
          this.$message.success('添加权限成功');
        }catch(err){
          this.$message.error('添加权限失败');
          console.log(err);
        }
      },
      async doDelPermission(id){
        try{
          await delPermission(id);
          this.$message.success('删除权限成功');
          this.loadPermissionList();
        }catch(err){
          this.$message.error('删除权限失败');
        }
      },
      async doUpdatePermission(){
        try{  
          await updatePermission(this.formData);
          this.$message.success('权限保存成功');
          this.loadPermissionList();
          this.dialogShow = false;
        }catch(err){
          this.$message.error('权限保存失败');
        }
      },
      handleAdd(type,pid){
        this.isEdit = false;
        this.dialogShow = true;
        this.formData.pid = pid;
        this.formData.type = type;
        //console.log(pid);
      },
      handleSave(){
        this.$refs.formRef.validate(valid => {
          if(!valid){
            return ;
          }
          this.isEdit 
            ? this.doUpdatePermission()
            : this.doAddPermission();
        })
      },
      handleClose(){
        this.formData = {
          name: '', // 名称
          code: '', // 权限标识
          description: '', // 描述
          enVisible: '0', // 开启
          pid: '', // 添加到哪个节点下
          type: '' // 类型
        }
        this.$refs.formRef.resetFields();
      },
      handleDel({name,id}){
        this.$confirm(`你确定删除 ${name} 权限吗?`,'Warning')
          .then(() =>{
            this.doDelPermission(id);
          })
          .catch(()=>{})
      },
      handleEdit(id){
        this.isEdit = true;
        this.loadPermissionDetail(id);
        this.dialogShow = true;
      }
    }
  }
</script>