import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImg from './UploadImg'
import ImageHolder from './ImageHolder'
import Lang from './Lang'
import ScreenFull from './ScreenFull'

export default {
  install(Vue) {
    Vue.component(PageTools.name, PageTools);
    Vue.component(UploadExcel.name, UploadExcel);
    Vue.component(UploadImg.name, UploadImg);
    Vue.component(ImageHolder.name, ImageHolder);
    Vue.component(Lang.name, Lang);
    Vue.component(ScreenFull.name,ScreenFull);
  }
}