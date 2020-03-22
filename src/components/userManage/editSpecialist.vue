<template>
	<div>
		<el-dialog :visible.sync='editData.isShow' :title='editData.isEdit ? "编辑专家":"新增专家"' width='800px'
			:before-close="closeDialog" :close-on-click-modal='false'>
			<el-form inline :model="editForm" ref='editForm' :rules='rules' labelPosition='right' labelWidth='100px'>
				<el-form-item prop='tel' label='手机号：'>
					<el-input v-model.trim='editForm.tel' @input="checkAvater" size='small' :disabled='editData.isEdit'
						clearable />
					</el-input>
				</el-form-item>
				<el-row class="mt5">
					<el-form-item class="el-col el-col-12 formRedStar" prop='avatar' label='专家头像：'>
						<el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload">
							<img v-if="editForm.avatar" :src="editForm.avatar" class="avatar course-avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon course-avatar"></i>
						</el-upload>
					</el-form-item>
					<el-form-item class="el-col el-col-12" label='专家介绍：'>
						<el-input v-model.trim="editForm.intro" maxlength='1000' class="w217" type='textarea' rows='7' size='small'
							clearable></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item class="el-col el-col-12" prop='name' label='专家名称：' :rules="notEmptyBlur">
						<el-input v-model.trim='editForm.name' size='small' clearable></el-input>
					</el-form-item>
					<el-form-item class="el-col el-col-12" prop='hospital' label='所在医院：' :rules="notEmptyBlur">
						<el-input v-model.trim="editForm.hospital" size='small' clearable></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item class="el-col el-col-12" prop='department' label='科室/专业：' :rules="notEmptyBlur">
						<el-input v-model.trim="editForm.department" size='small' clearable></el-input>
					</el-form-item>
					<el-form-item class="el-col el-col-12" prop='jobTitle' label='职称：' :rules="notEmptyBlur">
						<el-input v-model.trim="editForm.jobTitle" size='small' clearable></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item class="el-col el-col-12" label='专长：'>
						<el-input v-model.trim='editForm.specialty' maxlength="100" type='textarea' rows='5' size='small' clearable>
						</el-input>
					</el-form-item>
					<el-form-item class="el-col el-col-12" prop='enable' label='状态：' :rules="notEmptyChange">
						<el-radio-group v-model="editForm.enable">
							<el-radio :label='true'>启用</el-radio>
							<el-radio :label='false'>停用</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item class="el-col el-col-12" prop='tags' :rules="notEmptyChange" label='标签：'>
						<classifyTag class="mt5" v-model="editForm.tags" :tagType="2" />
					</el-form-item>
					<el-form-item class="el-col el-col-12" prop='isStar' label='明星专家：'>
						<el-switch v-model='editForm.isStar' active-text='是' inactive-text="否"></el-switch>
					</el-form-item>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="save()" :loading="loadingButton">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import { specialAdd, specialEdiet, checkUser } from '@/api/home'
	import classifyTag from '@/components/classifyTag'
	export default {
		props: {
			editData: {
				type: Object,
				default: () => { return {} }
			},
		},
		components: {
			classifyTag
		},
		watch: {
			'editData.isShow'(val, oldVal) {
				if (val) {
					this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
					if (this.editData.isEdit) {
						this.editForm = JSON.parse(JSON.stringify(this.editData.data));
					}
					else {
						this.resetForm();
					}
				}
			}

		},
		data() {
			let checkTel = (rule, value, callback) => {
				if (!value && value !== 0) {
					return callback(new Error('手机号不能为空'));
				}
				if (!this.$utils.PHONE_REG.test(value)) {
					return callback(new Error('手机号格式不正确'));
				}
				callback();
			};
			return {
				loadingButton: false,
				dataList: [],
				userList: [],//用户列表
				editForm: {},
				notEmptyBlur: [
					{ required: true, message: "不能为空", trigger: "blur" }
				],
				notEmptyChange: [
					{ required: true, message: "请选择", trigger: "change" }
				],
				rules: {
					tel: [
						{ required: true, validator: checkTel, trigger: "blur" }
					]
				}
			};
		},
		methods: {
			checkAvater(value) {
				if (value.length == 11 && !this.editData.isEdit) {
					let param = { tel: value }
					checkUser(param).then(res => {
						console.log(res);
						if (res.code === 200 && res.data.count > 0) {
							console.log(res);
							this.$set(this.editForm, 'name', res.data.results[0].nickName);
							this.$set(this.editForm, 'avatar', res.data.results[0].avatar);
						}
						else {
							this.$set(this.editForm, 'name', ''); this.$set(this.editForm, 'avatar', '');
						}
					})
				}
			},
			resetForm() {
				this.editForm = {
					name: '',
					department: '',
					jobTitle: '',
					hospital: '',
					avatar: '',
					isStar: false,
					enable: false,
					intro: '',
					specialty: '',
					tags: [],
				}
			},
			save() {
				this.$refs['editForm'].validate(valid => {
					if (valid) {
						if (!this.editForm.avatar) {
							this.$message.error("必须上传头像"); return;
						}
						if (this.editForm.tags.length == 0) {
							this.$message.error("至少选择一个标签"); return;
						}
						let param = JSON.parse(JSON.stringify(this.editForm));
						console.log(param);
						let apiName = null;
						this.editData.isEdit ? (apiName = specialEdiet, param.uuid = this.editData.data.uuid) : apiName = specialAdd;
						this.loadingButton = true;
						apiName(param).then(res => {
							this.loadingButton = false;
							if (res.code === 200) {
								this.$message.success("成功");
								this.closeDialog();
								this.$emit("freshParent");
							}
						}).catch(res => {
							this.loadingButton = false;
						})
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},

			//上传图
			beforeImgUpload(file) {
				console.log(file);
				const isJPG = ['image/jpeg', 'image/png'].includes(file.type);
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error('上传专家头像只能是 JPG或者PNG 格式!');
					return false
				}
				if (!isLt2M) {
					this.$message.error('上传专家头像大小不能超过 2MB!');
					return false
				}
				this.$uploadFile.checkedFileMD5ByFile(file, data => {
					if (data.url) {
						this.$set(this.editForm, 'avatar', data.url);
					}
				});
				return false;
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

	};
</script>
<style lang="less" scoped>
	.el-input {
		width: 100%;
	}



	.el-form--inline .el-form-item {
		margin-right: 0px;
	}

	.course-avatar {
		width: 100px;
		height: 100px;
		line-height: 100px;
	}

	
</style>