<template>
  <!-- 表单 -->
  <el-form label-width="120px" ref="formRef" :rules="rules" :model="formData">
    <el-form-item label="姓名" prop="username">
      <el-input
        style="width: 50%"
        placeholder="请输入姓名"
        v-model="formData.username"
      />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input
        style="width: 50%"
        placeholder="请输入手机号"
        v-model="formData.mobile"
      />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker
        style="width: 50%"
        placeholder="请选择入职时间"
        value-format="yyyy-MM-d"
        v-model="formData.timeOfEntry"
      />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select
        value=""
        style="width: 50%"
        placeholder="请选择"
        v-model="formData.formOfEmployment"
      >
        <el-option
          v-for="item in hireType"
          :key="item.id"
          :label="item.value"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input
        style="width: 50%"
        placeholder="请输入工号"
        v-model="formData.workNumber"
      />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input
        style="width: 50%"
        placeholder="请选择部门"
        v-model="formData.departmentName"
        @focus="handleFocus"
        
      />
      <div class="tree-box" v-if="showTree">
         <el-tree 
          default-expand-all
          icon-class="none"
          @node-click="handleNodeClick"
          :data="departments" 
          :props="{ label: 'name' }" />
      </div>
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker
        style="width: 50%"
        placeholder="请选择转正时间"
        value-format="yyyy-MM-d"
        v-model="formData.correctionTime"
      />
    </el-form-item>
    <el-form-item>
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleSubmit" type="primary">确定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import EmpConst from "@/constant/employees";
import { getDepartments } from "@/api/departments";
import { trainList2TreeData } from "@/utils";
import {addEmployee} from '@/api/employees'
export default {
  name: "EmpDialog",
  created() {
    
  },
  data() {
    return {
      formData: {
        username: "", // 用户名
        mobile: "", // 手机号
        formOfEmployment: "", // 聘用形式
        workNumber: "", // 工号
        departmentName: "", // 部门
        timeOfEntry: "", // 入职时间
        correctionTime: "", // 转正时间
      },
      hireType: EmpConst.hireType,
      departments: [],
      showTree:false,
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 1, max: 4, message: "用户名为1-4位", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [
          { required: true, message: "请选择入职时间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async loadDepartmentList() {
      try {
        const { data } = await getDepartments();
        data.depts.shift();
        const depts = trainList2TreeData(data.depts);
        this.departments = depts;
        this.showTree = true;
      } catch (err) {
        this.$message.error("加载部门列表失败");
      }
    },
    async addNewEmp(){
      try{
        await addEmployee(this.formData);
        this.$message.success('添加成功');
        
        this.$emit("close");
        this.$emit('update-employee');
      }catch(err){
        this.$message.error('添加失败');
      }
    },
    handleCancel() {
      this.$emit("close");
    },
    handleSubmit() {
      //console.log(this.formData);
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.addNewEmp();
        }
      });
    },
    handleFocus(){
      //console.log('focusll');
      this.showTree = true;
      this.departments.length || this.loadDepartmentList();
    },
    handleNodeClick(data,node){
      //console.log(node);
      if(!node.isLeaf){return}
      //console.log('选中的是', data.name)
      this.formData.departmentName = data.name;
      this.showTree = false;
    },
    resetForm(){
      this.formData = {
         username: '', // 用户名
         mobile: '', // 手机号
         formOfEmployment: '', // 聘用形式
         workNumber: '', // 工号
         departmentName: '', // 部门
         timeOfEntry: '', // 入职时间
         correctionTime: '' // 转正时间
       }
      this.$refs.formRef.resetFields();
    }
  },
};
</script>
<style scoped lang="scss">
  .tree-box{

  }
</style>
