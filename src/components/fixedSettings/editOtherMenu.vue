<template>
	<div>
		<el-dialog :visible.sync='menuObj.isShow' :title='menuObj.isEdit ? "编辑其他课程栏目":"新增其他课程栏目"' class="small-form-item"
			width='600px' :close-on-click-modal='false'>
			<el-form inline class="otherForm" :model="editForm" :rules='rules' ref='editForm' labelPosition='right' labelWidth='120px'>
				<el-form-item prop='uuid' label='选择栏目：'>
					<el-select v-model='editForm.uuid' size='small' clearable @change="changeCourseList">
						<el-option v-for='(itm,index) in bannerType' :key='index' :label='itm.name' :value='itm.uuid'></el-option>
					</el-select>
				</el-form-item>

				<el-form-item prop='showType' label='排列方式：'>
					<el-radio-group v-model='editForm.showType' @change="changeShowType">
						<el-radio label='1'>横排</el-radio>
						<el-radio label='2'>竖排</el-radio>
					</el-radio-group>
					<div class="tips">横排则独占一行显示，竖排则两个课程排一行</div>
				</el-form-item>
				<el-form-item prop='showNum' label='展示数量：'>
					<el-select v-model.number='editForm.showNum' size='small' clearable>
						<el-option v-if="editForm.showType==='1'" v-for='n in 10' :key='n' :label='n' :value='n'></el-option>
						<el-option v-if="editForm.showType==='2'" v-for='n in numberList' :key='n' :label='n' :value='n'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop='courseIdBox' label='首页展示课程：' >
					<el-select v-model='editForm.courseIdBox'  size='small' 
						multiple filterable clearable>
						<el-option v-if="itm.courses && itm.courses.length!==0" v-for='(itm,index) in courseList' :key='index'
							:label='itm.courses[0].name' :value='itm.courses[0].uuid'></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-table :data='list' class="mt5" stripe border v-loading="loading">
			
				<el-table-column prop='courses[0].uuid' label='id'></el-table-column>
				<el-table-column prop='courses[0].name' label='课程名称'></el-table-column>
				<el-table-column label='操作' width='200px'>
					<template slot-scope='scope'>
						<el-tooltip class="item" effect="dark" content="向上" placement="top">
							<el-button @click="changeSort('up',scope.$index)" class="" icon="el-icon-top" circle></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="向下" placement="top">
							<el-button @click="changeSort('down',scope.$index)" class="" icon="el-icon-bottom" circle></el-button>
						</el-tooltip>
						<el-button type='danger' size='small' @click="del(scope.row.uuid)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog()">取 消</el-button>
				<el-button type="primary" @click="save()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import { otherMenuCourse, columnList, edietoOtherMenu, addOtherMenu } from '@/api/home'
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
				loading: false,
				roleList: [],
				list: [],
				time: [],
				bannerType: [
				],
				courseList: [],
				editForm: {
					courseIdBox: [],
					uuid: '',
					showNum: 1,
					showType: '1'
				},
				numberList: [2, 4, 6, 8, 10],
				rules: {
					uuid: [
						{ required: true, message: '请选择栏目', trigger: 'change' }
					],
					showType: [
						{ required: true, message: '请选择排列方式', trigger: 'change' }
					],
					showNum: [
						{ required: true, message: '请选择展示数量', trigger: 'change' }
					],
					courseIdBox: [
						{ required: true, message: '请选择展示课程', trigger: 'change' }
					]
				}
			};
		},
		methods: {
			resetForm() {
				this.editForm = {
					courseIdBox: [],
					uuid: '',
					showNum: 1,
					showType: '1'
				}
			},
			save() {
				this.$refs['editForm'].validate(valid => {
					if (valid) {
						if (this.editForm.courseIdBox && this.editForm.courseIdBox.length == 0) {
							this.$message.error("课程不能为空"); return;
						}
						if (this.editForm.courseIdBox.length < Number(this.editForm.showNum)) {
							this.$message.error('首页展示课程数量必须大于等于展示数量'); return;
						}
						let param = {
							showType: this.editForm.showType,
							sectionUuid: this.editForm.uuid,
							showNum: this.editForm.showNum,
						}
						let box = [];
						for (let item of this.list) {
							box.push(item.courses[0].uuid)
						}
						param.courses = box;
						console.log(param);
						let apiName = null;

						this.menuObj.isEdit ? (apiName = edietoOtherMenu, param.uuid = this.editForm.uuid) : apiName = addOtherMenu;
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
			changeShowType(val) {
				this.editForm.showNum = val == 2 ? 2 : 1;
			},
			//删除，秩序操作courseIdBox就行，courseIdBox变化了表格List的数据自然会跟着变
			del(val) {
				let arr = this.editForm.courseIdBox;
				arr.splice(arr.findIndex(item => item == val), 1)
			},
			//栏目列表查询
			getColumnList() {
				let param = {
					pageSize: 10000,
					enable:1,
				}
				this.loading = true;
				columnList(param).then(res => {
					if (res.code === 200) {
						if (res.data && res.data.count > 0) {
							console.log("栏目数据：" + JSON.stringify(res.data.results));
							this.bannerType = res.data.results;
						}
						else {
							this.bannerType = [];
						}
					}
					this.loading = false;
				}).catch(res => {
					this.loading = false;
				})
			},
			//获取编辑状态下需要回显的课程
			getEdietShowClass() {
				let param = {
					pageSize: 1000,
					sectionUuid: this.editForm.uuid,
					status: 1
				}
				this.loading = true;
				otherMenuCourse(param).then(res => {
					if (res.code === 200) {
						this.loading = false;
						console.log("需要回显的课程数据：" + JSON.stringify(res.data.results));
						if (res.data && res.data.count > 0) {
							let box = [];
							for (let item of res.data.results) {
								let obj = item.courses && item.courses.length !== 0 ? item.courses[0] : []; box.push(obj.uuid)
							}
							this.$set(this.editForm, 'courseIdBox', box)
							console.log(this.editForm.courseIdBox);
						}
						else {
							this.$set(this.editForm, 'courseIdBox', [])
						}
					}
				}).catch(res => {
					this.loading = false;
				})
			},
			changeSort(type, index) {
				let newArr = JSON.parse(JSON.stringify(this.list));
				if (type == "up") {
					index - 1 < 0 ? (this.$message.error("已经是第一个了")) : [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
				}
				if (type == 'down') {
					index + 1 > newArr.length - 1 ? (this.$message.error("已经是最后一个了")) : [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
				}
				this.$set(this, 'list', newArr);
			},
			closeDialog() {
			
				let obj = {
					isShowEdit: false, //是否显示编辑弹框
				}
				this.$emit('closeMain', obj)
			},
			// 获取所有课程列表
			changeCourseList() {
				this.getCourseList().then(() => {
					this.editForm.courseIdBox = [];
				}).catch(err => {
					console.log(err)
				})
			},
			//所有课程列表
			getCourseList(success) {
				return new Promise((resolve, reject) => {
					let param = {
						pageSize: 1000,
						sectionUuid: this.editForm.uuid,
					}
					otherMenuCourse(param).then(res => {
						if (res.code === 200) {
							console.log('所有课程数据' + JSON.stringify(res.data.results));
							if (res.data && res.data.count > 0) {
								this.courseList = res.data.results;
								resolve()
							}
							else {
								this.courseList = []; this.editForm.courseIdBox = [];
								reject()
							}
							reject()
						}
					}).catch(res => {
						reject()
					})
				})
			},
		},
		mounted() {
			this.getColumnList();
		},
		watch: {
			'editForm.courseIdBox'(box) {
				console.log(box);
				if (box && box.length !== 0) {
					this.list = this.courseList.filter(val => {
						let obj = val.courses && val.courses.length !== 0 ? val.courses[0] : [];
						return box.includes(obj.uuid)
					})
				}
				else {
					this.list = [];
				}
			},
			'menuObj.isShow'(val, oldVal) {
				if (val) {
					this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
					if (this.menuObj.isEdit) {
						this.editForm = JSON.parse(JSON.stringify(this.menuObj.data));
						this.editForm.showType = '' + this.editForm.showType;
						//重新获取所有课程列表
						this.getCourseList().then(() => {
							//获取需要回显的课程
							this.getEdietShowClass();
						}).catch(err => {
							console.log(err)
						})
					}
					else {
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
/deep/ .otherForm	.el-input {
    width: 300px;
}
</style>