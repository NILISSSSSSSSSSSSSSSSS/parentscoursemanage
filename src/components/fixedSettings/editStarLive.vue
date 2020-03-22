<template>
	<div>
		<el-dialog :visible.sync='menuObj.isShow' :title='menuObj.isEdit ? "编辑大咖直播":"新增大咖直播"' width='600px'
			:close-on-click-modal='false'>
			<el-form inline :rules='rules' :model="editForm" ref='editForm' labelPosition='right' labelWidth='100px'>
				<el-form-item prop='course' :rules="notEmptyBlur" label='跳转课程：'>
					<el-select :remote-method='getNowGoods' placeholder="请搜索课程名称" v-model='editForm.course' class="w200 ml10" size='small' filterable
						remote reserve-keyword clearable>
						<el-option v-for='(itm,index) in goodsList' :key='index' :label='itm.name' :value='itm.uuid'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop='icon' label='条幅图片：' :rules="notEmptyChange">
					<el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload">
						<img v-if="editForm.icon" :src="editForm.icon" class="avatar banner-avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon banner-avatar"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label='展示时间：' prop="timeBox" :rules="notEmptyChange">
					<el-date-picker v-model="editForm.timeBox" :default-time="['00:00:00', '23:23:23']" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" :picker-options='disabledOptions' size="small"></el-date-picker>
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
	import { bigCoffeeAdd, bigCoffeeUpdate, bigCoffeeChangeSearch } from '@/api/home'
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
				time: [],
				editForm: {
					timeBox: [],
					icon: '',
					course:""
				},
				goodsList: [],
				disabledOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 1000 * 3600 * 24;
					},
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
						if (!this.editForm.icon) {
							this.$message.error("请上传图片"); return;
						}

						let param = JSON.parse(JSON.stringify(this.editForm));
						let time1 = this.$utils.formatDate(this.editForm.timeBox[0], 'yyyy-MM-dd hh:mm:ss');
						let time2 = this.$utils.formatDate(this.editForm.timeBox[1], 'yyyy-MM-dd hh:mm:ss');
						[param.startTime, param.endTime] = [time1, time2];
						console.log(param);
						let apiName = null;
						this.menuObj.isEdit ? (apiName = bigCoffeeUpdate, param.uuid = this.editForm.uuid) : apiName = bigCoffeeAdd;
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
			//查询课程
			getNowGoods(e) {
				return new Promise((resolve, reject) => {
					if (!this.menuObj.isShow) return
					let param = {
						name: e,
						page: 1,
						pageSize: 1000000,
					}
					bigCoffeeChangeSearch(param).then(res => {
						if (res.code === 200) {
							this.goodsList = res.data.results;
							resolve()
						}
					}).catch(err=>{
						reject()
					})
				})

			},
			closeDialog() {
			
				let obj = {
					isShowEdit: false, //是否显示编辑弹框
				}
				this.$emit('closeMain', obj)
			},
			resetForm() {
				this.editForm = {
					timeBox: [],
					icon: '',
					course:""
				};
				this.goodsList=[];
			},
			//上传轮播图
			beforeImgUpload(file) {
				const isJPG = ['image/jpeg', 'image/png'].includes(file.type);
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error('图片只能是JPG或者PNG格式!');
					return false
				}
				if (!isLt2M) {
					this.$message.error('图大小不能超过2MB!');
					return false
				}
				this.$uploadFile.checkedFileMD5ByFile(file, data => {
					this.$set(this.editForm, 'icon', data.url);
				});
				return false;
			},
		},
		mounted() {
			// this.searchList()		
		},

		watch: {
			'menuObj.isShow'(val, oldVal) {
				if (val) {
					this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
					if (this.menuObj.isEdit) {
						this.goodsList=[];
						console.log(JSON.stringify(this.menuObj.data));
						this.editForm = JSON.parse(JSON.stringify(this.menuObj.data));
				
						this.$set(this.editForm,'timeBox',[this.editForm.startTime,this.editForm.endTime]);

						this.getNowGoods(this.editForm.name).then(res=>{
					   	this.$set(this.editForm,'course',this.editForm.courseUuid);
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
</style>