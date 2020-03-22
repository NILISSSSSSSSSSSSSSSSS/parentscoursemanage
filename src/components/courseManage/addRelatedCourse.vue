<template>
	<div>
		<el-dialog :visible.sync='couresData.isShow' title='添加相关课程' width='500px' :close-on-click-modal='false'>
			<el-form>
				<el-form-item label='选择类型'>
					<el-radio-group v-model='editForm.courseType'>
						<el-radio label='course'>课程</el-radio>
						<!-- <el-radio label='subject'>专题</el-radio> -->
					</el-radio-group>
				</el-form-item>
				<el-form-item label='选择课程'>
					<el-select class="course-select" :remote-method='searchList' v-model='editForm.relatedCourse' value-key='uuid' size='small' placeholder='请输入课程名搜索' remote reserve-keyword multiple clearable filterable>
						<el-option v-for='(itm,index) in dataList' :key='index' :label='itm.name' :value='itm' :disabled='itm.uuid === couresData.data.courseId'></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="couresData.isShow = false">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import {searchCourse} from '@/api/home'
export default {
	props:{
		couresData:{
			type:Object,
			default:()=>{return {}}
		},
	},
  data() {
    return {
			dataList: [],
			editForm:{
				courseType:'course',
				relatedCourse:[]
			}
    };
	},
	methods:{
		save(){
			if(!this.editForm.relatedCourse.length){
				this.$message.warning('您本次未添加相关课程~')
			}
			this.$emit('closeMain',this.editForm.relatedCourse)
			this.editForm.relatedCourse = []
			this.couresData.isShow = false
		},
		//选值变化
		getChange(){
			console.log('change',this.editForm.relatedCourse);
			
		},
		//列表查询
    searchList(e){
			let param = {
				page: 1,
				pageSize: 10000,
				name: e
			}
      searchCourse(param).then(res => {
        if(res.code === 200){
					this.dataList = res.data.results
        }
      })
		},
	},
	mounted(){	
	},
	computed:{
		newObj(){
			return this.couresData.data.courseId
		}
	},
	watch:{
		newObj(a,b){
			if(a){
			  let idx = _.map(this.dataList,'uuid').indexOf(this.couresData.data.courseId)
				this.dataList = this.dataList.splice(idx,1)
				console.log(idx,this.dataList);
				
			}
		},
		deep:true,
		immediate: true,
	}
};
</script>
<style lang="less">
	.course-select {
		width: 300px!important;
		.el-input{
			width: 300px!important;
		}
		.el-select__tags{
			max-width: none!important;
		}
	}

</style>