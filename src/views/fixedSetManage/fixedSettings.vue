<template>
  <div class="all-user pr">
    <el-tabs v-model="activeName" @tab-click='handleClick'>
      <el-tab-pane label="轮播图" name="banner">
        <bannerList/>
      </el-tab-pane>
      <el-tab-pane label="大咖直播" name="star"  >
        <starLiveList/>
      </el-tab-pane>
      <el-tab-pane label="非固定栏目展示" name="menu"  >
        <otherMenuList/>
      </el-tab-pane>
      <el-tab-pane label="猜你喜欢" name="guess"  >
        <guessList/>
      </el-tab-pane>
      <el-tab-pane label="搜索词设置" name="hot"  >
        <keyWordList/>
      </el-tab-pane>
      <el-tab-pane label="购买须知管理" name="purchaseInstructions"  >
          <purchaseInstruct/>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import bannerList from '@/components/fixedSettings/bannerList';
import starLiveList from '@/components/fixedSettings/starLiveList';
import otherMenuList from '@/components/fixedSettings/otherMenuList';
import keyWordList from '@/components/fixedSettings/keyWordList';
import guessList from '@/components/fixedSettings/guessList';
import purchaseInstruct from '@/components/fixedSettings/purchaseInstruct';
export default {
  components:{
    bannerList,
    starLiveList,
    otherMenuList,
    keyWordList,
    guessList,
    purchaseInstruct
  },
  data(){
    return{
      activeName: 'banner',
    }
  },
  watch: {
    
  },

  methods:{
    handleClick(e){

    }
  }
}
</script>

<style lang="less" scoped>

</style>
