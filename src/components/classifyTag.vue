<template>
	<!-- 标签 -->
	<div>
		<el-tree
			@check-change="getChecked"
			:data="dataList"
			show-checkbox
			node-key="uuid"
			ref="tree"
			default-expand-all
			highlight-current
			:props="defaultProps">
		</el-tree>
	</div>
</template>
<script>
 import { tagList } from '@/api/home'
export default {
	props:{
		/**
   * @param {value} 传入的uuid数组集合
	 * @param {tagType} 标签类型  (1, "课程"), (2, "专家"), (3, "看点")
   */
		value:{
			type:Array,
			default:()=>{return []}
		},
		courseTags:{
			type:Array,
			default:()=>{return []}
		},
    tagType:{
			type:Number,
			default:1
		}
	},
  data() {
    return {
			dataList: [],
			defaultProps: {
				children: 'children',
				label: 'name'
			}
    };
	},
	watch: {    
		value(val,old){
			this.$refs.tree.setCheckedKeys(val);
		},
		deep:true
	},

	methods:{
		getList() {
        let param = {
					tagType: this.tagType,
					pageSize: 1000,
					enable:true
        }
        tagList(param).then(res => {
          if (res.code === 200) {
            if (res.data && res.data.count > 0) {
              // console.log("原数据：" + JSON.stringify(res.data.results));
              this.dataList = this.$utils.toTree({ allData: res.data.results, objKey: "uuid", parentNode: "parentUuid" });
              // console.log('转换成树状数据:' + JSON.stringify(this.dataList));
            }
            else {
              this.dataList = [];
            }
          }
        }).catch(res => {
    
        })
			},
		getChecked(obj,isChecked,cc){
		  let checkedList = this.$refs.tree.getCheckedKeys();
			this.$emit("input",checkedList);
		},
	},
	mounted(){
		this.getList();
		this.$refs.tree.setCheckedKeys(this.value);
	},

};
</script>
<style scoped>
/deep/ .el-tree__empty-block {
    width: 120px;
}
</style>
