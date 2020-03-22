<template>
	<div>
		<el-dialog :visible.sync='editData.isShow' :title='editData.isEdit ? "编辑管理员":"新增管理员"' width='500px'
			:before-close='close' :close-on-click-modal='false'>
			<el-form inline :model='editForm' ref='editForm' :rules='rules' labelPosition='right' labelWidth='120px'
				v-loading="loadingTel">
				<el-form-item prop='nickName' label='用户名：' v-if="!normalAdmin.isNormalAdmin">
					<el-input v-model.trim='editForm.nickName' placeholder='用户名' :disabled='editData.isEdit' clearable></el-input>
				</el-form-item>
				<el-form-item prop='roles' label='用户角色：'>
					<el-select v-model='editForm.roles' multiple clearable>
						<el-option v-for='(itm,index) in roleList' :key='index' :label='itm.name' :value='itm.uuid'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop='tel' label='手机号：'>
					<el-input v-model.trim='editForm.tel' placeholder='手机号' :disabled='editData.isEdit' clearable
						@input="vertifyTel()"></el-input>
				</el-form-item>
				<!-- 编辑状态下或者是普通用户情况下不显示密码框， -->
				<el-form-item prop='passwd' label='初始登录密码：' v-if="!(normalAdmin.isNormalAdmin || editData.isEdit)">
					<el-input v-model.trim='editForm.passwd' placeholder='123456'  clearable>
					</el-input>
				</el-form-item>
				<el-form-item prop='managerStatus' label="用户状态：">
					<el-radio-group v-model.number='editForm.managerStatus'>
						<el-radio v-for='(itm,index) in userStatus' v-if="itm.value=== 1 || itm.value=== 3" :key='index'
							:label='itm.value'>{{itm.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<el-row class="tc">
				<el-button @click="editData.isShow = false">取 消</el-button>
				<el-button type="primary" @click="save" :loading="submitLoading">确 定</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>
<script>
	import { getRoles, editUserRoles, normalToAdmin, checkTel, addUserRoles } from '@/api/home'

	export default {
		props: {
			editData: {
				type: Object,
				default: () => { return {} }
			},
		},
		components: {
		},
		data() {
			const checkPhone = (rule, value, callback) => {
				if (!value) {
					callback(new Error("请输入手机号"));
				}
				if (!this.$utils.PHONE_REG.test(value)) {
					callback(new Error("手机号格式不正确"));
				}

				callback();
			};
			const checkPassword = (rule, value, callback) => {
				if (!value) {
					callback(new Error("请输入密码"));
				}
				else if (value.length < 6) {
					callback(new Error("密码不少于6位数"));
				}
				callback();
			};

			return {
				roleList: [],
				submitLoading: false,
				editForm: {
					passwd: "",
					nickName: '',
					tel: '',
					managerStatus: 1,
					roles: []
				},
				loadingTel: false,
				normalAdmin: {
					isNormalAdmin: false,
					uuid: ""
				},

				userStatus: require('@/config').adminStatus,
				rules: {
					nickName: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					tel: [
						{ required: true, validator: checkPhone, trigger: 'blur' }
					],
					passwd: [
						{ required: true, validator: checkPassword, trigger: 'blur' }
					],

					roles: [
						{ required: true, message: '请选择角色', trigger: 'blur' }
					],
					managerStatus: [
						{ required: true, message: '请选择状态', trigger: 'blur' }
					]
				}
			};
		},
		methods: {
			vertifyTel() {
				let val = this.editForm.tel;
				if (val.length == 11) {
					const param = {
						tel: val
					}
					this.loadingTel = true;
					checkTel(param).then(res => {
						this.loadingTel = false;
						if (res.code === 200) {
							// 普通用户
							if (res.data.status == 1) {
								this.normalAdmin = {
									isNormalAdmin: true,
									uuid: res.data.uuid
								}
								this.$message.success('该用户是普通用户，无需填写登录密码和用户名称');
							}
							// 新建用户
							if (res.data.status == 2) {
								this.normalAdmin = { isNormalAdmin: false, uuid: '' }
							}
							// 已经是管理员
							if (res.data.status == 3) {
								this.$message.error(res.msg);
								this.normalAdmin = { isNormalAdmin: false, uuid: '' }
							}

						}
					}).catch(err => {
						this.loadingTel = false;
					})
				}
			},
			save() {
				this.$refs['editForm'].validate(valid => {
					if (valid) {
						if (this.editData.isEdit) {
							this.edit()
						}
						else {
							let apiName = null;
							let param = {};
							if (this.normalAdmin.isNormalAdmin) {
								apiName = normalToAdmin;[param.uuid, param.roles, param.managerStatus] = [this.normalAdmin.uuid, this.editForm.roles, this.editForm.managerStatus];
							} else {
								apiName = addUserRoles; param = { ...this.editForm };
							}
							this.submitLoading = true;
							apiName(param).then(res => {
								this.submitLoading = false;
								if (res.code === 200) {
									this.$message.success(res.msg || '新增成功')
									this.close();
									this.$emit("refresh");
								}
							}).catch(err => {
								this.submitLoading = false;
							})
						}
					} else {
						return false
					}
				})
			},

			//编辑
			edit() {
				let param = { ...this.editForm };
				delete param.passwd;
				this.submitLoading = true;
				editUserRoles(param).then(res => {
					this.submitLoading = false;
					if (res.code === 200) {
						this.$message.success(res.msg || '编辑成功');
						let userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
						if (this.editForm.uuid == userInfo.uuid) {
							this.$message.success('编辑成功,请重新登录');
							this.$utils.loginOutClear()
						}
						else {
							this.close();
							this.$emit("refresh");
						}

					}
				}).catch(err => {
					this.submitLoading = false;
				})
			},
			close() {
				this.$refs['editForm'].resetFields()
				this.$emit('closeMain')
			},
			//获取用户角色列表
			getRolesList() {
				let param = {
					page: 1,
					pageSize: 100000,
				}
				getRoles(param).then(res => {
					if (res.code === 200) {
						this.roleList = res.data.results
					}
				})
			},
		},
		mounted() {
		},
		computed: {
			newObj() {
				this.getRolesList()
				return this.editData.isShow
			}
		},
		watch: {
			newObj(a, b) {
				if (this.editData.isEdit) {
					this.editForm = {
						managerStatus: this.editData.data.managerStatus,
						nickName: this.editData.data.nickName,
						tel: this.editData.data.tel,
						roles: _.map(this.editData.data.roles, 'uuid'),
						uuid: this.editData.data.uuid
					}
				} else {
					this.editForm = {
						nickName: '',
						tel: '',
						managerStatus: 1,
						roles: []
					};
					this.normalAdmin = {
						isNormalAdmin: false,
						uuid: ''
					}
				}

			}
		}
	};
</script>
<style lang="less" scoped>

</style>