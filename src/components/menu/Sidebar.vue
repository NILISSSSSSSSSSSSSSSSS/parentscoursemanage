<template>
	<div class="sh-menu" >
		<el-menu v-loading="loading" :default-active="$route.path" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
			class="el-menu-vertical-demo" unique-opened @select="handleSelect">
			<template v-for="(item,index) in menuList">
				<template v-if="item.subMenu.length">
					<el-submenu :index="item.menuUrl" :key="item.uuid">
						<template slot="title"><i :class="item.icon"></i>{{ item.menuName }}</template>
						<el-menu-item v-for="(subItem,i) in item.subMenu" class="ml20" :key="subItem.uuid" :index="subItem.menuUrl">
							{{subItem.menuName}}
						</el-menu-item>
					</el-submenu>
				</template>
				<template v-else>
					<template v-if="item.menuUrl!==undefined">
						<el-menu-item :index="item.menuUrl" :key="item.uuid">
							<i :class="item.icon"></i>
							<span slot="title">{{ item.menuName }}</span>
						</el-menu-item>
					</template>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
	import { getMenus,getUserMenus } from '@/api/home'
	export default {
		props: {

		},
		data() {
			return {
				loading:false,
				menuList: [],// require('./index.js').default
			}
		},
		computed: {
			onRoutes() {
				return this.$route.path.replace('/', '');
			}
		},
		mounted() {
			this.getMenuList()
		},
		methods: {
			handleSelect(e) {
				this.$router.push({ path: e });
			},
			//获取菜单
			getMenuList(){
				let param  = {
					uuid: JSON.parse(sessionStorage.getItem('userInfo')).uuid
				}
				this.loading=true;
				getUserMenus(param).then(res =>{
					this.loading=false;
					if(res.code === 200){
						this.menuList = res.data
					}
				}).catch(err => {
					console.log(err);
					this.loading=false;
				})
			}
		},
	}
</script>

<style scoped>
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		min-height: 400px;
		width: 100%;
	}
 /deep/	.el-loading-mask {
      background-color: transparent;
}
</style>