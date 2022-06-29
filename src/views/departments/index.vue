<template>
  <div class="departments-container">
    <div class="app-container">
        <el-card>
          <!-- 行列布局 -->
          <el-row type="flex" justify="center" align="middle" style="height:40px">
            <el-col :span="20">
              <svg-icon icon-class="home" />
              <span>江苏传智播客教育科技股份有限公司</span>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>负责人</el-col>
                <!-- 下拉菜单 element -->
                <el-col>
                  <el-dropdown>
                    <span>
                      操作<i class="el-icon-arrow-down" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item 
                        @click.native="addSubDepart('')"
                      >添加子部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-tree 
            :data="list" 
            :default-expand-all="true"
          >
            <!-- 作用于插槽, 自定义结构 -->
            <template #default="{ data }">
               <el-row
                type="flex"
                justify="space-between"
                align="middle"
                style="height: 40px; width: 100%;"
              >
                <el-col :span="20">
                  <span>{{ data.name }}</span>
                </el-col>
                <el-col :span="4">
                  <el-row type="flex" justify="end">
                    <!-- 两个内容 -->
                    <el-col>{{ data.manager }}</el-col>
                    <el-col>
                      <!-- 下拉菜单 element -->
                      <el-dropdown>
                        <span> 操作<i class="el-icon-arrow-down" /> </span>
                        <!-- 下拉菜单 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item 
                            @click.native="addSubDepart(data.id)">添加子部门</el-dropdown-item>
                          <el-dropdown-item
                            @click.native="editDepart(data.id)">编辑部门</el-dropdown-item>
                          <el-dropdown-item
                            v-if="data.children.length===0"
                            @click.native="deleteDepart(data.id)"
                          >删除部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-tree>
        </el-card>
    </div>
    <el-dialog 
      :title="isEdit ? '编辑' : '添加' " 
      :close-on-click-modal="false"
      :close-on-press-escape='false'
      @close="handleDialogClose"
      :visible.sync="showDialog">
      <dept-dialog 
        ref="deptDialog"
        :is-edit = "isEdit"
        :id="curId" 
        :originList="originList"
        @success="handleSuccess"
        @close="handleClose"
       />
    </el-dialog>
  </div>
</template>
<script>
  import {getDepartments,deleteDepartments} from '@/api/departments'
  import {trainList2TreeData} from '@/utils/index.js'
  import DeptDialog from './deptDialog.vue'
  export default {
    name:'Department',
    components:{'dept-dialog':DeptDialog},
    data(){
      return{
        list:[],
        showDialog:false,
        curId : '' ,  // 点击添加时的部门ID
        isEdit:false,
        // 避免添加重复我们需要一个校验数据
        originList:[]
      }
    },
    methods:{
      async loadDepartments(){
        try{
          const {data} = await getDepartments();  
          const root = data.depts.shift();
          root.children = trainList2TreeData(data.depts);
          this.list = [root];
          this.originList = data.depts.map( ({id,pid,code,name}) => ({id,name,code,pid}))
          //console.log(data.depts);
        }catch(err){
          console.log('加载部门信息出错了');
        }
      },
      async deleteDepart(id){
        this.$confirm(
          '此操作将永久删除部门, 是否继续?',
          '提示'
        )
        .then(async () => {
          try{
            const res = await deleteDepartments(id);
            this.$message({ type: 'success', message: '删除成功!' });
            this.loadDepartments();   // 更新数据
            //console.log(res);
          }catch(err){
            this.$message({ type: 'error', message: '删除失败' })
          }
        })
        .catch(err => {
          //console.log(err);
         
        })
      },
      addSubDepart(id){
        this.showDialog = true;
        this.curId = id;
        this.isEdit = false;
      },
      editDepart(id){
        this.isEdit = true;
        this.curId = id;
        this.showDialog = true;
        // 编辑时重新获取详情
        this.$nextTick(() => {
          // console.log('获取子组件的引用', this.$refs.deptDialog)
          // console.log('当前的curId', id)
          // console.log('获取到子组件中的id--从父传入的', this.$refs.deptDialog.id)
          // 调用子组件的方法
          this.$refs.deptDialog.getDepartDetail()
        })
      },
      handleSuccess(){
        this.showDialog = false;
        // 再次更新数据
        this.loadDepartments()
      },
      handleClose(){
        this.showDialog = false;
        this.isEdit = false;
      },
      handleDialogClose(){
        this.isEdit = false;
        this.$refs.deptDialog.resetForm();
      }
    },
    mounted(){
     this.loadDepartments();
    }
  }
</script>
<style scoped>
</style>
