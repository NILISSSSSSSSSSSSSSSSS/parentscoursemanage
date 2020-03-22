<template>
	<div>
		<el-dialog class="refound-dia small-form-item" :visible.sync='refoundObj.isShow' title='主动申请退款' width='500px'
			:close-on-click-modal='false'>
			<el-form :rules='rules' :model="editForm" ref='editForm' labelPosition='right' labelWidth='100px'>
				<el-form-item label='商品名称：'>
					<span>{{ editForm.goodsName }}</span>
				</el-form-item>
				<el-form-item label='可退金额：'>
					<span>￥{{$math.divide(editForm.payPrice,100)}}元</span>
				</el-form-item>
				<el-form-item prop='refundMoney' label="退款金额：">
					<el-input size="small" placeholder='请输入退款金额' v-model="editForm.refundMoney"></el-input>
				</el-form-item>
				<el-form-item label="退款原因：" prop="refundReason">
					<el-input size="small" type='textarea' :rows='3' v-model="editForm.refundReason" placeholder='请输入退款原因'>
					</el-input>
				</el-form-item>
			</el-form>
			<el-row>
				<span class="ml20 tl">合计退款：<span class="col-danger">{{ allMoney}}元</span></span>
				<el-button class="ml40" type="primary" @click="save()" :disabled="isExtra">确 定</el-button>
			</el-row>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import { applyRefund } from '@/api/order'
	export default {
		props: {
			refoundObj: {
				type: Object,
				default: () => { return {} }
			},
		},
		data() {
			const checkPrice = (rule, value, callback) => {
				if (!value) {
					callback(new Error("请输入退款金额"));
				}
				if (!this.$utils.limitNumber.test(value))  {
					callback(new Error("价格为整数或最多两位小数的数值"));
				}
				let money = this.$math.divide(this.editForm.payPrice, 100);
				if (Number(value) > money) {
					this.allMoney = '超出退款金额'; this.isExtra = true;
				}
				else {
					this.allMoney = value; this.isExtra = false;
				}
				callback();
			};

			return {
				dataList: [],
				editForm: {

				},
				allMoney: 0,
				isExtra: false,
				rules: {
					refundMoney: [
						{ required: true, validator: checkPrice, trigger: 'blur' }
					],
					refundReason: [
						{ required: true, message: '请输入退款原因', trigger: 'blur' }
					]
				}
			};
		},
		methods: {
			changePrice() {
				// let val = this.editForm.refundMoney;
				// if (!this.$utils.limitNumber.test(val)) {
				// 	this.$message.error('价格为整数或最多两位小数的数值')
				// 	return false
				// }
				// let money = this.$math.divide(this.editForm.payPrice, 100);
				// if (Number(val) > money) {
				// 	this.allMoney = '超出退款金额'; this.isExtra = true;
				// }
				// else {
				// 	this.allMoney = val; this.isExtra = false;
				// }
			},
			closeDialog() {
				this.$emit('closeMain')
			},
			save() {
				this.$refs['editForm'].validate(valid => {
					if (valid) {
						let param = {
							refundMoney: +this.editForm.refundMoney,
							refundReason: this.editForm.refundReason,
							orderDetailUuid: this.editForm.uuid
						}
						applyRefund(param).then(res => {
							if (res.code === 200) {
								this.$message.success("成功");
								this.$emit("freshParent");
								this.closeDialog();
							}

						}).catch(res => {

						})

					}
				})
			}
		},
		mounted() {
			// this.searchList()		
		},

		watch: {
			'refoundObj.isShow'(val, oldVal) {
				if (val) {
					this.editForm = JSON.parse(JSON.stringify(this.refoundObj.data));
				}
				else {
					this.editForm.refundReason = this.editForm.refundMoney = ''; this.allMoney = 0; this.isExtra = false;
				}
			}
		}
	};
</script>
<style lang="less" scoped>
	/deep/.refound-dia .el-dialog {
		margin-top: 15vh !important;
	}

	/deep/ .small-form-item .el-form-item {
		margin-bottom: 22px;
	}

	.el-input {
		width: 100%;
	}
</style>