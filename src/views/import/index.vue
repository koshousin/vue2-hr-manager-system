<template>
  <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
</template>

<script>
  import { formatExcelDate } from '@/utils/index.js'
  import {importEmployee} from '@/api/employees'
  export default {
    name: 'Import',
    data(){
      return {
        excelData:{
          header:'',
          results:null
        }
      }
    },
    methods: {
      async doImport(data){
        try{
          await importEmployee(data);
          this.$message.success('导入数据成功');
          // 导入成功之后页面回退
          this.$router.back();
        }catch(err){
          this.$message.error('上传数据失败');
        }
      },
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1
        if (isLt1M) {
          return true
        }
        this.$message({
          message: 'Please do not upload files larger than 1m in size.',
          type: 'warning'
        })
        return false
      },
      handleSuccess({ header, results }) {
        // header 是excel标题，results 是 excel 内容
        //console.log('header:',header, results)
        const data = this.transExcel(results);
        this.doImport(data);
      },
      transExcel(results){
        const mapInfo = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName',
          '聘用形式': 'formOfEmployment'
        }
        const keys = Object.keys(mapInfo);

        return results.map(item => {
          const transDist = {}
          keys.forEach(key => {
            const enKey = mapInfo[key];
            if(enKey === 'correctionTime' || enKey === 'timeOfEntry'){
              transDist[enKey] = new Date(formatExcelDate(item[key]));
            }else {
              transDist[enKey] = item[key] 
            }
            
          })
          return transDist;
        })

      }
    }
  }
</script>