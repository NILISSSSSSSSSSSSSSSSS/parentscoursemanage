// uploadFile.js
import router from '@/router';
import SparkMD5 from 'spark-md5'
import OSS from 'ali-oss'
import axios from 'axios'
import { Message } from 'element-ui'
import { startLoading,updateLoadingText, endLoading } from './index'
import { uploadUrl } from '@/api/http'
import { parse } from 'path';
// import { FILE } from 'dns';

const base = uploadUrl;

//图片上传（不使用）
export function checkedFileMD5ByImg(file, fn) {
  let progress=0;
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();

  fileReader.onload = (e) => {
    spark.append(e.target.result);                   // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      var fileMD5 = spark.end();
     
      axios.get(`${base}/api/manage/upload/status?MD5=${fileMD5}`)
        .then(function (response) {
          if (response.data.code == 200) {
            let mediaInfo = response.data.data.mediaInfo;
            if (mediaInfo.isExist) {
              //文件已存在
              fn(mediaInfo)
              endLoading()
            } else {
              //文件不存在，上传阿里云
              let updateImg = OSS({
                accessKeyId: mediaInfo.stsToken.credentials.accessKeyId,
                accessKeySecret: mediaInfo.stsToken.credentials.accessKeySecret,
                stsToken: mediaInfo.stsToken.credentials.securityToken,
                bucket: mediaInfo.stsToken.bucket,
                region: mediaInfo.stsToken.endPoint.replace('.aliyuncs.com', ''),
                secure: true,
                useFetch: true,
                timeout: 120000  //120秒
              });
              updateImg.put(getUUID(file.name), file)
                .then(function (result) {
                  endLoading()
                  var paramData = {
                    MD5: fileMD5,
                    url: result.res.requestUrls[0]
                  }
                  uploadImageInfo(paramData, fn);
                }).catch(function (err) {
                  endLoading()
                  Message.error('对不起，网络链接错误。')
                });
            }
          } else {
            endLoading()
            Message.error('对不起，网络链接错误。')
          }
        }).catch(function (err) {
          endLoading()
          errorInfo(err);
        })
    }
  }
  fileReader.onerror = (err) => {
    Message.error('提示：文件读取错误。')
  }
  function loadNext() {
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }
  loadNext();
}
//小文件上传（不使用）
export function checkedFileMD5ByDocument(obj, file) {
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();

  fileReader.onload = (e) => {
    spark.append(e.target.result);                   // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      var fileMD5 = spark.end();

      axios.get(`${base}/api/manage/upload/status?MD5=${fileMD5}`)
        .then(function (response) {
          if (response.data.code == 200) {
            let mediaInfo = response.data.data.mediaInfo;
            if (mediaInfo.isExist) {
              //文件已存在
              Message.success({
                message: '文件上传成功。',
              });
              obj.setState({ fileUpdateLoading: false, fileUuid: mediaInfo.mediaUuid, fileUrl: mediaInfo.url });
              console.log(mediaInfo.mediaUuid);
            } else {
              //文件不存在，上传阿里云
              let updateImg = OSS({
                accessKeyId: mediaInfo.stsToken.credentials.accessKeyId,
                accessKeySecret: mediaInfo.stsToken.credentials.accessKeySecret,
                stsToken: mediaInfo.stsToken.credentials.securityToken,
                bucket: mediaInfo.stsToken.bucket,
                region: mediaInfo.stsToken.endPoint.replace('.aliyuncs.com', ''),
                secure: true,
                useFetch: true,
                timeout: 120000  //120秒
              });
              obj.setState({
                accessKeyId: mediaInfo.stsToken.credentials.accessKeyId,
                accessKeySecret: mediaInfo.stsToken.credentials.accessKeySecret,
                stsToken: mediaInfo.stsToken.credentials.securityToken,
                bucket: mediaInfo.stsToken.bucket,
                region: mediaInfo.stsToken.endPoint.replace('.aliyuncs.com', '')
              })
              updateImg.put(getUUID(file.name), file)
                .then(function (result) {
                  var paramData = {
                    MD5: fileMD5,
                    url: result.res.requestUrls[0]
                  }
                  uploadDocumentInfo(obj, paramData);
                }).catch(function (err) {
                  obj.setState({ fileUpdateLoading: false });
                  Message.error('对不起，网络链接错误。')
                });
            }
          } else {
            Message.error('对不起，网络链接错误。')
            obj.setState({ fileUpdateLoading: false });
          }
        }).catch(function (err) {
          errorInfo(err, obj);
          obj.setState({ fileUpdateLoading: false });
        })
    }
  }
  fileReader.onerror = (err) => {
    Message.error('提示：文件读取错误。')
    obj.setState({ fileUpdateLoading: false });
  }
  function loadNext() {
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }
  loadNext();
}
// 大文件上传,可分段上传(视频，音频，图片，文本...),本项目全部使用这个方法
export function checkedFileMD5ByFile(file, fn) {
  startLoading('0%')
  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();

  fileReader.onload = (e) => {
    spark.append(e.target.result);                   // Append array buffer
    let fileMD5 = spark.end();
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      
      axios.get(`${base}/api/manage/upload/status?MD5=${fileMD5}`).then((response) => {
        if (response.data.code == 200) {
          let mediaInfo = response.data.data.mediaInfo;
          if (mediaInfo.isExist) {
            //文件已存在
            fn(mediaInfo);
            endLoading()
          } else {
            //文件不存在，上传阿里云
            let serverAccess = {
              accessKeyId: mediaInfo.stsToken.credentials.accessKeyId,
              accessKeySecret: mediaInfo.stsToken.credentials.accessKeySecret,
              stsToken: mediaInfo.stsToken.credentials.securityToken,
              bucket: mediaInfo.stsToken.bucket,
              region: mediaInfo.stsToken.endPoint.replace('.aliyuncs.com', ''),
            }
            let updateFile = OSS({
              ...serverAccess,
              secure: true,
              useFetch: true,
              timeout: 3600000  //一个小时
            });

            updateFile.multipartUpload(getUUID(file.name), file, {
              parallel: 4,
              partSize: 1024 * 1024,
              mime: file.type,
              progress:function (p) { //获取进度条的值
                console.log('进度条：'+p*100+"%");
                updateLoadingText(parseInt(p*100)+"%");
                // startLoading(p*100)
              },
            }).then(function (result) {
              console.log("分段上传阿里云结果："+JSON.stringify(result));
              // 这里不对视频和音频进行转码，因为文件太大了要转很久
              endLoading();
              let objUrl=result.res.requestUrls[0];
              let fileUrL=objUrl.includes('?uploadId') ?  objUrl.substr(0,objUrl.indexOf('?uploadId')) : objUrl;
              var paramData = {
                MD5: fileMD5,
                url:fileUrL
              }
              uploadFileInfo(paramData, fn);

            }).catch(function (err) {
              console.log(err);
              endLoading()
              Message.error('对不起，网络链接错误')
            });
          }
        } else {
          endLoading()
          Message.error('对不起，网络链接错误')
        }
      }).catch(function (err) {
        errorInfo(err);
      });
    }
  }
  fileReader.onerror = (err) => {
    Message.error('提示：文件读取错误。')
  }
  function loadNext() {
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }
  loadNext();
}
//大文件回调存档（使用）
function uploadFileInfo(paramData, fn) {
  axios.post(`${base}/api/manage/upload/fileinfo`, paramData)
    .then((response) => {
      endLoading();
      if (response.data.code == 200) {
        fn(response.data.data)
      }
    }).catch(function (err) {
      errorInfo(err);
    });
}
//图片回调存档（使用）
function uploadImageInfo(paramData, fn) {
  axios.post(`${base}/api/manage/upload/fileinfo`, paramData)
    .then((response) => {
      if (response.data.code == 200) {
        fn(response.data.data)
      }
    }).catch(function (err) {
      errorInfo(err);
    });
}
//小文件回调存档
function uploadDocumentInfo(obj, paramData) {
  axios.post(`${base}/api/manage/upload/fileinfo`, paramData)
    .then((response) => {
      if (response.data.code == 200) {
        Message.success({
          message: '文件上传成功。',
        });
        obj.setState({ fileUpdateLoading: false, fileUuid: response.data.data.uuid, fileUrl: response.data.data.url });
      }
    }).catch(function (err) {
      errorInfo(err, obj);
      obj.setState({ fileUpdateLoading: false });
    });
}
//获取 File UUID
function getUUID(filename) {
  var mydate = new Date();
  var random = Math.floor(Math.random() * 900) + 100;
  var uuid = "file" + mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds() + random;
  //文件扩展名
  var index = filename.lastIndexOf(".");
  var suffix = filename.substr(index);
  return uuid + suffix;
}
//统一错误信息
export function errorInfo(err, obj) {

  let res = err.response.data;
  if (res.code === 400) {
    // sessionStorage.removeItem("user");
    Message.error({
      message: res.msg
    })
    router.push({ path: '/login' })
  } else if (res.code === 299) {
    // sessionStorage.removeItem("user");
    Message.error({
      message: res.msg
    })
    router.push({ path: '/login' })
  } else {
    Message.error('对不起，网络链接错误。')
  }
}

//音频提交转码作业
function mediaAudioConvert(fn, fileName, access, fileMD5, type) {
  /*
  转码模板： e1ec8f582f524f739b43b93f90794220
  管道ID： 23e158ddab1b4ef59cb83f2e5d9dcbb6  （mts-service-pipeline）
  输入bucket hbb-huitong
  输出bucket
  */
  let baseURL = `https://mts.${access.region.replace('oss-', '')}.aliyuncs.com?`
  let curDateISO = new Date().toISOString();
  let commonParams = {
    Format: 'JSON',
    Version: '2014-06-18',
    AccessKeyId: access.accessKeyId,
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: curDateISO,
    SignatureVersion: '1.0',
    SignatureNonce: randomString(32),
    SecurityToken: access.stsToken,
  }

  // 提交转码作业参数
  let prefix = type == 'video' ? 'mp4' : 'mp3';
  let TemplateId = type == 'video' ? '8d368ff132bd437b931283df76eed1c8' : 'e1ec8f582f524f739b43b93f90794220';
  let paramsObj = {
    ...commonParams,
    Action: 'SubmitJobs',
    Input: {
      "Bucket": 'hbb-ads',
      "Location": access.region,
      "Object": fileName,
    },
    OutputBucket: 'hbb-ads',
    // Outputs: [{
    //   "OutputObject": `${fileName.substr(0, fileName.lastIndexOf('.'))}_output.mp3`,
    //   "TemplateId": "e1ec8f582f524f739b43b93f90794220"
    // }],
    Outputs: [{
      "OutputObject": `${fileName.substr(0, fileName.lastIndexOf('.'))}_output.${prefix}`,
      "TemplateId": TemplateId
    }],
    PipelineId: '23e158ddab1b4ef59cb83f2e5d9dcbb6',
    OutputLocation: access.region,
  }

  // 生成signature及url
  paramsObj = objSortByKey(paramsObj);
  let paramsStr = objToURI(paramsObj);
  let signStr = `GET&${encodeURIComponent('/')}&${encodeURIComponent(paramsStr)}`;
  let signature = encodeURIComponent(HMAC(`${access.accessKeySecret}&`, signStr));
  paramsObj.Signature = signature;
  let url = baseURL + paramsStr + `&Signature=${signature}`;

  $.ajax({
    url: url,
    method: 'GET',
    crossDomain: true,
    xhrFields: {
      withCredentials: false
    },
    success: function (response) {
      //转码作业查询
      if (response.JobResultList.JobResult.length >= 1) {
        var paramsData = {
          Action: 'QueryJobList',
          JobIds: response.JobResultList.JobResult[0].Job.JobId
        };
        //查询转码作业
        searchConvertJob(fn, interval, access, paramsData, fileMD5);
        var interval = setInterval(() => {
          searchConvertJob(fn, interval, access, paramsData, fileMD5)
        }, 800);
      }
    },
    error: function (err) {
      Message.error('转码失败');
      endLoading();
    }
  });
}

//查询转码作业
function searchConvertJob(fn, interval, access, paramsData, fileMD5) {
  let baseURL = `https://mts.${access.region.replace('oss-', '')}.aliyuncs.com?`
  let curDateISO = new Date().toISOString();
  let commonParams = {
    Format: 'JSON',
    Version: '2014-06-18',
    AccessKeyId: access.accessKeyId,
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: curDateISO,
    SignatureVersion: '1.0',
    SignatureNonce: randomString(32),
    SecurityToken: access.stsToken,
  }

  // 查询转码作业参数
  let paramsObj = {
    ...commonParams,
    ...paramsData
  }

  // 生成signature及url
  paramsObj = objSortByKey(paramsObj);
  let paramsStr = objToURI(paramsObj);
  let signStr = `GET&${encodeURIComponent('/')}&${encodeURIComponent(paramsStr)}`;
  let signature = encodeURIComponent(HMAC(`${access.accessKeySecret}&`, signStr));
  paramsObj.Signature = signature;
  let url = baseURL + paramsStr + `&Signature=${signature}`;

  $.ajax({
    url: url,
    method: 'GET',
    crossDomain: true,
    xhrFields: {
      withCredentials: false
    },
    success: function (response) {
      if (response.JobList.Job.length >= 1) {
        var job = response.JobList.Job[0];
        if (job.State == "Transcoding") {
          console.log('转码中，请稍候...')
          // Message.warning('转码中，请稍候...')
        } else if (job.State == "TranscodeSuccess") {
          Message.success('转码成功~')
          clearInterval(interval); //清除定时器
          var url = `https://${job.Output.OutputFile.Bucket}.${job.Output.OutputFile.Location}.aliyuncs.com/${job.Output.OutputFile.Object}`;

          var paramData = {
            MD5: fileMD5,
            url: url
          }
          console.log("转码成功（URL）：" + url);
          uploadFileInfo(paramData, fn);
        } else if (job.State == "Submitted") {
          //提交任务，忽略操作
        } else {
          //转码错误输出
          // Message.error('转码失败');
          console.log('转码失败')
          endLoading();
        }
      }
    },
    error: function (err) {
      console.warn('查询转码作业：失败。')
    }
  });
}

// 计算签名HMAC值【HMAC-SHA1】
function HMAC(k, d, _p, _z) {
  // heavily optimized and compressed version of http://pajhome.org.uk/crypt/md5/sha1.js
  // _p = b64pad, _z = character size; not used here but I left them available just in case
  if (!_p) { _p = '='; } if (!_z) { _z = 8; } function _f(t, b, c, d) { if (t < 20) { return (b & c) | ((~b) & d); } if (t < 40) { return b ^ c ^ d; } if (t < 60) { return (b & c) | (b & d) | (c & d); } return b ^ c ^ d; } function _k(t) { return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514; } function _s(x, y) { var l = (x & 0xFFFF) + (y & 0xFFFF), m = (x >> 16) + (y >> 16) + (l >> 16); return (m << 16) | (l & 0xFFFF); } function _r(n, c) { return (n << c) | (n >>> (32 - c)); } function _c(x, l) { x[l >> 5] |= 0x80 << (24 - l % 32); x[((l + 64 >> 9) << 4) + 15] = l; var w = [80], a = 1732584193, b = -271733879, c = -1732584194, d = 271733878, e = -1009589776; for (var i = 0; i < x.length; i += 16) { var o = a, p = b, q = c, r = d, s = e; for (var j = 0; j < 80; j++) { if (j < 16) { w[j] = x[i + j]; } else { w[j] = _r(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1); } var t = _s(_s(_r(a, 5), _f(j, b, c, d)), _s(_s(e, w[j]), _k(j))); e = d; d = c; c = _r(b, 30); b = a; a = t; } a = _s(a, o); b = _s(b, p); c = _s(c, q); d = _s(d, r); e = _s(e, s); } return [a, b, c, d, e]; } function _b(s) { var b = [], m = (1 << _z) - 1; for (var i = 0; i < s.length * _z; i += _z) { b[i >> 5] |= (s.charCodeAt(i / 8) & m) << (32 - _z - i % 32); } return b; } function _h(k, d) { var b = _b(k); if (b.length > 16) { b = _c(b, k.length * _z); } var p = [16], o = [16]; for (var i = 0; i < 16; i++) { p[i] = b[i] ^ 0x36363636; o[i] = b[i] ^ 0x5C5C5C5C; } var h = _c(p.concat(_b(d)), 512 + d.length * _z); return _c(o.concat(h), 512 + 160); } function _n(b) { var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = ''; for (var i = 0; i < b.length * 4; i += 3) { var r = (((b[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((b[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((b[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF); for (var j = 0; j < 4; j++) { if (i * 8 + j * 6 > b.length * 32) { s += _p; } else { s += t.charAt((r >> 6 * (3 - j)) & 0x3F); } } } return s; } function _x(k, d) { return _n(_h(k, d)); } return _x(k, d);
}

// 创建随机字符串
function randomString(len) {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = $chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

// 数组按键名排序
function objSortByKey(obj) {
  let key = Object.keys(obj).sort();
  let newObj = {};
  for (let i = 0; i < key.length; i++) {
    newObj[key[i]] = obj[key[i]];
  }
  return newObj;
}

// 对象拼接为URL并URI转码
function objToURI(obj) {
  let str = '';
  Object.keys(obj).map(key => {
    if (obj[key] instanceof Object) {
      str += `${key}=${encodeURIComponent(JSON.stringify(obj[key]))}&`;
    } else {
      str += `${key}=${encodeURIComponent(obj[key])}&`;
    }
  })
  return str.slice(0, str.length - 1);
}
