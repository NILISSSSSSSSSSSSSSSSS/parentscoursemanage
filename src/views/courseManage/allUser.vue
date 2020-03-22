<template>
  <div class="all-user pr">
    <el-button @click='goCreate' class="creat-btn pa" type='primary' icon='el-icon-plus' size='small'>
      创建{{activeName === 'seriesLession' ? '系列课' : '单次课'}}</el-button>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="系列课" name="seriesLession">
        <series-lession>
        </series-lession>
      </el-tab-pane>
      <el-tab-pane label="单次课" name="singleLession">
        <single-lession>
        </single-lession>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
  import singleLession from '@/components/courseManage/singleLession';
  import seriesLession from '@/components/courseManage/seriesLession';


  export default {
    components: {
      singleLession,
      seriesLession
    },
    data() {
      return {
        activeName: 'seriesLession',
      }
    },
    watch: {
      $route: {
        handler: function (val, oldVal) {
          let pathName = val.path;
          this.activeName = pathName.includes('seriesLession') ? 'seriesLession' : 'singleLession';
        },
        // 深度观察监听
        deep: true,
        immediate: true,
      }
    },

    methods: {
      //跳转创建课程页
      goCreate() {
        this.$router.push({
          path: '/createCourse',
          query: {
            courseType: this.activeName === 'seriesLession' ? 2 : 1
          }
        })
      },
      handleClick(tab, event) {
        this.$router.push(`/${tab.name}`);
      }
    }
  }
</script>

<style lang="less" scoped>
  .creat-btn {
    right: 0px;
    z-index: 5;
  }
</style>