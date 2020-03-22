import Vue from "vue";
import Router from "vue-router";
import Layout from "./views/Layout.vue";
import login from "./views/user/login.vue";
import adminInit from "./views/user/adminInit.vue";

Vue.use(Router);

export const routes = [
  {
    path: "/", //首页
    component: Layout,
    meta: { name: "课程管理" },
    children: [
      {
        path: "",
        meta: { name: "单次课列表" },
        component: () => import("./views/courseManage/allUser.vue")
      }
    ]
  },
  {
    path: "/lessionManage",
    meta: { name: "课程管理" },
    component: Layout,
    children: [
      {
        path: "/singleLession",
        meta: { name: "单次课列表" },
        component: () => import("./views/courseManage/allUser.vue")
      },
      {
        path: "/seriesLession",
        meta: { name: "系列课列表" },
        component: () => import("./views/courseManage/allUser.vue")
      },
      {
        path: "/chapterManageList",
        meta: { name: "章节管理" },
        component: () => import("./views/courseManage/chapterManageList.vue")
      },
      {
        path: "/liveRoom", //创建课程
        meta: { name: "进入直播间" },
        component: () => import("./views/courseManage/liveRoom.vue")
      },
      {
        path: "/createCourse", //创建课程
        meta: { name: "创建课程" },
        component: () => import("./views/courseManage/createCourse.vue")
      },
      {
        path: "/lessionStoreManageAll",
        meta: { name: "课件库管理" },
        component: () => import("./views/courseManage/lessionStoreManageAll.vue")
      },
      {
        path: "/lessionRecycle",
        meta: { name: "课程回收站" },
        component: () => import("./views/courseManage/lessionRecycle.vue")
      },
      {
        path: "/invite", //训练营
        meta: { name: "训练营" },
        component: () => import("./views/user/invite.vue")
      }
    ]
  },
  {
    path: "/commentManage",
    meta: { name: "评论审核" },
    component: Layout,
    children: [
      {
        path: "/commentCheck",
        meta: { name: " 评论审核" },
        component: () => import("./views/commentCheck/commentCheck.vue")
      }
    ]
  },
  {
    path: "/roles", //角色管理
    meta: { name: "角色管理" },
    component: Layout,
    children: [
      {
        path: "", //角色列表
        meta: { name: "角色列表" },
        component: () => import("./views/rolesManage/roles.vue")
      },
      {
        path: "/userRoles", //用户权限管理
        meta: { name: "用户权限管理" },
        component: () => import("./views/rolesManage/userRoles.vue")
      }
    ]
  },
  {
    path: "/userManage",
    meta: { name: "用户管理" },
    component: Layout,
    children: [
      {
        path: "/userList",
        meta: { name: "用户列表" },
        component: () => import("./views/userManage/userList.vue")
      },
      {
        path: "/specialist",
        meta: { name: "专家列表" },
        component: () => import("./views/userManage/specialist.vue")
      }
    ]
  },
  {
    path: "/lableManage",
    meta: { name: "标签管理" },
    component: Layout,
    children: [
      {
        path: "/LableManageAll",
        meta: { name: "标签管理" },
        component: () => import("./views/LableManage/LableManageAll.vue")
      }
    ]
  },
  {
    path: "/dividedManagement",
    meta: { name: "分成管理" },
    component: Layout,
    children: [
      {
        path: "/classRepreDivideTradeManag",
        meta: { name: "课代表分成交易管理" },
        component: () => import("./views/dividedManagement/classRepreDivideTradeManag.vue")
      },
      {
        path: "/courseRepresManag",
        meta: { name: "课代表管理" },
        component: () => import("./views/dividedManagement/courseRepresManag.vue")
      },
      {
        path: "/classRepreCashwithdrawManag",
        meta: { name: "课代表提现交易管理" },
        component: () => import("./views/dividedManagement/classRepreCashwithdrawManag.vue")
      }
    ]
  },
  {
    path: "/couponManage",
    meta: { name: "优惠券管理" },
    component: Layout,
    children: [
      {
        path: "",
        meta: { name: "优惠券管理" },
        component: () => import("./views/couponManage/coupon.vue")
      }
    ]
  },
  {
    path: "/IntegralTaskAll",
    meta: { name: "积分管理" },
    component: Layout,
    children: [
      {
        path: "",
        meta: { name: "积分管理" },
        component: () => import("./views/IntegralTask/IntegralTaskAll.vue")
      }
    ]
  },
  {
    path: "/fixedSettings",
    meta: { name: "固定配置" },
    component: Layout,
    children: [
      {
        path: "",
        meta: { name: "固定配置" },
        component: () => import("./views/fixedSetManage/fixedSettings.vue")
      }
    ]
  },
  {
    path: "/columnManage",
    meta: { name: "栏目管理" },
    component: Layout,
    children: [
      {
        path: "",
        meta: { name: "栏目管理" },
        component: () => import("./views/columnManage/columnManage.vue")
      }
    ]
  },
  {
    path: "/orderManage",
    meta: { name: "订单管理" },
    component: Layout,
    children: [
      {
        path: "",
        meta: { name: "订单列表" },
        component: () => import("./views/orderManage/orderManage.vue")
      },
      {
        path: "/refoundManage",
        meta: { name: "退款管理" },
        component: () => import("./views/orderManage/refoundManage.vue")
      }
    ]
  },
  {
    path: "/login", //管理员登录
    component: login
  },
  {
    path: "/adminInit", //管理员初始化
    component: adminInit
  },
  {
    path: "*", //404
    meta: { name: "首页" },
    component: Layout
  }
];

const vueRouter = new Router({
  mode: "history",
  routes
});

vueRouter.beforeEach((to, from, next) => {
  let login = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {};
  // let path = to.path
  if (login.token) {
    if (to.path === '/login' || to.path === '/adminInit') {
      next({
        path: '/'
      })
    }
    next();
  } else {
    if (to.path === '/login' || to.path === '/adminInit') {
      next();
    }
    else {
      next({
        path: '/login'
      })
    }
  }
})

// 解决点击当前菜单页面报错的问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location)
}



export default vueRouter;
