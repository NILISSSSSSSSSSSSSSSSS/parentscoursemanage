<template>
    <div class="pagination">
        <el-pagination
            style="margin-top: 10px;margin-right: 20px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="curPage"
            :page-sizes="[10, 20, 50]"
            :page-size="curPageSize"
            background 
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        props: {
            currentPage: {
                type: Number,
                default: 1
            },
            pageSize: {
                type: Number,
                default: 10
            },
            total: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                curPage: this.currentPage,
                curPageSize: this.pageSize,
                totalNum: this.total
            }
        },
        watch: {
            currentPage(val){
                this.curPage = val;
            },
            pageSize(val){
                this.curPageSize = val;
            },
            total(val){
                this.totalNum = val;
            }
        },
        methods: {
            handleSizeChange(val){
                this.curPage = 1;
                this.$emit("change", this.curPage, val)
            },
            handleCurrentChange(val){
                this.$emit("change", val, this.curPageSize)
            }
        },
        mounted(){
            
        }
    }
</script>

<style>
    .pagination .el-input__inner{
        height: 28px;
    }
    .pagination .el-input__icon{
        line-height: 28px;
    }
</style>
