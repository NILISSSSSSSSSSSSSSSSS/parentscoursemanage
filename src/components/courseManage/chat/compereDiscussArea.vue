<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-24 09:55:12
 * @LastEditTime: 2019-09-27 10:46:00
 * @LastEditors: Please set LastEditors
 -->
<template>
  <el-dialog :close-on-click-modal='false' :visible.sync="detailDia" title="讨论区" append-to-body width="800px"
    :before-close="handleClose">
    <div class="box-card" v-loading="loadingAll">
      <p style="padding:15px;font-size: 15px;">只看问题</p>
      <template v-if="list && list.length!==0">
        <div v-for="(item,index) in list" :key="index" class="text item">
          <div class="divLeft">
            <img :src="item.avatar" alt="">
            <div>
              <span class="t1">{{item.username}}</span>
              <span class="t2"> {{ item.msg_time | formatDate }}</span>
              <span class="t1">{{ item.content }}</span>
            </div>
          </div>
          <div class="divRight">
            <el-dropdown size="small" class="mt2" @command="operate" v-if="liveDetail.updateStatus == 5">
              <span class="el-dropdown-link" style="margin-right:10px;">
                <el-button type="text">管理</el-button>
              </span>
              <!-- 这里需要判断身份，管理员和群主 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="(index+',1')">禁言</el-dropdown-item>
                <el-dropdown-item :command="(index+',2')">取消禁言</el-dropdown-item>
                <el-dropdown-item :command="(index+',3')">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="text" v-if="item.isWall">已上墙</el-button>
            <el-button type="text" v-else @click="wallOperate(index)">上墙</el-button>
          </div>
        </div>
        <!--分页组件-->
        <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage">
        </pagination>
      </template>
      <template v-else>
        <div style="    text-align: center;
        font-size: 14px;
        line-height: 50px;">暂无数据</div>
      </template>

    </div>



  </el-dialog>
</template>
<script>
  import { JieKouMessageList, putWall } from "@/api/home";
  import { mapState } from 'vuex'
  export default {
    components: {
    },
    watch: {
      detailDia(val) {
        if (val) {
          this.searchList();
        }
      }
    },
    computed: {
      ...mapState({
        liveDetail: state => state.imInfo.liveDetail,
      }),

    },
    props: {
      chooseData: {

      },
      detailDia: false
    },

    data() {
      return {
        nickName: "",
        list: [],
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },

        loadingAll: false,
      };
    },
    created() { },

    methods: {
      //上墙功能
      wallOperate(index) {
        this.$prompt('请输入内容', '上墙', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (val) => {
            if (!val) {
              return false;
            }
            else {
              return true;
            }
          },
          inputErrorMessage: '请输入内容'
        }).then(({ value }) => {
          this.loadingAll = true;
          this.$store.dispatch('send', { type: "qna", content: value, duration: 0, wallAsker: this.list[index] }).then(res => {
            // 调用标志上墙接口
            putWall({ uuid: this.list[index].from_uid, msgTime: this.list[index].msg_time }).then(res => {
              this.$message.success('成功');
              this.searchList();
              this.loadingAll = false;
            }).catch(err => {
              this.loadingAll = false;
            });

          }).catch(err => {
            this.loadingAll = false;
          });
        })
      },
      operate(val) {
        debugger;
        let obj = val.split(',')
        // 禁言
        if (obj[1] == 1) {
          this.$store.dispatch('MutePeople', { userId: this.list[obj[0]].from_uid, expire: 600 });
          return;
        }
        // 取消禁言
        if (obj[1] == 2) {
          this.$store.dispatch('MutePeople', { userId: this.list[obj[0]].from_uid, expire: 0 }); return;
        }
        // 删除
        else if (obj[1] == 3) {
          this.$store.dispatch('delRecordOne', { uuid: this.list[obj[0]].from_uid, msgTime: this.list[obj[0]].msg_time }).then(success => {
            this.searchList();
            return;
          });
        }

      },
      handleClose() {
        this.$emit("update:detailDia", false);
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      //列表查询gln
      searchList() {
        //获取讨论区列表
        let param = {
          uuid: this.liveDetail.liveRoomId,
          displayPos: "barrage",
          page: this.page.page,
          pageSize: this.page.limit,
          isQuestion: true
        };
        this.loadingAll = true;
        JieKouMessageList(param).then(res => {
          this.loadingAll = false;
          console.log("获取到接口的讨论列表：" + JSON.stringify(res));
          let newArr = [];
          if (res.code == 200 && res.data.results) {
            for (let item of res.data.results) {
              let txt = JSON.parse(item.content);
              txt.sequence = item.msgSeq;
              txt.isWall = item.isWall;
              newArr.push(txt);
            }
            [this.list, this.page.total] = [newArr, res.data.count]
          } else {
            [this.list, this.page.total] = [[], 0]
          }
        }).catch(err => {
          this.loadingAll = false;
          [this.list, this.page.total] = [[], 0];
          this.$message.error(err.msg);
        })
      },
    }
  };
</script>

<style scoped lang="less">
  /deep/ .el-dialog__body {
    max-height: 80vh;
    overflow: auto;
  }

  .item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 10px;
    /* border-bottom: 1px solid #e4e4e4; */
    position: relative;

    &&:before {
      position: absolute;
      content: "";
      width: 97%;
      height: 1px;
      background: #e4e4e4;
      bottom: 0px;
      left: 10px;
      right: 10px;
    }

    .divRight {
      width: 120px;
    }

    .divLeft {
      margin-right: 30px;
      align-items: center;
      display: flex;

      div {
        display: flex;
        justify-content: baseline;
        flex-direction: column;

        span {
          margin-bottom: 3px;
          ;
        }

        .t2 {
          color: gray;
          font-size: 12px;
        }
      }

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }

  /deep/ .el-message-box .el-message-box__input .el-input {
    width: 400px !important;
  }
</style>