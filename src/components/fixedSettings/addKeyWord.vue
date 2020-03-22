<template>
	<div>
		<el-dialog :visible.sync='menuObj.isShow' title='新增关键词' width='600px' :close-on-click-modal='false'>
			<el-form @submit.native.prevent :model="editForm" ref='editForm' :rules='rules' labelPosition='right'
				labelWidth='130px'>
				<el-form-item prop='keyword' label='关键词：' :rules="notEmptyBlur">
					<el-input placeholder='关键词' clearable v-model='editForm.keyword' size="small"></el-input>
				</el-form-item>
				<el-form-item prop='icon' label='是否是热搜词：' :rules="notEmptyChange">
					<el-radio-group v-model='editForm.icon'>
						<el-radio :label='true'>是</el-radio>
						<el-radio :label='false'>否</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item prop='status' label="启用状态：" :rules="notEmptyChange">
					<el-radio-group v-model='editForm.status'>
						<el-radio :label='1'>启用</el-radio>
						<el-radio :label='2'>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog()">取 消</el-button>
				<el-button type="primary" @click="save()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import { keyworldAdd ,keyworldEdiet} from '@/api/home'
	export default {
		props: {
			menuObj: {
				type: Object,
				default: () => { return {} }
			},
		},
		components: {
		},
		data() {
			return {
				editForm: {
					keyword:"",
					icon:true,
					status:null
				},
				rules: {
				},
				notEmptyBlur: [
					{ required: true, message: "不能为空", trigger: "blur" }
				],
				notEmptyChange: [
					{ required: true, message: "不能为空", trigger: "change" }
				],
			};
		},
		methods: {
			save() {
				this.$refs['editForm'].validate(valid => {
					if (valid) {
						let param = {
							keyword: this.editForm.keyword,
							status: +this.editForm.status,
							icon:this.editForm.icon,
						};
						console.log(param);
						let apiName=null;
						this.menuObj.isEdit ? (apiName = keyworldEdiet, param.uuid = this.editForm.uuid) : apiName = keyworldAdd;
						apiName(param).then(res => {
							if (res.code === 200) {
								this.$message.success("成功");
								this.$emit("freshParent");
								this.closeDialog();
							}
						}).catch(res => {
						})

					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			resetForm() {
				this.editForm = {
					keyword:"",
					icon:true,
					status:null
				}
			},
			closeDialog() {
			
				let obj = {
					isShowEdit: false, //是否显示编辑弹框
				}
				this.$emit('closeMain', obj)
			},
		},
		mounted() {
			// this.searchList()		
		},

		watch: {
			'menuObj.isShow'(val, oldVal) {
				if (val) {
					this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
					if(this.menuObj.isEdit){
						this.editForm=JSON.parse(JSON.stringify(this.menuObj.data))
					}
					else{
						this.resetForm();
					}
				
				}
			}
		}
	};
</script>
<style lang="less" scoped>
	.banner-avatar {
		width: 192px;
		height: 108px;
	}
</style>