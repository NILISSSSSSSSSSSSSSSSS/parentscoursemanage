<template>
	<div>
		<el-dialog :visible.sync='menuObj.isShow' :title='menuObj.isEdit ? "编辑轮播图":"新增轮播图"' width='600px'
			:close-on-click-modal='false'>
			<el-form inline :rules='rules' :model="editForm" ref='editForm' labelPosition='right' labelWidth='100px'>
				<el-form-item prop='name' label='标题：' :rules="notEmptyBlur">
					<el-input placeholder='标题' clearable v-model='editForm.name' maxlength='20' size="small"></el-input>
					<span class="tips ml10">{{editForm.name ? editForm.name.length : 0}}/20</span>
				</el-form-item>
				<el-form-item  label='轮播图：'  prop='icon' :rules="notEmptyBlur">
					<el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload">
						<img v-if="editForm.icon" :src="editForm.icon" class="avatar banner-avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon banner-avatar"></i>
					</el-upload>
					<span class="tips ml10">建议尺寸 345*110px</span>
				</el-form-item>
				<el-form-item  label='轮播类型：' prop='type' :rules="notEmptyChange">
					<el-select size="small" @change="editForm.target=''" v-model='editForm.type'  prop="type" :rules="notEmptyChange">
						<el-option v-for='(itm,index) in bannerType' :key='index' :label='itm.label' :value='itm.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='跳转到：' prop='target' :rules="editForm.type==2 ? notEmptyBlur : notEmptyChange">
					<!-- 如果是外部链接 -->
					<el-input size="small" v-model="editForm.target" clearable v-if="editForm.type==2" placeholder="请输入网址">
					</el-input>
				
					<!-- 如果是课程 -->
					<el-select size="small" v-else v-model="editForm.target" filterable placeholder="请选择课程">
						<el-option v-for="(item,index) in courseList" :key="index" :label="item.name" :value="item.uuid">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='展示时间：' prop="timeBox" :rules="notEmptyChange">
					<el-date-picker v-model="editForm.timeBox" type="datetimerange" :default-time="['00:00:00', '23:59:59']" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" :picker-options='disabledOptions' size="small"></el-date-picker>
				</el-form-item>
				<el-form-item prop='status' label="启用状态：" :rules="notEmptyChange">
					<el-radio-group v-model='editForm.status'>
						<el-radio label='1'>启用</el-radio>
						<el-radio label='2'>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog()">取 消</el-button>
				<el-button type="primary" @click="save()" :loading="loadingButton">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import { bannerCreat, bannerEdiet, bannerCourchList } from '@/api/home'
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
				roleList: [],
				time: [],
				bannerType: [
					{ label: "课程", value: "1" },
					{ label: "外部链接", value: "2" },
				],
				editForm: {
					type: '2',
					timeBox: [],
					target:""
				},
				disabledOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 1000 * 3600 * 24;
					},
				},
				courseList: [],
				notEmptyBlur: [
					{ required: true, message: "不能为空", trigger: "blur" }
				],
				notEmptyChange: [
					{ required: true, message: "不能为空", trigger: "change" }
				],
        loadingButton:false,
				rules: {

				}
			};
		},
		mounted() {
			this.searchList();
		},
		methods: {
	   
			save() {
				this.$refs['editForm'].validate(valid => {
					if (valid) {
						if(!this.editForm.icon){
							this.$message.error("请上传轮播图");return;
						}
						if(this.editForm.type==2){
							let a1=this.editForm.target.substring(0,7);
							let a2=this.editForm.target.substring(0,8);
							if(!(a1=='http://' || a2=='https://')){
                this.$message.error("网址必须是以http://或者https://开头");return;
							}
						}
						let param = JSON.parse(JSON.stringify(this.editForm));
						let time1 = this.$utils.formatDate(this.editForm.timeBox[0],'yyyy-MM-dd hh:mm:ss');
						let time2 = this.$utils.formatDate(this.editForm.timeBox[1],'yyyy-MM-dd hh:mm:ss');
						[param.type,param.status,param.startTime, param.endTime] = [Number(param.type),Number(param.status),time1, time2];
						console.log(param);
						let apiName = null;

						this.menuObj.isEdit ? (apiName = bannerEdiet, param.uuid = this.editForm.uuid) : apiName = bannerCreat;
						this.loadingButton=true;
						apiName(param).then(res => {
							this.loadingButton=false;
							if (res.code === 200) {
								this.$message.success("成功");
								this.$emit("freshParent");
								this.closeDialog();
							}
						}).catch(res => {
							this.loadingButton=false;
						})

					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},

			resetForm() {
				this.editForm = {
					type: '2',
					timeBox: [],
					target:""
				}
			},
			closeDialog() {
			
				let obj = {
					isShowEdit: false, //是否显示编辑弹框
				}
				this.$emit('closeMain', obj)
			},

			//列表查询
			searchList() {
				let param = {
					page: 1,
					pageSize: 100000,
				}
				bannerCourchList(param).then(res => {
					if (res.code === 200) {
						console.log("课程数据" + JSON.stringify(res.data.results));
						if (res.data && res.data.count > 0) {
							[this.courseList] = [res.data.results];
						}
						else {
							this.courseList = [];
						}
					}
				}).catch(res => {
					this.loading = false;
				})
			},
			//上传轮播图
			beforeImgUpload(file) {
				const isJPG = ['image/jpeg', 'image/png'].includes(file.type);
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error('轮播图只能是JPG或者PNG格式!');
					return false
				}
				if (!isLt2M) {
					this.$message.error('轮播图大小不能超过2MB!');
					return false
				}
				this.$uploadFile.checkedFileMD5ByFile(file, data => {
					this.$set(this.editForm, 'icon', data.url);
				});
				return false;
			},
		},


		watch: {
			'menuObj.isShow'(val, oldVal) {
				if (val) {
					this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
					if (this.menuObj.isEdit) {
						this.editForm = JSON.parse(JSON.stringify(this.menuObj.data));
					
						[this.editForm.type,this.editForm.status]=[this.editForm.type+'',this.editForm.status+''];
						this.$set(this.editForm,'timeBox',[this.editForm.startTime,this.editForm.endTime]);
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