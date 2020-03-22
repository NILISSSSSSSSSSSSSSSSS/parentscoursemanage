<template>
	<div>
		<el-dialog :visible.sync='editData.isShow' :title='editData.isEdit ? "编辑角色":"新增角色"' width='500px'
			:close-on-click-modal='false'>
			<el-form inline :model='editForm' ref='editForm' :rules='rules' labelPosition='right' labelWidth='100px'>
				<el-form-item prop='name' label='角色名称：'>
					<el-input v-model.trim='editForm.name' placeholder='角色名称' clearable></el-input>
				</el-form-item>
				<el-form-item label='角色描述：' prop='remark'>
					<el-input v-model.trim='editForm.remark' placeholder='角色描述' clearable></el-input>
				</el-form-item>
				<el-row>
					<el-form-item label="操作权限：" prop='permissions'>
						<menuTag v-model='editForm.permissions' class="mt5" />
					</el-form-item>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="saveRoles">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import { addRoles, editRoles } from '@/api/home'

	import menuTag from '@/components/rolesManage/menuList'

	export default {
		props: {
			editData: {
				type: Object,
				default: () => { return {} }
			},
		},
		components: {
			menuTag
		},
		data() {
			return {
				editForm: {
					name: '',
					remark: '',
					permissions: []//权限列表
				},
				rules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'change' }
					],
					remark:[
					{ required: true, message: '请输入角色描述', trigger: 'change' }
					],
					permissions: [
						{ required: true, message: '请选择操作权限', trigger: 'change' }
					]
				}
			};
		},
		methods: {
			//提交
			saveRoles() {
				this.$refs['editForm'].validate((valid) => {
					if (valid) {
						if (this.editForm.permissions.length == 0) {
							this.$message.error("请选择操作权限"); return;
						}
						if (this.editData.isEdit) {
							this.edit()
						} else {
							this.add()
						}
					} else {
						return false
					}
				})
			},
			//添加角色
			add() {
				addRoles(this.editForm).then(res => {
					if (res.code === 200) {
						this.$message.success(res.msg || '创建角色成功');
						this.close();
						this.$emit("freshParent");
					}
				})
			},
			//编辑角色
			edit() {
				editRoles(this.editForm).then(res => {
					if (res.code === 200) {
						this.$message.success(res.msg || '编辑角色成功')
						this.close();
						this.$emit("freshParent");
					}
				})
			},
			close() {
				this.$emit('closeMain', true)
			}
		},
		mounted() {

		},
		watch: {
			'editData.isShow'(val, oldVal) {
				if (val) {
					this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
					if (this.editData.isEdit) {
						this.editForm = this.editData.data
						let cc = _.map(this.editForm.permissions, 'uuid')
						this.editForm.permissions = cc;
					}
					else {
						this.editForm = {
							name: '',
							remark: '',
							permissions: []//权限列表
						}
					}
				}
			},

		}
	};
</script>
<style lang="less" scoped>
	.el-input {
		width: 100%;
	}
</style>