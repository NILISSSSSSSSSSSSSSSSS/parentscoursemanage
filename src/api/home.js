import Qs from 'qs'
import { post ,get,put,del,baseUrl} from './http'

/** 用户模块 **/ 
export const hasSuperAdmin = v => post(`${baseUrl}/manage/auth/initAdmin/`, v);           //判断是否有超级管理员
export const addSuperAdmin = v => post(`${baseUrl}/manage/auth/register/`, v);           //添加超级管理员
export const getCode = v => post(`${baseUrl}/manage/auth/sendCode/`, v);                 // 获取短信验证码
export const login = v => post(`${baseUrl}/manage/auth/login/`, v);                 
export const updatePassword = v => post(`${baseUrl}/manage/auth/modifyPassword/`, v);    //修改密码
export const resetPassword = v => post(`${baseUrl}/manage/auth/resetPassword/`, v);    //重置密码
export const loginOut = v => post(`${baseUrl}/manage/auth/logout/`, v);                 // 退出登录

/** 课件库模块 **/
export const lessionStoreList = v => get(`${baseUrl}/manage/lessonManage/lessonStoreManageAll/`,v)                  //视频，音频课件库列表 
export const lessionStoreAdd = v => post(`${baseUrl}/manage/lessonManage/lessonStoreManageAll/`,v)                  //视频，音频创建课件
export const lessionStoreChangeSta= v => del(`${baseUrl}/manage/lessonManage/lessonStoreManageAll/${v.uuid}/`,v)    //视频，音频修改课件状态

export const liveList = v => get(`${baseUrl}/manage/lessonManage/lessonStoreManageAllLiveCourse/`,v)                  //直播课课件库列表 
export const liveListAdd = v => post(`${baseUrl}/manage/lessonManage/lessonStoreManageAllLiveCourse/`,v)              //直播课创建课件
export const liveListChangeSta= v => del(`${baseUrl}/manage/lessonManage/lessonStoreManageAllLiveCourse/${v.uuid}/`,v)    //直播课修改课件状态
export const liveCouseware= v => get(`${baseUrl}/manage/lessonManage/lessonStoreManageAllMsg/`,v)    //获取直播课上传的课件

/** 课程管理模块 **/
export const searchGoods = v => get(`${baseUrl}/manage/search/goods/`,v)                            //商品名模糊搜索
export const searchCourse = v => get(`${baseUrl}/manage/search/courses/`,v)                         //课程名搜索【搜索正常上架的课程】
export const courseList = v => get(`${baseUrl}/manage/lessonManage/`,v)                             //课程列表
export const addCourseApi = v => post(`${baseUrl}/manage/lessonManage/`,v)                          //创建课程
export const editCourseApi = v => put(`${baseUrl}/manage/lessonManage/${v.uuid}/`,v)                //编辑课程
export const getCourseDetail = v => get(`${baseUrl}/manage/lessonManage/${v.uuid}/`)                //获取课程详情
export const changeCourseStu = v => del(`${baseUrl}/manage/lessonManage/${v.uuid}/`,v)              //更改课程状态
export const courseTop = v => put(`${baseUrl}/manage/lessonManage/${v.uuid}/weight/`)               //置顶课程
export const changeSeriesStu = v => put(`${baseUrl}/manage/lessonManage/${v.uuid}/updateStatus/`,v) //更新系列课更新状态
export const getRecyList = v => get(`${baseUrl}/manage/lessonManage/Recycling/Lesson/`,v)           //课程回收站
//章节管理
export const chapterList = v => get(`${baseUrl}/manage/lessonManage/seriesLesson/chapter/`,v)   
export const chapterDetail = v => get(`${baseUrl}/manage/lessonManage/seriesLesson/chapter/${v.uuid}/`,v) 
export const chapterCreate = v => post(`${baseUrl}/manage/lessonManage/seriesLesson/chapter/`,v) 
export const chapterUpdate = v => put(`${baseUrl}/manage/lessonManage/seriesLesson/chapter/${v.uuid}/`,v) 
export const chapterOrder = v => put(`${baseUrl}/manage/lessonManage/seriesLesson/chapter/${v.uuid}/exchange/`,v) 
export const chapterChangeSta = v => del(`${baseUrl}/manage/lessonManage/seriesLesson/chapter/${v.uuid}/`,v) 
export const chapterListenSta = v => put(`${baseUrl}/manage/lessonManage/seriesLesson/chapter/${v.uuid}/isTry/`,v) 

/** 标签管理模块 **/
export const tagList = v => get(`${baseUrl}/manage/LableManageAll/`,v)             //标签左边列表
export const addTag = v => post(`${baseUrl}/manage/LableManageAll/`,v)             //新增标签
export const edietTag = v => put(`${baseUrl}/manage/LableManageAll/${v.uuid}/`,v)  //编辑标签

// 栏目模块
export const columnList = v => get(`${baseUrl}/manage/columnManage/`,v)   
export const addColumn = v => post(`${baseUrl}/manage/columnManage/`,v)   
export const edietColumn = v => put(`${baseUrl}/manage/columnManage/${v.uuid}/`,v)   
export const changeSta = v => del(`${baseUrl}/manage/columnManage/${v.uuid}/`,v)
//获取菜单
export const getMenus = v => get(`${baseUrl}/manage/roles/permission/`,v)                  //获取所有菜单
export const getUserMenus = v => get(`${baseUrl}/manage/roles/userRoles/${v.uuid}/menu/`)  //获取当前角色菜单

/**  权限管理 **/ 
export const getRoles = v => get(`${baseUrl}/manage/roles/roles/`,v)                        //获取角色
export const addRoles = v => post(`${baseUrl}/manage/roles/roles/`,v)                       //添加角色
export const editRoles = v => put(`${baseUrl}/manage/roles/roles/${v.uuid}/`,v)             //编辑角色

// 专家管理
export const specialList = v => get(`${baseUrl}/manage/userManage/specialist/`,v)  
export const changeSpecialSta = v => del(`${baseUrl}/manage/userManage/specialist/${v.uuid}/`,v)    
export const specialAdd = v => post(`${baseUrl}/manage/userManage/specialist/`,v)  
export const specialEdiet = v => put(`${baseUrl}/manage/userManage/specialist/${v.uuid}/`,v) 
// 用户管理
export const changeUserSta = v =>  put(`${baseUrl}/manage/userManage/userList/${v.uuid}/`,v)                   //改变用户状态
export const getConsumeList = v => get(`${baseUrl}/manage/userManage/userListOrder/?buyerUuid=${v.uuid}`,v)    //用户消费记录
export const getShareList = v => get(`${baseUrl}/manage/userManage/userListOrder/?shareUserUuid=${v.uuid}`,v)  //用户分销记录
export const checkUser = v => get(`${baseUrl}/manage/userManage/userList/`,v)                                  //用户列表
export const getAllUserByName = v => get(`${baseUrl}/manage/search/user/`,v)    //获取所有正常用户（名模糊搜索）

export const removeRoles = v => del(`${baseUrl}/manage/roles/roles/${v.uuid}/`)             //移除角色
export const getAdminRoles = v => get(`${baseUrl}/manage/roles/userRoles/`,v)               //获取用户权限管理列表
export const editUserRoles = v => put(`${baseUrl}/manage/roles/userRoles/${v.uuid}/`,v)     //编辑用户权限
export const addUserRoles = v => post(`${baseUrl}/manage/roles/user/`,v)     //新增用户权限
export const normalToAdmin = v => put(`${baseUrl}/manage/roles/user/${v.uuid}/`,v)     //普通用户变管理员
export const checkTel = v => post(`${baseUrl}/manage/roles/validateTel/`,v)     //校验手机号
export const removeUserRoles = v => del(`${baseUrl}/manage/roles/userRoles/${v.uuid}/`,v)   //删除用户权限
// 固定展示配置

// 购买须知
export const purchaseInstructList = v => get(`${baseUrl}/manage/fixedSettings/mustRead/`,v)     
export const purchaseInstructDetail = v => get(`${baseUrl}/manage/fixedSettings/mustRead/${v.uuid}/`,v)  
export const purchaseInstructAdd = v => post(`${baseUrl}/manage/fixedSettings/mustRead/`,v)  
export const purchaseInstructEdiet = v => put(`${baseUrl}/manage/fixedSettings/mustRead/${v.uuid}/`,v)  
export const changePurchaseSta = v => del(`${baseUrl}/manage/fixedSettings/mustRead/${v.uuid}/`,v)    

// 非固定栏目配置 
export const otherMenuList = v => get(`${baseUrl}/manage/fixedSettings/sectionCourse/`,v)
export const changeWeightMenuList = v => put(`${baseUrl}/manage/columnManage/changeWeight/${v.uuid}/`,v)    
export const delOtherMenu = v => del(`${baseUrl}/manage/fixedSettings/sectionCourse/${v.uuid}/`,v) 
export const otherMenuCourse = v => get(`${baseUrl}/manage/search/sectionCourse/`,v)           //查询对应课程
export const edietoOtherMenu = v => put(`${baseUrl}/manage/fixedSettings/sectionCourse/${v.uuid}/`,v) 
export const addOtherMenu = v => post(`${baseUrl}/manage/fixedSettings/sectionCourse/`,v) 
//轮播图相关
export const bannerList = v => get(`${baseUrl}/manage/fixedSettings/banner/`,v)
export const bannerEdiet = v => put(`${baseUrl}/manage/fixedSettings/banner/${v.uuid}/`,v)
export const bannerChange = v => put(`${baseUrl}/manage/fixedSettings/banner/${v.uuid}/enable/`,v)
export const bannerDel = v => del(`${baseUrl}/manage/fixedSettings/banner/${v.uuid}/`,v)
export const bannerOrder = v => put(`${baseUrl}/manage/fixedSettings/changeBannerOrder/${v.uuid}/`,v)
export const bannerCreat = v => post(`${baseUrl}/manage/fixedSettings/banner/`,v)
export const bannerCourchList = v => get(`${baseUrl}/manage/search/courses/`,v)
//关键词相关
export const keyworldList = v => get(`${baseUrl}/manage/fixedSettings/hotSearch/`,v)
export const keyworldAdd = v => post(`${baseUrl}/manage/fixedSettings/hotSearch/`,v)
export const keyworldEdiet = v => put(`${baseUrl}/manage/fixedSettings/hotSearch/${v.uuid}/`,v)
export const setDefaultWord = v => put(`${baseUrl}/manage/fixedSettings/hotSearch/${v.uuid}/defaultHotSearch/`,v)

export const keyworldChange = v => put(`${baseUrl}/manage/fixedSettings/hotSearch/${v.uuid}/enable/`,v)
export const keyworldDel = v => del(`${baseUrl}/manage/fixedSettings/hotSearch/${v.uuid}/`,v)
export const keyworlOrder = v => put(`${baseUrl}/manage/fixedSettings/changeHotSearchOrder/${v.uuid}/`,v)
//大咖直播
export const bigCoffeeList = v => get(`${baseUrl}/manage/fixedSettings/courseLive/`,v)
export const bigCoffeeAdd = v => post(`${baseUrl}/manage/fixedSettings/courseLive/`,v)
export const bigCoffeeUpdate = v => put(`${baseUrl}/manage/fixedSettings/courseLive/${v.uuid}/`,v)
export const bigCoffeeDel = v => del(`${baseUrl}/manage/fixedSettings/courseLive/${v.uuid}/`,v)
export const bigCoffeeOrder = v => put(`${baseUrl}/manage/fixedSettings/changeCourseLiveOrder/${v.uuid}/`,v)
export const bigCoffeeChangeSta = v => put(`${baseUrl}/manage/fixedSettings/courseLive/${v.uuid}/enable/`,v)
export const bigCoffeeChangeSearch = v => get(`${baseUrl}/manage/search/coursesLive/`,v)

//猜你喜欢
export const guessLikeList = v => get(`${baseUrl}/manage/fixedSettings/mayLike/`,v)
export const guessLikeListAdd = v => post(`${baseUrl}/manage/fixedSettings/mayLike/`,v)
export const guessLikeListDel = v => del(`${baseUrl}/manage/fixedSettings/mayLike/${v.uuid}/`,v)
export const guessLikeListUpdate = v => put(`${baseUrl}/manage/fixedSettings/mayLike/${v.uuid}/`,v)
export const guessLikeOrder = v => put(`${baseUrl}/manage/fixedSettings/changeMayLikeOrder/${v.uuid}/`,v)
export const guessLikeChangeSta = v => put(`${baseUrl}/manage/fixedSettings/mayLike/${v.uuid}/enable/`,v)
export const guessLikeSearch = v => get(`${baseUrl}/manage/search/courses/`,v)
//评论模块
export const commentList = v => get(`${baseUrl}/manage/commentCheck/`,v)
export const commentDel = v => del(`${baseUrl}/manage/commentCheck/${v.uuid}/`,v)
export const checkPass = v => put(`${baseUrl}/manage/commentCheck/${v.uuid}/enable/`,v)
export const checkNotPass = v => put(`${baseUrl}/manage/commentCheck/${v.uuid}/disable/`,v)


// 直播模块
export const getImSign = v => post(`${baseUrl}/im/login/`,v);
export const startLive = v => put(`${baseUrl}/manage/lessonManage/startLiveCourse/`,v)
export const endLive = v => put(`${baseUrl}/manage/lessonManage/endLiveCourse/`,v)
export const senIm = v => post(`${baseUrl}/im/sendMsg/`,v)
export const majiaList = v => get(`${baseUrl}/manage/lessonManage/liveRoom/dummyUser/`,v)
export const newMaJia = v => post(`${baseUrl}/manage/lessonManage/liveRoom/dummyUser/`,v)
export const randomMaJia = v => get(`${baseUrl}/manage/lessonManage/liveRoom/randomUser/`,v)
export const mute = v => post(`${baseUrl}/im/mute/`,v)
export const recall = v => post(`${baseUrl}/im/recall/`,v)

export const JieKouMessageList = v => get(`${baseUrl}/manage/lessonManage/liveRoom/chatsHistory/`,v);
export const expertIsOnline = v => post(`${baseUrl}/im/user/status/`,v);

export const delRecord = v => del(`${baseUrl}/manage/lessonManage/liveRoom/chatsHistory/del/`,v);
export const putWall = v => put(`${baseUrl}/manage/lessonManage/liveRoom/chatsHistory/putWall/`,v);

export const addLiveCourse = v => post(`${baseUrl}/manage/lessonManage/liveRoom/roomSource/`,v);
export const getLiveCourse = v => get(`${baseUrl}/manage/lessonManage/liveRoom/roomSource/`,v);
export const delLiveCourse = v => del(`${baseUrl}/manage/lessonManage/liveRoom/roomSource/${v.uuid}/`,v);
export const changeLiveOrder = v => put(`${baseUrl}/manage/lessonManage/liveRoom/roomSource/${v.uuid}/`,v);