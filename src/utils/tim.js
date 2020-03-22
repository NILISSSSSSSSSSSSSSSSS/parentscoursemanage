import TIM from 'tim-js-sdk';
import COS from "cos-js-sdk-v5";
import { isPro } from "../api/http";

// 初始化监听
export function initIm() {
  let options = {
    SDKAppID: isPro ? 1400304449 : 1400296200  // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
  };
  // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
  let tim = TIM.create(options); // SDK 实例通常用 tim 表示

  // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
  tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
  // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

  // 注册 COS SDK 插件
  tim.registerPlugin({ 'cos-js-sdk': COS });

  // 初始化监听
  imListener(tim);
  //im挂载到全局
  window.tim = tim;
  window.TIM = TIM;
}

function imListener(tim) {
  // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
  tim.on(TIM.EVENT.SDK_READY, onReadyStateUpdate, this)
  // SDK NOT READT
  tim.on(TIM.EVENT.SDK_NOT_READY, onReadyStateUpdate, this)
  // 被踢出
  tim.on(TIM.EVENT.KICKED_OUT, () => {
    console.log("被提出");
     $vm.$message.error("你的直播间账号已在其他地方登录!");
     $vm.$router.go(-1);
  })
  // SDK内部出错
  tim.on(TIM.EVENT.ERROR, onError)
  // 收到新消息
  tim.on(TIM.EVENT.MESSAGE_RECEIVED, event => {
    console.log("你收到了一条新消息" + JSON.stringify(event));
    var txt = JSON.parse(event.data[0].payload.data);
    if (txt.room_id == $vm.$store.state.imInfo.liveDetail.liveRoomId && txt.type!='ppt-pos') {
      txt.sequence = event.data[0].sequence;//手动写入消息id
      $vm.$store.state.imInfo.currentMessageList.push(txt);
      var timeout = setTimeout(() => {
        var ele = $('.chatCon')[0];
        ele.scrollTop = ele.scrollHeight;
        clearTimeout(timeout);
      }, 200);
    }

  })
  // 会话列表更新
  tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
    console.log("会话列表更新了", JSON.stringify(event.data));
  })
  // 群组列表更新
  tim.on(TIM.EVENT.GROUP_LIST_UPDATED, event => {
    console.log("群组列表更新了" + JSON.stringify(event.data));
    $vm.$store.state.imInfo.updateGroup = true;
    // 加入房间
    if ($vm.$store.state.imInfo.isSDKReady) {
      $vm.$store.dispatch('joinRoom', $vm.$store.state.imInfo.liveDetail.liveRoomId);
    }
    // $vm.$store.commit('updateGroupList', event.data)
  })
  // 收到新的群系统通知
  tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, event => {
    console.log("收到新的群系统通知" + event.data.message.content);
  })
  function onError({ data }) {
    console.error("tim报错："+data.message);
    if (data.message !== 'Network Error') {
      // $vm.$message.error(data.message)
    }
  }
  function onReadyStateUpdate({ name }) {
    const isSDKReady = name === TIM.EVENT.SDK_READY ? true : false;
    $vm.$store.state.imInfo.isSDKReady = isSDKReady;
    // im登录成功
    if (isSDKReady) {
      //获取当前im资料
      $vm.$store.dispatch('getMyImInfo');
      // 加入房间
      if ($vm.$store.state.imInfo.updateGroup) {
        $vm.$store.dispatch('joinRoom', $vm.$store.state.imInfo.liveDetail.liveRoomId);
      }

    }
    // 如果退出im
    else{
      $vm.$store.commit('resetIm');
    }
  }
}



