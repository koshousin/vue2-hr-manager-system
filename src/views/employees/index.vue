<template>
  <div class="employees-container">
    <div class="app-container">
        <page-tools>
          <template #left>
            <span>总记录数：{{total}}条</span>
          </template>
          <template #right>
            <el-button 
              v-allow="'import_employees'"
              @click="goToImport"
              type="warning" 
              size="small">导入excel</el-button>
            <el-button 
              v-allow="'export_employees'"
              @click="handleExport"
              type="danger" 
              size="small">导出excel</el-button>
            <el-button 
              @click="handleAdd"
              type="primary" 
              size="small">新增员工</el-button>
          </template>
        </page-tools>
        <el-card>
          <el-table border :data="list">
            <el-table-column 
              label="序号" 
              type="index" 
              :index="startIndex"
            />
            <el-table-column label="头像">
              <template slot-scope="scope">
                  <image-holder :src="scope.row.staffPhoto" />
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="username"/>
            <el-table-column label="工号" prop="workNumber" />
            <el-table-column label="聘用形式">
              <template slot-scope="scope">
               {{ formatEmployment(scope.row.formOfEmployment) }}
              </template>
            </el-table-column>
            <el-table-column label="部门" prop="departmentName" />
            <el-table-column 
              sortable
              label="入职时间" 
              prop="timeOfEntry" />
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
                <el-button
                  @click="handleBrowse(scope.row.id)"
                  type="text" 
                  size="small">查看</el-button>
                <el-button 
                  @click="handleAssign(scope.row)"
                  type="text" size="small">分配角色</el-button>
                <el-button
                  @click="handleDelete(scope.row)"
                  type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-row type="flex" justify="center" align="middle" style="height: 60px">
            <el-pagination 
              background
              :total="total"
              :page-size.sync="pageParams.size"
              :page-sizes="[2,5,10]"
              :current-page="pageParams.page"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout="total, sizes,prev, pager, next, jumper" />
          </el-row>
          <el-dialog
            :visible.sync="dialogShow"
            title="新增员工"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="handleDialogClose"
          >
            <emp-dialog 
               ref="AddEmployee"
              @update-employee="handleUpdate"
              @close="handleClose"/>
          </el-dialog>
          <el-dialog 
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            title="分配角色"
            :visible.sync="dialogRoleShow">
            <assign-role
              :id="curId"
              @close="handleAssignClose"
            />
          </el-dialog>  
        </el-card>
    </div>
  </div>
</template>
<script>
  import {getEmployeeList,delEmployee} from '@/api/employees'
  import constEmployees from '@/constant/employees'
  import EnumType from '@/constant/employees'
  import EmpDialog from './empDialog.vue'
  import AssignRole from './assignRole.vue'
  export default {
    name:'Employees',
    components:{EmpDialog,AssignRole},
    created(){
      this.loadEmployeeList(); 
      //console.log('created...');
    },
    data(){
      return {
        list:[],
        total:0,
        // startIndex:1;
        pageParams:{
          page:1,
          size:5
        },
        dialogShow:false,
        dialogRoleShow:false,
        curId:''
      }
    },
    computed:{
      startIndex(){
        return (this.pageParams.page-1)*this.pageParams.size + 1;
      }
    },
    methods:{
      async loadEmployeeList(){
        try{
          const {data} = await getEmployeeList(this.pageParams);
          //console.log(data);
          this.list = data.rows;
          this.total = data.total;
        }catch(err){
          this.$message.error('加载员工数据失败');
        }
      },
      async doDelete(id){
        try{
          await delEmployee(id);
          this.$message.success('删除成功');
          if(this.list.length === 1){
            this.pageParams.page--;
            if (this.pageParams.page <= 0) {
              this.pageParams.page = 1
            }
          }
          this.loadEmployeeList();
        }catch(err){
          this.$message.error('删除失败');
        }
      },
      formatEmployment(num){
        const result = constEmployees.hireType
                        .find(elem => num == elem.id);
        return result.value || '其他'
      },
      handleCurrentChange(curPage){
        this.pageParams.page = curPage;
        //console.log('page changed..',this.pageParams.page );
        this.loadEmployeeList();
      },
      handleSizeChange(curSize){
        //console.log('page changed..',curSize);
        this.pageParams.size = curSize;
        this.loadEmployeeList();
      },
      handleDelete(data){
        //console.log(data);
        this.$confirm(`确定删除 ${data.username}?`,'提示')
          .then(() => {
            this.doDelete(data.id);
          })
          .catch(()=>{})
      },
      handleAdd(){
        this.dialogShow = true;
      },
      handleClose(){
        this.dialogShow = false;
      },
      handleUpdate(){
        this.total++;
        this.pageParams.page = 
        Math.ceil((this.total+1) / this.pageParams.size );
        this.loadEmployeeList();
      },
      handleDialogClose(){
        this.$refs.AddEmployee.resetForm();
      },
      goToImport(){
        this.$router.push('/import');
      }, 
      handleExport(){
        //console.log('exported...');
        import('@/vendor/Export2Excel')
          .then(async excel => {
            //console.log(export_json_to_excel);
            const {data:res} = await getEmployeeList(this.pageParams);
            //console.log(data.rows);
            const { header, data } = this.formatData(res.rows)
            // excel表示导入的模块对象
            //console.log(header, data)
            excel.export_json_to_excel({
              header,// 表头 必填
              data,// 具体数据 必填
              filename: 'excel-list', // 文件名称
              autoWidth: true, // 宽度是否自适应
              bookType: 'xlsx' // 生成的文件类型
            })
          })
          .catch(err => {
            console.log('导出失败。',err);
          })
      },
      formatData(list){
        const map = {
          'id': '编号',
          'password': '密码',
          'mobile': '手机号',
          'username': '姓名',
          'timeOfEntry': '入职日期',
          'formOfEmployment': '聘用形式',
          'correctionTime': '转正日期',
          'workNumber': '工号',
          'departmentName': '部门',
          'staffPhoto': '头像地址'
        }

        let header , data ;
        
        const one = list[0]
        if(!one){
          return {header,data}
        }

        header = Object.keys(one).map(key => map[key])

        // 利用 map Object.values 返回形成了一个二维数组
        data = list.map(obj => {
          const key = obj['formOfEmployment'] // 1, 2
          obj['formOfEmployment'] = EnumType.hireType
                                      .find(item => item.id === key).value
          return Object.values(obj);
        })  

        return {header,data}
      },
      handleBrowse(id){
        this.$router.push({
          name:'employeesDetail',
          query:{
            id
          }
        });
      },
      handleAssign({id}){
        //console.log(id);
        this.curId = id;
        this.dialogRoleShow = true;
      },
      handleAssignClose(){
        this.dialogRoleShow = false;
      }
    }
  }
</script>
<style scoped>
</style>
