import { Message } from 'element-ui'
import { isPro } from "../../api/http";
import axios from 'axios'
import { getImSign, senIm, mute, recall, JieKouMessageList,expertIsOnline,delRecord } from "@/api/home";
const user = {
  state: {
    currentUserProfile: {},  // 当前im登录的用户信息
    isSDKReady: false,// TIM SDK 是否 ready,
    updateGroup:false,
    message: undefined,//用elementUI弹框需提示的显示的消息，
    currentMessageList: [],//当前会话列表
    liveDetail: {},//直播详情
    role: "normal",//当前角色，默认是用户
    loadingChat:false,//加载圈圈
  },
  mutations: {
    setName(state, name) {
      state.nickName = name
    },
    setCurrentMessageList(state, val) {
      state.currentMessageList = val
    },
    setLiveDetail(state, val) {
      state.liveDetail = val
    },
    setRole(state, val) {
      state.role = val
    },
    // 更新当前用户资料
    updateCurrentUserProfile(state, userProfile) {
      state.currentUserProfile = userProfile
    },
   
    // 更新sdk状态
    toggleIsSDKReady(state, isSDKReady) {
      state.isSDKReady = typeof isSDKReady === 'undefined' ? !state.isSDKReady : isSDKReady
    },
    resetIm(state) {
      Object.assign(state, {
        currentUserProfile: {},
        updateGroup:false,
        role:"normal",
        isSDKReady: false // TIM SDK 是否 ready
      })
    },
    // im弹出的提示消息
    showMessage(state, options) {
      if (state.message) {
        state.message.close()
      }
      state.message = Message({
        message: options.message,
        type: options.type || 'success',
        duration: options.duration || 2000,
        offset: 40
      })
    },

  },
  actions: {
    send(context, otherDetail) {
      return new Promise((resolve, reject) => {
        if (!otherDetail.content && otherDetail.content!==0) {
          $vm.$store.commit('showMessage', {
            message: '发送内容不能为空',
            type: 'error'
          })
        }
        let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        let liveInfo = context.state.liveDetail;
        let role = context.state.role;
        let isQuestion = false;

        let display;

        let avatar = context.state.currentUserProfile.avatar;
        let username = context.state.currentUserProfile.nick;
        let from_uid = context.state.currentUserProfile.userID;

        let question = null;
        if (role == 'normal') {
          display = 'barrage';
        }
        if (role == 'expert') {
          display = 'live';
          // 如果是上墙
          if(otherDetail.type=='qna'){
             if(otherDetail.wallAsker){
                let newCC=otherDetail.wallAsker;
               
                delete newCC.question;
                question={
                  ...newCC
                }
             }
          }
        }
        // 主持人
        if (role == 'compere') {
          // 如果以马甲用户发言
          if (otherDetail.maJia) {
            avatar = otherDetail.avatar; username = otherDetail.username; from_uid = otherDetail.from_uid;
            if (otherDetail.checked) {
              isQuestion = true;
            }
            role = 'normal';
            display = 'barrage';
          }
          // 如果以主持人身份
          else {
            display = 'live';
          }
        
        }

        let info = {
          app_id: isPro ? 1400304449 : 1400296200,
          display: display,
          avatar: avatar,
          username: username,
          role: role,
          type: otherDetail.type,
          content: otherDetail.content,
          duration: (otherDetail.duration*1000),
          from_uid: from_uid,
          msg_time: new Date().getTime(),
          room_id: liveInfo.liveRoomId,
          question: question,
          isQuestion: isQuestion,
          percentage:0,
          playStatus: 'stop',
        }

        let param = {
          role: info.role,
          fromAccount: info.from_uid,
          liveRoomId: info.room_id,
          msgBody: JSON.stringify(info)
        }
        senIm(param).then(res => {
          if (res.code == 200) {
            console.log("发送消息成功");
            resolve()
          }
          else {
            reject();
          }
        }).catch(err => {
          reject();
          console.log("消息发送失败");
          $vm.$store.commit('showMessage', {
            message: err.msg || '消息发送：失败',
            type: 'error'
          })
         
        })
      })
    },
    //加入群
    joinRoom(context) {
      let groupID = context.state.liveDetail.liveRoomId;
      // 加入聊天室
      let promise = tim.joinGroup({ groupID: groupID, type: TIM.TYPES.GRP_CHATROOM });
      promise.then((imResponse) => {
        switch (imResponse.data.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
            console.log('TIM 等待管理员同意');
            break;
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
            console.log('TIM 加入群（' + imResponse.data.group.groupID + "）");
            context.dispatch('getImMessageList', groupID);
            break;
          case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP:
            console.log('TIM 已经在群中');
            context.dispatch('getImMessageList', groupID);
            break;
          default:
            break;
        }

      }).catch(function (imError) {
        console.log('joinGroup error:', imError); // 申请加群失败的相关信息
      });
    },
    //直播结束后则获取后端消息列表接口
    getJieKouMessageList(context, uuid) {
      let param = { uuid: uuid, pageSize: 1000 };
      JieKouMessageList(param).then(res => {
        $vm.$store.state.imInfo.loadingChat=false;
        console.log("获取到接口的消息列表：" + JSON.stringify(res));
        let newArr = [];
        if (res.code == 200 && res.data.results) {
          for (let item of res.data.results) {
            let txt = JSON.parse(item.content);
            txt.sequence = item.msgSeq;
            newArr.push(txt);
          }
          context.commit('setCurrentMessageList', newArr)
        } else {
          context.commit('setCurrentMessageList', []);

        }
      }).catch(err => {
        context.commit('setCurrentMessageList', []);
        $vm.$store.state.imInfo.loadingChat=false;
      })
    },
    //
    logoutIm(context){
      if(context.state && context.state.isSDKReady){
        tim.logout().then(res=>{
          console.log("im退出成功");
        });
      }
    },

    //查询其他端是否有专家
    hasExpert(context){
      return new Promise((resolve, reject) => {
         let param={
          uuid:context.state.liveDetail.experts.uuid,
          role:'expert'
         }
         expertIsOnline(param).then(res=>{
           if(res.code==200){
             resolve(res.data)
           }
           else{
             reject();
           }
         }).catch(err=>{
           $vm.$message.error(err.msg);
          reject();
         })
      })
    },
    //获取im消息列表
    getImMessageList(context, groupId, nextReqMessageID) {
      // 拉取会话列表
      var paramData = {
        conversationID: 'GROUP' + groupId,
        count: 500,
        nextReqMessageID: null
      };

      if (nextReqMessageID != undefined) {
        paramData.nextReqMessageID = nextReqMessageID;
      }
      tim.getMessageList(paramData).then(function (imResponse) {
        $vm.$store.state.imInfo.loadingChat=false;
        console.log("获取到的消息列表：" + JSON.stringify(imResponse));
        let messageList = [];

        if (imResponse.data.messageList && imResponse.data.messageList.length !== 0) {
          for (let item of imResponse.data.messageList) {
            var data = JSON.parse(item.payload.data);
            data.sequence = item.sequence;//手动写入消息id
            console.log(context.state.currentUserProfile);
            messageList.push(data)
          }
        }

        context.commit('setCurrentMessageList', messageList)
      }).catch(err=>{
        $vm.$store.state.imInfo.loadingChat=false;
      });
    },
    loginIm(context, uuid) {
      let param = {
        uuid: uuid
      }
      getImSign(param).then(res => {
        let promise = tim.login({ userID: res.data.uuid, userSig: res.data.userSign });
        promise.then(function (imResponse) {
          console.log("登录成功");
          console.log(imResponse.data); // 登录成功
        }).catch(function (imError) {
          console.warn('login error:', imError); // 登录失败的相关信息
        });
      }).catch(err => {
      })
    },
    //获取im个人资料
    getMyImInfo(context) {
      tim
        .getMyProfile()
        .then(({ data }) => {
          console.log("个人im资料" + JSON.stringify(data));
          $vm.$store.commit('updateCurrentUserProfile', data);
         
        })
        .catch(error => {
          console.log("个人im资料获取失败");
          $vm.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
    },
    //切换身份时候更新个人im资料
    changeIdUpdateInfo(context, maJiaDetail) {
      return new Promise((resolve, reject) => {
        let role = context.state.role;
        let liveInfo = context.state.liveDetail;
        let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        let avatar, username, userID;
        if (role == 'normal') {
          avatar = userInfo.avatar; username = userInfo.name; userID = userInfo.uuid;
        }
        if (role == 'expert') {
          avatar = liveInfo.experts.avatar; username = liveInfo.experts.name; userID = liveInfo.experts.uuid;
        }
        // 主持人,
        if (role == 'compere') {
          //马甲用户不需要更新im
          avatar =liveInfo.mc.avatar; username = liveInfo.mc.nickName; userID = liveInfo.mc.uuid;
        }
        context.commit('updateCurrentUserProfile', { avatar: avatar, nick: username, userID: userID });
        resolve()
      })
    },
    //禁言
    MutePeople(context, obj) {
      let param = {
        chatRoomId: context.state.liveDetail.liveRoomId,
        userName: obj.userId,
        expire: obj.expire
      }
      mute(param).then(res => {
        if (res.code == 200) {
          $vm.$message.success(res.msg);
        }
      }).catch(err => {
        $vm.$message.success(err.msg);
      })

    },
    //撤销
    reCallCurrent(context, msgSeq) {
      return new Promise((resolve, reject) => {
        let param = {
          chatRoomId: context.state.liveDetail.liveRoomId,
          msgSeq: msgSeq,
        }
        recall(param).then(res => {
          console.log(JSON.stringify(res))
          if (res.code == 200) {
            $vm.$message.success("撤销成功");
            resolve()
          }
          else {
            reject()
          }
        }).catch(err => {
          $vm.$message.success(err || '撤销失败');
          reject()
        })

      })
    },
    //在拉取历史记录里删除聊天记录
    delRecordOne(context,obj){
       return new Promise((resolve,reject)=>{
        let param = {
          uuid: obj.uuid,
          msgTime: obj.msgTime,
        }
        delRecord(param).then(res => {
          if (res.code == 200) {
            $vm.$message.success(res.msg);
            resolve();
          }
          else{
            reject();
          }
        }).catch(err => {
          reject();
          $vm.$message.success(err.msg);
        })
       })
    },
  }
}

export default user
