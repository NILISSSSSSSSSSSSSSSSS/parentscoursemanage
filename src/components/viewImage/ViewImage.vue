<template>
    <div class="view-image">
        <!-- 图片、音频.视频查看 -->
        <el-dialog :visible.sync="visible" :title="titset()" width="600px" class="prviewPic">
            <img v-if="type=='picture'" :src="picUrl" alt="" class="preview-pic">
            <video v-if="type=='video'" :src="picUrl" controls></video>
            <audio v-if="type=='audio'" :src="picUrl" controls></audio>
            <div v-if="type=='txt'" >
                {{ picUrl }}
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                picUrl: '',
                visible: false,
                type:""
            }
        },
        methods:{
            titset(){
                console.log(this.type)
                const titleList={"video":"视频",'audio':"音频","picture":"图片","txt":"文本"};
                return `查看${titleList[this.type]}`
            }
        },
        watch: {
            visible(val) {
                !val? this.picUrl="":null;
            }
        }
    }
</script>
<style scoped lang="less">
    .view-image {
        .prviewPic {
            text-align: center;
            img {
                max-width: 100%;
            }
            video {
                max-width: 100%;
            }
        }
    }
</style>
