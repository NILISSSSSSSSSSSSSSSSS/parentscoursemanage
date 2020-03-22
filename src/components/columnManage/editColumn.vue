<template>
	<div>
		<el-dialog :visible.sync='columnObj.isShow' :title='columnObj.isEdit ? "编辑栏目":"新增栏目"' width='500px' :before-close="closeDialog"
			:close-on-click-modal='false'>
			<el-form :model="editForm" ref='editForm' labelPosition='right' labelWidth='100px'>
				<el-form-item prop='name' label='栏目名称：' :rules="notEmptyBlur">
					<el-input v-model.trim='editForm.name' placeholder='栏目名称' size='small' clearable></el-input>
				</el-form-item>
				<el-form-item label='栏目说明：' prop="intro" >
					<el-input v-model.trim='editForm.intro' type='textarea' :rows='5' placeholder='栏目说明' size='small' clearable>
					</el-input>
				</el-form-item>
			</el-form>
			<el-row class="tc">
				<el-button type="primary" @click="saveBtn()">确 定</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>
<script>
import { addColumn,edietColumn } from '@/api/home.js'
	export default {
		props: {
			columnObj: {
				type: Object,
				default: () => { return {} }
			},
		},
		components: {
		},
		data() {
			return {
				roleList: [],
				list: [{ id: 1, name: 'gg' }, { id: 2, name: 'gggwwww' }],
				time: [],
				editForm: {
					name: '',
					intro: ''
				},
				notEmptyBlur: [
					{ required: true, message: "不能为空", trigger: "blur" }
				],

			};
		},
		methods: {
			saveBtn() {
				this.$refs['editForm'].validate(valid => {
					if (valid) {
						let param = {
							name: this.editForm.name,
							intro: this.editForm.intro,
						}
						let apiName=null;
					 this.columnObj.isEdit ? (apiName =edietColumn,param.uuid=this.columnObj.data.uuid) : apiName =addColumn;
						apiName(param).then(res => {
							if (res.code === 200) {
								this.$message.success("成功");
								this.closeDialog();
								this.$emit("freshParent");
							}
						}).catch(res => {

						})
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			closeDialog() {
		
				this.editForm = {
					name: '',
					intro: ''
				}
				let obj = {
					isShowEdit: false, //是否显示编辑弹框
				}
				this.$emit('closeColumn', obj)
			},
		},
		watch: {
			'columnObj.isShow'(val, oldVal) {
				if (val) {
					this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
					if (this.columnObj.isEdit) {
            this.editForm = {
							name: this.columnObj.data.name,
							intro: this.columnObj.data.intro,
						}
					}
					else {
						this.editForm = {
							name: '',
							intro: ''
						}
					}
				}
			}

		}
	};
</script>
<style lang="less" scoped>
	.el-input,
	.el-textarea {
		width: 100%;
	}
</style>