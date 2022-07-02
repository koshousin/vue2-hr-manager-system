<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="upload"
    >
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-progress
      type="circle"
      class="progress"
      :percentage="percent"
      :stroke-width="8"
      v-if="showProgress"
    >
    </el-progress>
  </div>
</template>
<script>
  import COS from 'cos-js-sdk-v5'
  export default {
    name:'UploadImg',
    props:{
      value:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        percent:0,
        showProgress:false,
        //status:''
      };
    },
    methods: {
      upload(res) {
        console.log(res)
        this.showProgress = true;
        const cos = new COS({
          SecretId: 'AKIDRggPzI0SeaFenvxhANLN9gz3qMccKl10', // 身份识别ID
          SecretKey: 'WliPpypQjsnXzpNdcKl6WidGciyyhBPM' // 身份秘钥
        })
        // 执行上传操作
        cos.putObject({
          Bucket: 'koshousin-1312373222', /* 存储桶 */
          Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
          Key: res.file.name, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file ,// 上传文件对象
          onProgress: function(progressData) { // 实现进度条
              console.log(JSON.stringify(progressData));
              this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          console.log("图片上传：",err || data)
          // 上传成功之后
          if (data.statusCode === 200) {
            const imgUrl = `https:${data.Location}`
            this.$emit('input',imgUrl);
          }else{
            //this.status = 'exception'
          }
          this.showProgress = false;
        })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .progress {
    position: absolute;
    display: flex;
    top: 50%;
    left: 50%;
    width:60px;
    height:60px;
    transform: translate(-50%,-50%);
    background: #fff;
  }
</style>