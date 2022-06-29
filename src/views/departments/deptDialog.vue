<template>
  <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px" >
    <el-form-item label="部门名称" prop="name">
      <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门编码" prop="code">
      <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门负责人" prop="manager">
      <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
        <el-option 
          v-for="item in employees" 
          :key="item.id" 
          :value="item.username" 
          :label="item.username" />
      </el-select>
    </el-form-item>
    <el-form-item label="部门介绍" prop="introduce">
      <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
      <el-button size="small" @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {getEmployeesSimple} from '@/api/employees'
  import {
    addDepartments,
    getDepartmentsById,
    updateDepartments
  } from '@/api/departments'
  export default {
    name:'DeptDialog',
    created(){
      // 编辑模式下获取数据做回填
      // console.log('created hook exec...',this.id);
      this.getDepartDetail();
    
      this.getEmployees();
      
    },
    props:{
      id:{
        type:String,
        required:true
      },
      isEdit:{
        type:Boolean,
        required:true
      },
      originList:{
        type:Array,
        required:true
      }
    },
    data(){
      const checkName = (rule,value,callback) => {
        // 部门名称校验规则:同级不重复
        let childrenName = null;
        if(!this.isEdit){
          childrenName = this.originList.filter(item => item.pid === this.id).map(item => item.name);
         
        }else {
          const curDepart = this.originList.find(item => item.id === this.id);
          childrenName = 
              this.originList
                .filter(item => item.pid === curDepart.pid && item.id !== this.id)
                .map(item => item.name);
        }
        //console.log('子部门：',childrenName);
        childrenName.includes(value)
            ? callback(new Error('部门名字已存在！'))
            : callback();
      }

      const checkCode = (rule,value,callback) => {
        const findResult = this.originList.find(item => item.code === value)
        if(findResult){
          if(this.isEdit){
            //console.log('find result:',findResult.id,"id:",this.id);
            (findResult.id === this.id) 
              ? callback() 
              : callback(new Error(`编码${value}选择错误！`));
          }else {
            callback(new Error(`编码${value}已存在！`));
          }
        }else {
          callback();
        }
      }
      return {
        labelPosition:'right',
        employees:[],
        form: {
          name: '', // 部门名称
          code: '', // 部门编码
          manager: '', // 部门管理者
          introduce: '' // 部门介绍
        },
        rules: {
          name: [
            { required: true, message: '部门名称不能为空', trigger: 'blur'},
            { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger:'blur'},
            {validator:checkName,trigger:'blur'}
          ],
          code: [
            { required: true, message: '部门编码不能为空', trigger: 'blur'},
            { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur'},
            {validator:checkCode,trigger:'blur'}
          ],
          manager: [
            { required: true, message: '部门负责人不能为空', trigger: 'blur'}
          ],
          introduce: [
            { required: true, message: '部门介绍不能为空', trigger:'blur'},
            { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      async getEmployees(){
        try{
          const {data} = await getEmployeesSimple();
          this.employees = data;
          //console.log(data);
        }catch(err){
          console.log('请求员工失败。');
        }
      },
      handleSubmit(){
        this.$refs.deptForm.validate(async valid => {
          //console.log('valid:',valid);
          if(valid){
            try{
              if(this.isEdit){      // 编辑
                const res = await updateDepartments(this.form);
                this.$message({
                  type:'success',
                  message:'修改成功'
                })
                console.log(res);
              }else{    // 添加
                const params = {...this.form,pid:this.id}
                const res = await addDepartments(params);
                this.$message({
                  type:'success',
                  message:'添加成功'
                })
                console.log(res);
              }
              //this.form = {}
              this.$emit('success')
            }catch(err){
              this.$message({
                type:'error',
                message:'添加或编辑失败'
              })
              //console.log('添加或编辑失败');
            }
          }else{
            alert('请填写完整。');
          }
        })
      },
      async getDepartDetail(){
        try{
          if(this.isEdit){
            const res = await getDepartmentsById(this.id);
            this.form = res.data;
            //console.log('executed:',res);
          }
        }catch(err){
          console.log('获取部门详情失败。');
        }
      },
      handleCancel(){
        // this.resetForm();  // 重置表单
        this.$emit('close');
      },
      resetForm(){
        this.$refs.deptForm.resetFields();
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
