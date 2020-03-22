import FileSaver from 'file-saver' //引入文件下载
import router from '../router'
import { Loading } from 'element-ui'
import { promised } from 'q';
export const PHONE_REG = /^1\d{10}$/; //手机号正则
export const LOGISTICS_REG = /\d/; //运单号正则
export const EMAIL_REG = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/; //邮箱正则

export const checkInteger = /^[1-9]\d*$/;//只能输入正整数
//只能输入正整数或者最多两位小数
export const limitNumber = /(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/;
let loading;
/**
 * 日期格式化
 * @param {*} date 数据
 * @param {*} format 要转换的格式
 */
export function formatDate(date, format) {
    if (!date) return
    date = new Date(date)
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let min = date.getMinutes();
    let s = date.getSeconds();
    let result = "";
    if (format == undefined || "yyyy-MM-dd hh:mm:ss") {
        result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${
            h < 10 ? "0" + h : h
            }:${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
    }
    if (format == "yyyy-MM-dd hh:mm") {
        result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${
            h < 10 ? "0" + h : h
            }:${min < 10 ? "0" + min : min}`;
    }
    if (format == "yyyy-MM-dd") {
        result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
    }
    if (format == "yyyy-MM") {
        result = `${y}-${m < 10 ? "0" + m : m}`;
    }
    if (format == "hh:mm:ss") {
        result = ` ${h < 10 ? "0" + h : h}:${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
    }
    if (format == "yyyy") {
        result = `${y}`;
    }
    return result;
}
export function formatPrice(price) {
    return '￥' + price
}
/**
 * 结束时间统一加23:59:59 时间戳
 * @param {*} time 要处理为结束时间的数据
 */
export function formatEndTime(time) {
    time = new Date(time).getTime() + 1000 * 3600 * 24 - 1
    return time
}
/**
 * 时间范围处理 00:00:00 ~ 23:59:59 时间字符串
 * @param {*} time 时间范围数据 Array
 */
export function formatRange(time = []) {
  
    let nowTime = []
    nowTime[0] =time &&  time.length ? time[0] + ' 00:00:00' : ''
    nowTime[1] = time && time.length ? time[1] + ' 23:59:59' : ''
    return nowTime
}

/**
 *秒转时分秒
 * 
 */
export function TimestampToTime(_seconds) {
    const PadZero = str => {
        return new RegExp(/^\d$/g).test(str) ? `0${str}` : str;
    }
    if (_seconds) {
        _seconds = parseInt(_seconds);
        let hours, mins, seconds;
        let result = '';
        seconds = parseInt(_seconds % 60);
        mins = parseInt(_seconds % 3600 / 60)
        hours = parseInt(_seconds / 3600);
        result = `${PadZero(hours)}:${PadZero(mins)}:${PadZero(seconds)}`
        return result;

    } else if (_seconds == 0) {
        return "00:00:00"
    }
}

export function setCookie(key, value, t) {
    let oDate = new Date();
    oDate.setDate(oDate.getDate() + t);
    document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
}
export function getCookie(key) {
    var arr1 = document.cookie.split('; ');
    for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split('=');
        if (arr2[0] == key) {
            return decodeURI(arr2[1]);
        }
    }
}
export function removeCookie(key) {
    setCookie(key, '', -365);
}
export function startLoading(msg) {
    loading = Loading.service({
        lock: true,
        text: msg || '加载中……，请不要关闭页面',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
export function updateLoadingText(msg) {
    loading.setText(msg);
}
export function endLoading() {
    loading.close()
}
/**
 * 
 * @param {Array} tHeader 表头
 * @param {Array} params 列表字段
 * @param {Array} list 列表数据
 * @param {String} title 表格标题
 */
export function exportExcel(tHeader, params, list, title) {
    require.ensure([], () => {
        const {
            export_json_to_excel
        } = require('@/vendor/Export2Excel');
        const data = formatJson(params, list);
        export_json_to_excel(tHeader, data, title + '列表');
    })
}
// 参数过滤
const formatJson = (params, jsonData) => {
    return jsonData.map(v => params.map(j => v[j]))
}


/**
 * 将平面数据数组转换为tree状结构
 * @param allData 原数据
 * @param objKey
 * @param parentNode
 * @returns {Array}
 */
export function toTree({ allData, objKey, parentNode, }) {
    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    let map = {};
    allData.forEach(function (item) {
        map[item[objKey]] = item;
    });
    let val = [];
    allData.forEach(function (item) {
        // 以当前遍历项，的parentNode,去map对象中找到索引的id
        let parent = item[parentNode] && [item[parentNode][objKey]] ? map[item[parentNode][objKey]] : false;
        // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
            (parent.children || (parent.children = [])).push(item);

        } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            if (!item[parentNode]) {
                val.push(item);
            }
        }
    });
    return val;
}


//**退出登录
export function loginOutClear() {
    sessionStorage.removeItem("userInfo");
    // $vm.$store.dispatch('logoutIm')
    router.push('/login')
}

//根据阿里云返回的文件url,获取上传文件后的name和类型
export  function getFileInfo(obj) {
  
    // let cc = obj.split("/");
    // let vv = cc[cc.length - 1];
    // let name=vv.split('.')[0];
    let data = {
        // name: name,
        sourceType: getType(),
    }
    function getType() {
        // let v = obj.split('.');
        // let nextPrefix = v[v.length - 1];
        let type=obj.type
        if (type.includes("image")) {
            return 'image'
        }
        if (type.includes("video")) {
            return 'video'
        }
        if (type.includes("audio")) {
            return 'audio'
        }
        if (type.includes('text/plain')) {
            return 'txt'
        }
        if (type.includes("application")) {
            return 'ppt'
        }
    }
    console.log(data);
    return data;
}

// 通过创建音视频，获取音频或者视频的时长
export function getAudioDuration(src) {
    return new Promise((resolve, reject) => {
        let v = src.split('.');
        let nextPrefix = v[v.length - 1];
        if (!(['mp4', 'avi', 'rmvb', 'mp3', 'AAC', 'WAV'].includes(nextPrefix))) {
            resolve(null);
        }
        let audioE = document.createElement("audio"); // 获取时长
        audioE.src = src;
        audioE.load();
        audioE.oncanplay = function () {
            setTimeout(() => {
                console.log(audioE.duration);
                resolve(parseInt(audioE.duration));
            }, 900);

        }
    })
}

//获取txt文件里面的文本
export function txtFileFormat(file){
    return new Promise((resolve,reject)=>{
        if (window.FileReader) {  
            let filename = file.name.split(".")[0];  
            var reader = new FileReader();  
            reader.onload = function() {  
                console.log("获取到的文本："+this.result); 
                let texts = this.result.trim().split('\n'); 
                // console.log("获取换行后的文本数组："+JSON.stringify(texts)); 
                resolve(texts);
               
            } 
            reader.onerror =function(){
                reject();
            } 
            reader.readAsText(file);  
        }   
    })

  
}


