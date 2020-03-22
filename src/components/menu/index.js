const arrInfo = [
	{
		icon: 'el-icon-s-flag',
		index: 'sh',
		title: '课程管理',
		subs: [
			{
				show: true,
				index: 'singleLession',
				title: '单次课列表',
			},

			{
				show: true,
				index: 'seriesLession',
				title: '系列课列表'
			},
			{
				show: true,
				index: 'liveRoom',
				title: '进入直播间',
			},
			{
				show: true,
				index: 'lessionRecycle',
				title: '课程回收站',
			},
			{
				show: true,
				index: 'lessionStoreManageAll',
				title: '课件库管理',
			},
		]
	},
	{
		icon: 'el-icon-s-check',
		index: 'commentCheck',
		title: '评论审核',
	},
	{
		icon: 'el-icon-s-ticket',
		index: 'couponManage',
		title: '优惠券管理',
	},
	{
		icon: 'el-icon-s-custom',
		index: 'userManage',
		title: '用户管理',
		subs: [
			{
				show: true,
				index: 'userList',
				title: '用户列表',
			},

			{
				show: true,
				index: 'specialist',
				title: '专家列表'
			},
		]
	},
	{
		icon: 'el-icon-connection',
		index: 'roles',
		title: '角色管理',
		subs: [
			{
				show: true,
				index: 'roles',
				title: '角色列表',
			},

			{
				show: true,
				index: 'userRoles',
				title: '用户权限管理'
			},
		]
	},
	{
		icon: 'el-icon-collection-tag',
		index: 'LableManageAll',
		title: '标签管理',
	},
	{
		icon: 'el-icon-s-grid',
		index: 'columnManage',
		title: '栏目管理',
	},
	{
		icon: 'el-icon-files',
		index: 'dividedManagement',
		title: '分成管理',
		subs: [
			{
				show: true,
				index: 'classRepreDivideTradeManag',
				title: '课代表分成交易管理',
			},

			{
				show: true,
				index: 'courseRepresManag',
				title: '课代表管理'
			},
			{
				show: true,
				index: 'classRepreCashwithdrawManag',
				title: '课代表提现交易管理'
			},
		]
	},
	{
		icon: 'el-icon-document',
		index: 'orderManage',
		title: '订单管理',
		subs: [
			{
				show: true,
				index: 'orderManage',
				title: '订单列表'
			},
			{
				show: true,
				index: 'refoundManage',
				title: '退款管理'
			}
		]
	},
	{
		icon: 'el-icon-set-up',
		index: 'fixedSettings',
		title: '固定配置',
	},

]

export default arrInfo

