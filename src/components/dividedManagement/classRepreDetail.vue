<template>
  <el-dialog :visible.sync='editData.isShow'  title="课代表详情 " append-to-body width="790px" >
    <!-- 课代表详情 -->
    <div class="text item">
      <el-row class="mb20">
        <el-col :span="12">
          <img :src="detail.avatar" class="logo">
          <span> {{ detail.nickName  }}</span>
          <span class="ml10" > {{ detail.isShopper  | isShopper }}</span>
        </el-col>
        <el-col :span="12" class="tr">
          <span v-if='isLock' class="mr20">分销资格已冻结</span>
          <el-button :icon="isLock? 'el-icon-unlock' : 'el-icon-lock'" type="danger" size="small" @click="frozen">{{isLock?'解除冻结':'冻结'}}</el-button>
        </el-col>
      </el-row>
      <el-row class="mb10 bold">经营概况</el-row>
      <el-row class="ml20 mb20">
        <span class="mr20"> 累计分销收入：{{   $math.divide(detail.totalMoney,100)  }}元 </span>
        <span class="mr20"> 已结算：{{ $math.divide(detail.income,100)   }}元 </span>
        <span class="mr20"> 累计分销人数： {{ detail.distributionNum }}</span>
        <span class="mr20"> 累计成交笔数：{{ detail.orderNum }} </span>
      </el-row>
      <el-table border stripe :data="list" v-loading="loading">
        <el-table-column label='交易时间' width='170px'>
            <template slot-scope="{row}">
                {{ row.orderTime  | formatDate }}
              </template>
        </el-table-column>
        <el-table-column label='商品名称' prop="goodsName" width='270px'></el-table-column>
        <el-table-column label='分成金额'>
            <template slot-scope="{row}">
                {{  $math.divide( row.shareMoney,100) }}
              </template>
        </el-table-column>
        <el-table-column label='买家'  width='120px'>
            <template slot-scope="{row}">
                <div class="tableAvaterBox">
                    <img :src="row.avatar" alt="" class="tableAvater">
                  
                  </div>
                  <div> {{ row.nickName }}</div>
              </template>
        </el-table-column>
        <el-table-column label='交易状态'>
            <template slot-scope="{row}">
                {{ row.shareMoneyStatus | shareMoneyStatus}}
              </template>
        </el-table-column>
      </el-table>
      <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    </div>
  </el-dialog>
</template>
<script>
   import { courseRepresManageDetail,courseRepresManageChangeSta } from '@/api/order'
  export default {
    components: {

    },
    props: {
      editData: {
				type: Object,
				default: () => { return {} }
			},

    },

    data() {
      return {
        detail:{},
        list:[],
        loading:false,
        isLock:false,//是否冻结
        page:{
          page:1,
          limit:10,
          total:0
        }
      };
    },
    created() { },
    watch: {
  		'editData.isShow'(val, oldVal) {
				if (val) {
          this.detail=JSON.parse(JSON.stringify(this.editData.data));
          this.searchList();
          this.isLock= this.detail.shareStatus ===2 ? true : false;

				}
			}

    },
    methods: {
      closeDialog() {
				let obj = {
					isShowEdit: false, //是否显示编辑弹框
				}
				this.$emit('closeMain', obj)
      },
      
    
      frozen(){
        let str = !this.isLock ? '确定【冻结】课代表分销资格？此操作不影响已产生的收益结算。':'确定【解除冻结】课代表分销资格？解除后产生的交易收益课代表将可继续结算。'
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param={
            uuid:this.detail.uuid
          }
          courseRepresManageChangeSta(param).then(res => {
							this.loadingButton = false;
							if (res.code === 200) {
                this.$message.success("成功");
                this.isLock = !this.isLock
								// this.closeDialog();
								this.$emit("freshParent");
							}
						}).catch(res => {
						
						})
         
        }).catch(() => {
                   
        });
      },
      searchList() {
        let param = {
          page:this.page.page,
          pageSize:this.page.limit,
          shareUserUuid:this.detail.uuid
        };
        this.loading = true;
        courseRepresManageDetail(param).then(res => {
          if (res.code === 200) {
            if (res.data && res.data.count > 0) {
              [this.list, this.page.total] = [res.data.results, res.data.count]
            }
            else {
              [this.list, this.page.total] = [[], 0]
            }
          }
          this.loading = false;
        }).catch(res => {
          this.loading = false;
        })
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },

    }
  };
</script>

<style scoped lang="less">
  /deep/ .el-dialog {
    max-height: 85vh;
    overflow: auto;
  }

  .logo {
    width: 30px;
    height: 30px;
    vertical-align: middle;
    margin-right: 4px;
  }

  .box-card {
    margin-bottom: 20px
  }
</style>