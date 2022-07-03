<template>
  <!-- 放置一个图标 -->
  <div style="display:inline-block">
    <svg-icon 
      @click="toggleScreen"
      :icon-class=" !isFullScreen ? 'fullscreen' : 'exit-fullscreen'" 
      class="fullscreen" />
  </div>
</template>

<script>
import screenfull from 'screenfull/dist/screenfull.js';
export default {
  name: 'ScreenFull',
  data(){
    return {
      // exit-fullscreen
      isFullScreen:false
    }
  },
  methods:{
    toggleScreen(){
      screenfull.toggle();
      this.isFullScreen = !screenfull.isFullscreen;
     //console.log(screenfull.isFullscreen);
    }
  }
}
</script>

<style lang="scss" scoped>
  .fullscreen {
    width: 20px;
    height: 20px;
    color: #fff;
    cursor: pointer;
  }
</style>