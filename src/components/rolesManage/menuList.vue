<template>
	<div>
		<el-tree
			@check-change="getChecked"
			:data="menuList"
			show-checkbox
			node-key="uuid"
			ref="tree"
			highlight-current
			:props="defaultProps">
		</el-tree>
	</div>
</template>
<script>
import {getMenus} from "@/api/home";
export default {
	props:{
		value:{
			type:Array,
			default:()=>{return []}
		},
		checked:{
			type:Array,
			default:()=>{return []}
		},
	},
  data() {
    return {
		
			menuList: [],
			checkedList:[],//选中列表
			defaultProps: {
				children: 'subMenu',
				label: 'menuName'
			}
    };
	},
	methods:{
    //获取菜单
		getMenuList(){
			getMenus().then(res =>{
				if(res.code === 200){
					this.menuList = res.data
				}
			}).catch(err => {
				console.log(err)
			})
		},
		getChecked(obj,isChecked,cc){
		  let checkedList = this.$refs.tree.getCheckedKeys();
			this.$emit("input",checkedList);
		},
		
	},
	mounted(){
		this.getMenuList()
		this.$refs.tree.setCheckedKeys(this.value)
	},
	
	watch:{
		value(val,old){
			this.$refs.tree.setCheckedKeys(val);
		},
		deep:true
	
	}
};
</script>
<style lang="less" scoped>
	/deep/.el-tree{
		background: none;
	}
</style>