import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImg from './UploadImg'
import ImageHolder from './ImageHolder'

export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools);
    Vue.component(UploadExcel.name, UploadExcel);
    Vue.component(UploadImg.name, UploadImg);
    Vue.component(ImageHolder.name,ImageHolder);
  }
}