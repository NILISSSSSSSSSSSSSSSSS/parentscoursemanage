<template>
  <div class="all-user pr">
    <el-tabs v-model="activeName">
      <el-tab-pane label="新手任务" name="newbieTask">
        <newbieTask />
      </el-tab-pane>
      <el-tab-pane label="学习任务" name="star">
        <newbieTask />
      </el-tab-pane>
      <el-tab-pane label="分享任务" name="menu">
        <newbieTask />
      </el-tab-pane>
      <el-tab-pane label="签到任务" name="guess">
          <signInTask />
      </el-tab-pane>
      <el-tab-pane label="活动任务" name="hot">
        
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import newbieTask from '@/components/IntegralTask/newbieTask';
  import signInTask from '@/components/IntegralTask/signInTask';

  export default {
    components: {
      newbieTask,
      signInTask
    },
    data() {
      return {
        activeName: 'newbieTask',
      }
    },
    watch: {

    },

    methods: {

    }
  }
</script>

<style lang="less" scoped>

</style>