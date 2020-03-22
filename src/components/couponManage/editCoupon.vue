<template>
	<div>
		<el-dialog :visible.sync='couponObj.isShow' :title='couponObj.isEdit ? "编辑优惠券":"新增优惠券"' width='600px'
			:close-on-click-modal='false'>
			<el-form :model='editForm' ref='editForm'  labelPosition='right' labelWidth='120px'>
				<el-form-item prop='source' label="来源：" :rules="notEmptyChange">
					<el-radio-group v-model='editForm.source'>
						<el-radio label='1'>好呗呗</el-radio>
						<!-- <el-radio label='2'>店铺</el-radio> -->
					</el-radio-group>
				</el-form-item>
				<el-form-item prop='couponType' label="优惠券类型：" :rules="notEmptyChange">
					<el-radio-group v-model='editForm.couponType' :disabled='couponObj.isEdit'>
						<el-radio label='1' v-for='(itm,index) in couponTypes' :key='index' :label='itm.value'>{{itm.label}}
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- 单品券 -->
				<el-form-item  label='选择课程：' v-if="editForm.couponType === 1" prop="goods" :rules="notEmptyChange">
					<el-select @change='resetGoods' v-model='editForm.goodsType' class="w100p" size='small'>
						<el-option v-for='(itm,index) in goodsTypeList' :key='index' :label='itm.label' :value='itm.value'>
						</el-option>
					</el-select>
					<el-select :remote-method='getNowGoods' v-model='editForm.goods' class="w200 ml10" size='small' filterable
						remote reserve-keyword clearable>
						<el-option v-for='(itm,index) in goodsList' :key='index' :label='itm.name' :value='itm.uuid'></el-option>
					</el-select>
				</el-form-item>
				<!-- 品类券 -->
				<el-form-item prop='scope' :rules="notEmptyChange" label='选择品类：' v-if="editForm.couponType === 2">
					<el-checkbox-group v-model='editForm.scope' size='small'>
						<el-checkbox v-for='(itm,index) in goodsTypeList' :key='index' :label='itm.value'>{{itm.label}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item prop='name' label='优惠券名称：' :rules="notEmptyBlur">
					<el-input v-model.trim='editForm.name' placeholder='输入优惠券名称' size='small' clearable></el-input>
				</el-form-item>
				<el-form-item prop='money' label='面值：' :rules="notEmptyBlur">
					<el-input type='number' v-model.number.trim='editForm.money' min="0" placeholder='输入面值金额' size='small'
						clearable></el-input>
				</el-form-item>
				<el-form-item prop='totalNumber' label='发放数量：' :rules="notEmptyBlur">
					<el-input type='number' v-model.number.trim='editForm.totalNumber' min="0" placeholder='发放数量' size='small'
						clearable></el-input>
				</el-form-item>
				<!-- 品类券 通用券 -->
				<el-form-item label='使用条件：' v-if="editForm.couponType === 2 || editForm.couponType === 3">
					<div>订单满<el-input type='number' v-model.number.trim='editForm.accountMoney' min="0" class="w100p ml10 mr10"
							placeholder='金额' size='small' clearable></el-input>元可使用</div>
					<div>
						<el-checkbox v-model='editForm.isPromotion'>支持促销商品使用</el-checkbox>
						<div class="tips">不勾选此项时，促销商品不能叠加使用该优惠券</div>
					</div>
				</el-form-item>
				
				<el-form-item prop='time' label="有效期限：" :rules="notEmptyChange">
					<el-date-picker v-model="editForm.time" type="daterange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" :picker-options='disabledOptions' value-format='yyyy-MM-dd' size="small">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" :loading='isLodaing' @click="saveCoupon">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import { couponType, courseTypes } from '@/config'
	import { addCoupon, editCoupon } from '@/api/order'
	import { searchGoods } from '@/api/home'

	export default {
		props: {
			couponObj: {
				type: Object,
				default: () => { return {} },
				isShow: true
			}
		},
		components: {
		},
		data() {
			return {
				roleList: [],
				editForm: {
					source: '1',
					course: '',
					totalNumber: '',//发放数量
					money: '',//优惠金额
					couponType: 1,//优惠券类型
					goodsType: 1,//商品类型
					scope: [],//品类
					isPromotion: '',//促销商品是否可用,
					startTime: '',
					endTime: '',
					time:[],
					scope: [],//优惠卷使用范围(1, "单次课"),(2, "系列课")
				},
				isLodaing: false,
				goodsList: [],//商品列表
				couponTypes: couponType,//优惠券类型
				goodsTypeList: courseTypes,//商品类型
				disabledOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 1000 * 3600 * 24;
					},
				},
				notEmptyBlur: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        notEmptyChange: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        rules: {

				},
			};
		},
		methods: {
			//保存
			saveCoupon() {
				this.$refs['editForm'].validate(valid => {
					if (valid) {
						//单品券
						if (this.editForm.couponType == 1) {
							this.editForm.scope = this.editForm.goodsType === 1 ? [1] : [2]
						}
						//通用券
						if (this.editForm.couponType == 3) {
							this.editForm.scope = []
						}
						let time = [
							this.$utils.formatDate(this.editForm.time[0], 'yyyy-MM-dd'),
							this.$utils.formatDate(this.editForm.time[1], 'yyyy-MM-dd')
						]
						time = this.$utils.formatRange(time)
						let param = {
							... this.editForm,
							startTime: time[0],
							endTime: time[1]
						}
						param.accountMoney = param.accountMoney || 0
						delete param.time
						this.isLodaing = true
						if (this.couponObj.isEdit) {
							this.edit(param)
						} else {
							this.add(param)
						}
					}

				})

			},
			//新增优惠券
			add(param) {
				addCoupon(param).then(res => {
					this.isLodaing = false
					if (res.code === 200) {
						this.$message.success(res.msg || '创建成功')
						this.close();
						this.$emit('refresh')

					}
				}).catch(err => {
					this.isLodaing = false
				})
			},
			//编辑优惠券
			edit(param) {
				editCoupon(param).then(res => {
					this.isLodaing = false
					if (res.code === 200) {
						this.close();
						this.$message.success(res.msg || '编辑成功');
						this.$emit('refresh')

					}
				}).catch(err => {
					this.isLodaing = false
				})
			},
			close() {
			
				this.$emit('closemain', true)
			},
			resetForm() {
				this.editForm = {
					source: '1',
					course: '',
					totalNumber: '',//发放数量
					money: '',//优惠金额
					couponType: 1,//优惠券类型
					goodsType: 1,//商品类型
					scope: [],//品类
					isPromotion: '',//促销商品是否可用,
					startTime: '',
					endTime: '',
					time:[],
					scope: [],//优惠卷使用范围(1, "单次课"),(2, "系列课")
				}
			 
			},
			//查询课程
			getNowGoods(e) {
				// if (!this.couponObj.isShow) return
				let param = {
					name: e,
					goodsType: this.editForm.goodsType,
					page: 1,
					pageSize: 1000000,
				}
				searchGoods(param).then(res => {
					if (res.code === 200) {
						this.goodsList = res.data.results;
				
					}
				})
			},
			resetGoods() {
				this.goodsList = []
				this.editForm.course = '';
				this.$set(this.editForm,'goods','');
				this.getNowGoods()
			}
		},
		mounted() {
			// this.searchList()		
		},
		// computed: {
		// 	newObj() {
		// 		return this.couponObj.isShow
		// 	}
		// },
		watch: {
			'couponObj.isShow'(val, oldVal) {
				if (val) {
				console.log(this.$refs['editForm']);
					if (this.couponObj.isEdit) {
						this.editForm = { ...this.couponObj.data }
						this.editForm.source = this.editForm.source.toString()
						this.editForm.scope.map(m => {
							if (this.editForm.couponType === 1 && m === 1) {
								this.editForm.goodsType = 1
							} else if (this.editForm.couponType === 1 && m === 2) {
								this.editForm.goodsType = 2
							} else {
								this.editForm.goodsType = 1
							}
						})
						this.editForm.money = this.$math.divide(this.editForm.money, 100)
						this.editForm.accountMoney = this.editForm.accountMoney ? this.$math.divide(this.editForm.accountMoney, 100) : '';
						this.$set(this.editForm, 'time', [new Date(this.editForm.startTime), new Date(this.editForm.endTime)]);
					}
					else {
						this.resetForm();
					}
					this.getNowGoods();
				}
				
			},

			// newObj(a, b) {
			// 	if (a) {
			// 		this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
			// 		if (this.couponObj.isEdit) {
			// 			this.editForm = { ...this.couponObj.data }
			// 			this.editForm.source = this.editForm.source.toString()
			// 			this.editForm.scope.map(m => {
			// 				if (this.editForm.couponType === 1 && m === 1) {
			// 					this.editForm.goodsType = 1
			// 				} else if (this.editForm.couponType === 1 && m === 2) {
			// 					this.editForm.goodsType = 2
			// 				} else {
			// 					this.editForm.goodsType = 1
			// 				}
			// 			})
			// 			this.editForm.money = this.$math.divide(this.editForm.money, 100)
			// 			this.editForm.accountMoney = this.editForm.accountMoney ? this.$math.divide(this.editForm.accountMoney, 100) : '';
			// 			this.$set(this.editForm, 'time', [new Date(this.editForm.startTime), new Date(this.editForm.endTime)]);
			// 		}
			// 		else{
			//       this.resetForm();
			// 		}
			// 		this.getNowGoods();
			// 	}

			// }
		}
	};
</script>
<style lang="less" scoped>
	.el-form-item {
		/* margin-bottom: 13px; */
	}

	/deep/.w100p .el-input {
		width: 100% !important;
	}
</style>