<template>
  <div class="creat-course" v-loading="loading">
    <!-- 创建课程 -->
    <el-form :model='courseParams' :rules='rules' ref='courseParams' label-position="right" label-width="130px">
      <el-form-item prop='courseType' label="课程类型：">
        <el-radio-group v-model.number='courseParams.courseType' @change='changeType' :disabled="courseId!==''">
          <el-radio v-for='(itm,index) in courseTypes' :label='itm.value' :key='index'>{{itm.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if='courseParams.courseType===1' prop='chapterStyle' label="课程形式：">
        <el-radio-group v-model='courseParams.chapterStyle' :disabled="courseId!==''"
          @change="courseParams.courseSourceUuid=courseParams.tryInfoUuid={}">
          <el-radio v-for='(itm,index) in courseModality' :key='index' :label='itm.value'>{{itm.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop='name' label="课程名称：">
        <el-input v-model.trim='courseParams.name' class="row-input" placeholder="课程名称" :maxlength="20" size='small'
          clearable></el-input>
        <span class="tips ml10">{{courseParams.name.length}}/20</span>
      </el-form-item>
      <el-form-item label="副标题：">
        <el-input v-model.trim='courseParams.subhead' class="row-input" placeholder="副标题" :maxlength="30" size='small'
          clearable></el-input>
        <span class="tips ml10">{{courseParams.subhead.length}}/30</span>
      </el-form-item>
      <el-form-item label="课程简介：">
        <el-input v-model.trim='courseParams.briefIntro' class="row-input" placeholder="课程简介" :maxlength="200"
          size='small' clearable></el-input>
        <span class="tips ml10">{{courseParams.briefIntro.length}}/200</span>
      </el-form-item>
      <el-row>
        <!-- 章节数量 系列课特有字段  -->
        <el-col :span='12' v-if="courseParams.courseType===2">
          <el-form-item prop='preChapter' label='章节数量：'>
            <el-input v-model.number.trim="courseParams.preChapter" @change='changeChapter' type='number' :min="1"
              placeholder="预计章节数量" size='small' clearable />
          </el-form-item>
        </el-col>
        <!-- 直播时间 单次直播课特有字段  -->
        <el-col :span='12' v-if="courseParams.courseType===1 && courseParams.chapterStyle === 1">
          <el-form-item prop='startTime' label="直播时间：">
            <el-date-picker class="w200" v-model="courseParams.startTime" type="datetime" size='small' :editable='false'
              :picker-options='pickerOptions'></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item prop='expertUuid' label='主讲专家：'>
            <el-select :remote-method='getSpecial' v-model='courseParams.expertUuid' placeholder='请输入专家名搜索' size='small'
              filterable remote reserve-keyword clearable>
              <el-option v-for='(itm,index) in expertList' :key='index' :label='itm.name' :value='itm.uuid'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 主持人| 嘉宾 单次直播课特有字段  -->
      <el-row v-if="courseParams.courseType===1 && courseParams.chapterStyle === 1">
        <el-col :span='12'>
          <el-form-item prop='mc' label='主持人：'>
            <el-select :remote-method="getAllUserMC" v-model='courseParams.mc' placeholder='请输入用户名搜索' filterable remote
              reserve-keyword size='small' clearable>
              <el-option v-for='(itm,index) in mcList' :key='index' :label='itm.nickName' :value='itm.uuid'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label='嘉宾：'>
            <el-select :remote-method="getAllUser" v-model='courseParams.inviter' size='small' placeholder='请输入用户名搜索'
              multiple filterable remote reserve-keyword clearable>
              <el-option v-for='(itm,index) in inviterList' :key='index' :label='itm.nickName' :value='itm.uuid'>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 上传课件 单次课特有字段 -->
      <addCourse class="course-label" :mode='mode' labels='上传课件：' v-model='courseParams.courseSourceUuid'
        v-if="courseParams.courseType===1" />
      <!-- 上传试听 单次音视频课特有字段 -->
      <addCourse class="course-label" :mode='mode' labels='上传试听：' v-model='courseParams.tryInfoUuid'
        v-if="courseParams.courseType===1 && courseParams.chapterStyle !== 1" />
      <!--直播banner 单次课直播特有字段 -->
      <template v-if="courseParams.courseType===1 && courseParams.chapterStyle === 1">
        <uploadLiveBanner v-model="courseParams.liveCourseBanner"/>
      </template>


      <!-- 共同字段 -->
      <el-row class="mt5">
        <el-col :span='12'>
          <el-form-item prop='courseBanner' label='封面图：'>
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload">
              <img v-if="courseParams.courseBanner" :src="courseParams.courseBanner" class="avatar course-avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon course-avatar"></i>
            </el-upload>
            <div class="col-danger">请上传png,jpg,jpeg格式的图片</div>
          </el-form-item>
        </el-col>
        <el-col :span='12'>
          <el-form-item label='分享图：' prop="shareImg">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeShareImgUpload">
              <img v-if="courseParams.shareImg" :src="courseParams.shareImg" class="avatar course-avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon course-avatar"></i>
            </el-upload>
            <div class="col-danger">请上传png,jpg,jpeg格式的图片</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop='info' label='课程介绍：'>
        <!-- :editorToolbar="customToolbar"-->
        <vue-editor v-model="courseParams.info" useCustomImageHandler @image-added="handleImageAdded" />
      </el-form-item>
      <el-form-item prop='tags' label='标签：'>
        <classifyTag v-model='courseParams.tags' :courseTags='courseParams.tags' class="mt5" />
      </el-form-item>
      <el-form-item prop='coursePermission' label="上课权限：">
        <el-radio-group v-model='courseParams.coursePermission' @change="changePermission">
          <el-radio v-for='(itm,index) in courseRights' :key='index' :label='itm.value'>{{itm.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop='realPrice' label='价格设置：' v-if='courseParams.coursePermission !==1'>
        <div class="price-div mt5">
          <el-row>
            <span class="col-danger mr5">*</span>
            <span class="mr5">实际价格</span>
            <el-input v-model.trim='courseParams.realPrice' @blur='changePrice' class="w100p" size='small' clearable>
            </el-input> 元
          </el-row>
          <el-row>
            <span class="mr5 ml10">划线价格</span>
            <el-input v-model.trim='courseParams.originalPrice' @blur='changePrice' class="w100p" size='small'
              clearable></el-input> 元
          </el-row>
          <el-button type='text' disabled>添加积分换购 +</el-button>
        </div>
      </el-form-item>
      <el-form-item prop='rewardStatus' label='分销：'>
        <el-radio :label='0' v-model='courseParams.rewardStatus'>关闭</el-radio>
        <el-radio :label='1' v-model='courseParams.rewardStatus' :disabled="courseParams.coursePermission!==3">开启
        </el-radio>
        <span v-if='courseParams.rewardStatus=="1"'>
          分成比例
          <el-input @change='changePercent' v-model.trim='courseParams.rewardPercent' type='number' class="w100p"
            size='small'></el-input> %
          <span class='ml10'> {{sharePrice}} 元</span>
        </span>
      </el-form-item>
      <el-form-item label='赠送：'>
        <el-radio-group v-model='courseParams.sendType' size='small' class="mr20">
          <el-radio v-for='(itm,index) in sendTypeList' :key='index' :label='itm.value'>{{itm.label}}</el-radio>
        </el-radio-group>

      </el-form-item>
      <el-form-item label='虚拟人气：'>
        <el-input v-model.number.trim="courseParams.vPopularity" type='number' :min="1" placeholder="虚拟人气数" size='small'
          clearable /> 人
      </el-form-item>
      <el-form-item label='关键词设置：'>

        <el-tag :key="tag" v-for="(tag,index) in courseParams.keywords" closable :disable-transitions="false"
          class="mr10" @close="handleClose(index)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
          @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增关键词</el-button>
      </el-form-item>
      <el-form-item class="mode column columnLabel" prop='courseSection' label="所属栏目：">
        <el-checkbox-group v-model='courseParams.courseSection' size='small'>
          <el-checkbox v-for='(itm,index) in column' :key='index' :label='itm.uuid'>{{itm.name}}</el-checkbox>
          <el-button @click='showEditColumn' type='primary' size='small' plain>添加栏目</el-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop='isCoupon' label='优惠券：'>
        <el-radio :label='1' v-model='courseParams.isCoupon'>可用</el-radio>
        <el-radio :label='0' v-model='courseParams.isCoupon'>不可用</el-radio>
      </el-form-item>
      <el-form-item prop='mustRead' label='购买须知：'>
        <el-input v-model.trim="courseParams.mustRead" type='textarea' rows='5' placeholder="请输入购买须知" />
      </el-form-item>
      <el-form-item label='相关课程：'>
        <el-tag class="mr10" type="success" v-for='(itm,index) in aboutCourse' :key='index'
          @close="handleDeleteCourse(itm)" closable>{{itm.name}}</el-tag>
        <el-button @click='showAddRelateCouse' size="small" type="primary" plain>添加课程</el-button>
        <div class="mr10 col3">共<span class="col-danger">{{aboutCourse.length}}</span>个相关课程</div>
      </el-form-item>
      <el-row class="tc mt20">
        <el-button @click="previewCourse" class="ml40 mb20" type="primary" icon="el-icon-view" plain>预览</el-button>
        <!-- 如果是单次直播课并且是编辑状态下并且editable为false -->
        <el-button @click="saveCourse" :disabled="courseParams.courseType == 1 && courseParams.chapterStyle ==1 && courseId!='' && !courseParams.editable" :isLoading='isLoading' class="ml40 mb20" type="primary" icon="el-icon-check">保存
        </el-button>
        <!--type为系列课需弹框去添加章节 -->
        <!-- <el-button @click="searchList" class="ml40 mb20" icon="el-icon-close">取消</el-button> -->
      </el-row>
    </el-form>
    <!-- 添加相关课程 -->
    <addRelatedCourse :couresData='couresData' @closeMain='closeMain' />
    <!-- 预览课程 -->
    <preview :previewData='previewData' />
    <editColumn :columnObj='columnObj' @closeColumn='closeColumn' />
  </div>
</template>
<script>
    import uploadLiveBanner from "@/components/courseManage/uploadLiveBanner"
  import classifyTag from '@/components/classifyTag' //标签
  import addCourse from '@/components/courseManage/addCourseware'
  import { VueEditor } from "vue2-editor";//富文本编辑器
  import addRelatedCourse from '@/components/courseManage/addRelatedCourse' //添加相关课程
  import preview from '@/components/courseManage/preview' //预览课程
  import editColumn from '@/components/columnManage/editColumn' //新增栏目
  import { addCourseApi, editCourseApi, getAllUserByName, purchaseInstructList, specialList, columnList, getCourseDetail } from '@/api/home'
  const config = require('@/config')
  export default {
    components: {
      uploadLiveBanner,
      classifyTag,
      VueEditor,
      addRelatedCourse,
      preview,
      addCourse,
      editColumn
    },
    data() {
      return {
        loading: false,
        courseId: '',//课程id
        courseParams: {
          courseType: Number(this.$route.query.courseType),//课程类型
          chapterStyle: 1,//课程形式
          name: '',//课程名称
          rights: 2,
          subhead: '',//副标题
          briefIntro: '',//课程简介
          liveCourseBanner: {},//直播banner图片
          mc: '',
          expertUuid: '',
          rewardStatus: 0,
          rewardPercent: 0,
          info: '',//课程介绍
          sendType: '0',//赠送类型
          courseBanner: '',
          shareImg: '',
          courseSection: [],//课程栏目
          coursePermission: '',//上课权限
          realPrice: '',
          originalPrice: '',
          coursePermission: 1,
          courseSourceUuid: {},
          tryInfoUuid: {},
          tags: [],//标签
          gifts: [],//赠品
          inviter: [],//嘉宾
          keywords: [],//关键词
          mustRead: '',//购买须知
          isCoupon: 1,//是否使用优惠券
          infoType: 1,  //默认1是富文本，2是多图集合
          relatedCourse: [],//相关课程
        },
        expertList: [],//专家列表
        mcList: [],//主持人列表
        inviterList: [],//嘉宾列表
        aboutCourse: [],//相关课程列表
        isLoading: false,
        sharePrice: 0,//分销金额
        courseTypes: config.courseTypes,//课程类型
        courseModality: config.courseModality,//课程形式
        courseRights: config.courseRights, //上课权限
        sendTypeList: [
          { value: '0', label: "无赠品" },
          // { value: '1', label: "赠送虚拟物品" },
          // { value: '2', label: "赠送实物" },
        ],//赠送礼品类型
        modeList: [
          { value: '0', label: "精品专区" },
          { value: '1', label: "免费专区" },
          { value: '2', label: "爆款好课" },
          { value: '3', label: "新课速递" }
        ], //所属版块
        isShowDetail: false,
        inputVisible: false,//是否展示关键词输入框
        inputValue: '',//关键词输入框
        needKnow: [],//购买须知列表
        needKnowStr: '',//当前类型的购买须知
        column: [],//栏目列表
        couresData: {
          isShow: false,
          data: {}
        },
        mode: 'live',
        previewData: {
          isShow: false,
          data: {},
          expertList: []
        },
        columnObj: {
          isShow: false,
          isEdit: false,
          data: {}
        },
        rules: {
          courseType: [
            { required: true, message: '请选择课程类型', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请填写课程名称', trigger: 'blur' }
          ],
          chapterStyle: [
            { required: true, message: '请选择课程形式', trigger: 'change' }
          ],
          preChapter: [
            { required: true, message: '请填写章节数量', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请选择直播时间', trigger: 'change' }
          ],
          expertUuid: [
            { required: true, message: '请选择主讲专家', trigger: 'change' }
          ],
          mc: [
            { required: true, message: '请选择主持人', trigger: 'change' }
          ],
          courseBanner: [
            { required: true, message: '请选择上传封面图', trigger: 'change' }
          ],
          shareImg:[
           { required: true, message: '请上传分享图', trigger: 'change' }
          ],
          info: [
            { required: true, message: '请填写课程介绍', trigger: 'change' }
          ],
          tags: [
            { required: true, message: '请选择标签', trigger: 'change' }
          ],
          coursePermission: [
            { required: true, message: '请选择课程权限', trigger: 'change' }
          ],
          realPrice: [
            { required: true, message: '请填写价格', trigger: 'change' }
          ],
          rewardStatus: [
            { required: true, message: '请选择是否分销', trigger: 'change' }
          ],
          courseSection: [
            { required: true, message: '请选择所属栏目', trigger: 'change' }
          ],
          isCoupon: [
            { required: true, message: '请选择能否使用优惠券', trigger: 'change' }
          ],
          mustRead: [
            { required: true, message: '请填写购买须知', trigger: 'change' }
          ],
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 1000 * 3600 * 24;
          },
        },
      }
    },
    methods: {
      changePermission(val) {
        if (val == 1 || val == 2) {
          this.courseParams.rewardStatus = 0;
        }
        console.log(val)
      },
      //课程详情
      getDetail() {
        this.courseId = this.$route.query.uuid || ''
        if (this.courseId !== '') {
          this.loading = true;
          getCourseDetail({ uuid: this.courseId }).then(res => {
            this.loading = false;
            if (res.code === 200) {
              let newData = JSON.parse(JSON.stringify(res.data));
              let param = res.data
              this.expertList[0] = param.experts
              this.mcList[0] = param.mc
              this.inviterList = [...param.inviter];
              param.inviter = param.inviter.map(val => val.uuid);
              param.mc = param.mc.uuid
              param.expertUuid = param.experts.uuid
              delete param.experts


              if (param.courseType === 1 && param.chapterStyle === 1) {
                param.courseSourceUuid = newData.liveCourseUuid;
                param.liveCourseBanner = newData.liveCourseBanner ? newData.liveCourseBanner : {};
              }


              param.realPrice = this.$math.divide(param.realPrice, 100)
              param.originalPrice = this.$math.divide(param.originalPrice, 100)
              param.rewardStatus = param.rewardStatus ? 1 : 0
              param.isCoupon = param.isCoupon ? 1 : 0
              param.sendType = param.gifts.length ? '1' : '0';
              param.relatedCourse = param.relatedCourse.map(val => val.uuid);
              this.aboutCourse = newData.relatedCourse;
              param.courseSection = _.map(param.courseSection, 'uuid')
              param.tags = _.map(param.tags, 'uuid');
              this.sharePrice = this.$math.multip(param.realPrice, this.$math.divide(param.rewardPercent, 100))
              this.courseParams = { ...param }
            } else {
              this.$message.error('未获取到消息无法编辑课程')
              return false
            }
          }).catch(err => {
            this.loading = false;
            this.$message.error(err.msg || '未获取到消息无法编辑课程2')
          })
        }
      },
      //保存
      saveCourse() {
        this.$refs['courseParams'].validate(valid => {
          if (valid) {
            this.changePercent() //分销比例校验
            this.changePrice() //价格校验
            if (this.courseParams.vPopularity && !Number.isInteger(this.courseParams.vPopularity)) {
              this.$message.error('虚拟人气为整数值')
              return false
            }
            if (this.courseParams.courseType === 1 && !this.courseParams.courseSourceUuid.uuid) {
              this.$message.error("必须上传课件"); return;
            }
            const newObj = JSON.parse(JSON.stringify(this.courseParams));
            let param = { ... this.courseParams };
            param.courseThumbnail = param.courseBanner;

            param.tryInfoUuid = this.courseParams.tryInfoUuid.uuid || null;
            if (param.startTime !== '') {
              param.startTime = this.$utils.formatDate(param.startTime)
            }
            // 
            if (this.courseParams.rewardStatus == 0) {
              param.rewardPercent = 0;
            }

            if (this.courseParams.coursePermission == 1) {
              param.realPrice = 0;
              param.originalPrice = 0;
            }
            // 如果是单次直播课
            if (this.courseParams.courseType === 1 && this.courseParams.chapterStyle === 1) {
              param.liveCourseBanner = !param.liveCourseBanner.name ? null : param.liveCourseBanner;
              param.liveCourseUuid = newObj.courseSourceUuid.uuid || null;
              delete param.courseSourceUuid; delete param.tryInfoUuid;
            }
            else {
              param.courseSourceUuid = newObj.courseSourceUuid.uuid || null;
              delete param.liveCourseBanner; delete param.liveCourseUuid;
            }
            this.isLoading = true
            if (this.courseId === '') {
              this.add(param)
            } else {
              this.edit(param)
            }
          } else {
            return false
          }
        })
      },
      //新增课程
      add(param) {
        console.log('add');

        addCourseApi(param).then(res => {
          this.isLoading = false
          if (res.code === 200) {
            this.$message.success(res.msg || '创建课程成功')
            let path = this.courseParams.courseType === 1 ? '/singleLession' : '/seriesLession'
            this.$router.push({ path: path })
          }
        }).catch(err => {
          this.isLoading = false
        })
      },
      //编辑课程
      edit(param) {
        param.uuid = this.courseId
        editCourseApi(param).then(res => {
          this.isLoading = false
          if (res.code === 200) {
            this.$message.success(res.msg || '编辑课程成功')
            let path = this.courseParams.courseType === 1 ? '/singleLession' : '/seriesLession'
            this.$router.push({ path: path })
          }
        }).catch(err => {
          this.isLoading = false
        })
      },
      //列表查询
      searchList() {
        let time = {
          startTime: new Date(this.time[0]).getTime() || '',
          endTime: this.$utils.formatEndTime(this.time[1]) || ''
        }
      },
      //分享图
      beforeShareImgUpload(file) {
        this.beforeUpload(file)
        if (!this.beforeUpload(file)) return
        this.$uploadFile.checkedFileMD5ByFile(file, data => {
          this.courseParams.shareImg = data.url
        });
        return false;
      },
      //上传封面图
      beforeImgUpload(file) {
        this.beforeUpload(file)
        if (!this.beforeUpload(file)) return
        this.$uploadFile.checkedFileMD5ByFile(file, data => {
          this.courseParams.courseBanner = data.url
        });
        return false;
      },


      //校验
      beforeUpload(file) {
        const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('只能上传图片个数');
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return false
        }
        return true
      },
      //富文本上传图片
      handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        this.$uploadFile.checkedFileMD5ByFile(file, data => {
          console.log(data.url);
          //把获取到的图片url 插入到鼠标所在位置 回显图片
          Editor.insertEmbed(cursorLocation, "image", data.url);
          resetUploader();
        })
      },
      //删除关键词
      handleClose(index) {
        console.log(this.dynamicTags)
        this.courseParams.keywords.splice(index, 1);
      },
      //删除相关课程
      handleDeleteCourse(itm) {
        this.aboutCourse.splice(this.aboutCourse.indexOf(itm), 1)
        this.courseParams.relatedCourse = _.map(this.aboutCourse, 'uuid')
      },
      //章节校验
      changeChapter() {
        if (this.courseParams.courseType !== 2) return
        if (!this.courseParams.preChapter) {
          this.$message.error('章节数必填')
          return false
        }
        if (this.courseParams.preChapter < 0) {
          this.$message.error('章节数不能为负数')
          return false
        }
        if (!Number.isInteger(this.courseParams.preChapter)) {
          this.$message.error('请输入整数值')
          return false
        }
      },
      //价格校验
      changePrice() {
        //免费课不做价格校验
        if (this.courseParams.coursePermission === 1) {
          this.courseParams.realPrice = ''
          this.courseParams.originalPrice = ''
          return false
        }
        //非免费课
        if (!this.courseParams.realPrice || !this.courseParams.originalPrice) {
          this.$message.error('实际价格和划线价都必填')
          return false
        }
        if (!this.$utils.limitNumber.test(this.courseParams.realPrice) || !this.$utils.limitNumber.test(this.courseParams.originalPrice)) {
          this.$message.error('价格为整数或最多两位小数的数值')
          return false
        }
        if (this.courseParams.realPrice < 0 || this.courseParams.originalPrice < 0) {
          this.$message.error('实际价格和划线价都不能为负数')
          return false
        }
        if (this.courseParams.realPrice > this.courseParams.originalPrice) {
          this.$message.error('实际价格不能大于划线价')
          return false
        }
        if (this.courseParams.rewardPercent) {
          let pre = this.$math.divide(this.courseParams.rewardPercent, 100)
          this.sharePrice = this.$math.multip(this.courseParams.realPrice, pre)
        }
      },
      //分销比例校验
      changePercent() {
        //精品课
        if (this.courseParams.rewardStatus && !this.courseParams.rewardPercent) {
          this.$message.error('分销比例不能为空')
          return false
        }
        if (this.courseParams.rewardStatus && this.courseParams.rewardPercent < 0) {
          this.$message.error('分销比例不能为负数')
          return false
        }
        if (this.courseParams.rewardPercent) {
          let pre = this.$math.divide(this.courseParams.rewardPercent, 100)
          this.sharePrice = this.$math.multip(this.courseParams.realPrice, pre)
        }
      },
      //展示关键词输入框
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //关键词输入
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.courseParams.keywords.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //展示相关课程
      showAddRelateCouse() {
        this.couresData = {
          isShow: true,
          data: {
            courseId: this.courseId
          }
        }
      },
      //相关课程操作
      closeMain(data) {
        let list = this.aboutCourse.concat(data),
          newList = [];
        list.forEach(e => {
          let keys = newList.map(itm => itm.uuid)
          if (!keys.includes(e.uuid)) newList.push(e)
        })
        if (newList.length > 6) {
          this.$message.error('相关课程最多6个')
          return false
        }
        this.aboutCourse = [...newList]
        this.courseParams.relatedCourse = _.map(this.aboutCourse, 'uuid')

      },
      //关闭新增栏目
      closeColumn(obj) {
        this.columnObj.isShow = false;
        this.getColumn()
      },
      //课程预览
      previewCourse() {
        this.previewData = {
          isShow: true,
          data: this.courseParams,
          expertList: this.expertList
        }
      },
      //添加栏目
      showEditColumn() {
        this.columnObj = {
          isShow: true,
          isEdit: false,
          data: {}
        }
      },
      //课程类型更换 对应购买须知需更换
      changeType() {
        this.needKnow.map(m => {
          if (m.mustReadType === this.courseParams.courseType) {
            this.needKnowStr = m.content
            this.courseParams.mustRead = this.needKnowStr
          }
        })
      },
      //获取用户(主持人)
      getAllUserMC(e) {
        let param = {
          nickName: e,
          page: 1,
          pageSize: 10000
        }
        getAllUserByName(param).then(res => {
          if (res.code === 200) {
            this.mcList = res.data.results
          }
        })
      },
      //获取用户(嘉宾)
      getAllUser(e) {
        let param = {
          nickName: e,
          page: 1,
          pageSize: 10000
        }
        getAllUserByName(param).then(res => {
          if (res.code === 200) {
            this.inviterList = res.data.results
          }
        })
      },
      //获取专家
      getSpecial(e) {
        let param = {
          name: e,
          enable: true,
          page: 1,
          pageSize: 10000,
          enable: true
        }
        specialList(param).then(res => {
          if (res.code === 200) {
            this.expertList = res.data.results
          }
        })
      },
      //获取栏目
      getColumn() {
        columnList({ pageSize: 1000,enable:1 }).then(res => {
          if (res.code === 200) {
            this.column = res.data.results  //_.filter(res.data.results,['enable',true])
          }
        })
      },
      //获取购买须知
      getNeedKnow() {
        let param = {
          page: 1,
          pageSize: 1000
        }
        purchaseInstructList(param).then(res => {
          if (res.code === 200) {
            this.needKnow = res.data.results
            this.needKnow.map(m => {
              if (m.mustReadType === this.courseParams.courseType) {
                this.needKnowStr = m.content
                this.courseParams.mustRead = this.needKnowStr
              }
            })
          }
        })
      }
    },
    created() {
      this.getDetail()
      this.getNeedKnow() //购买须知获取
      this.getColumn() //获取栏目
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.courseParams.courseType = Number(to.query.courseType)
      })
    },
    computed: {
      chapterStyle() {
        return this.courseParams.chapterStyle
      }
    },
    watch: {
      //课程形式变化处理
      chapterStyle(val) {
        if (val === 1) {
          this.mode = 'live'
        } else if (val === 2) {
          this.mode = 'audio'
        } else if (val === 3) {
          this.mode = 'video'
        }
      },
      'courseParams.courseSourceUuid': function (val) {
        if (val.bannerInfo && JSON.stringify(val.bannerInfo) !== "{}") {
          this.courseParams.liveCourseBanner = val.bannerInfo;
        }
      },
      //课程权限变化处理
      'courseParams.coursePermission': function (val, oldVal) {
        if (val === 1) {
          this.courseParams.realPrice = ''
          this.courseParams.originalPrice = ''
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  .creat-course {
    width: 1000px;

    .row-input {
      width: calc(100% - 60px);
    }



    .el-form-item.mode {
      margin-bottom: 20px;
    }

    /* .el-checkbox-group{
        height: 35px;
      } */
    .price-div {
      border: 1px solid #eee;
      padding: 5px 10px;
      width: 300px;
    }
  }

  /deep/ .el-table th {
    background: #e9eef3;
  }

  .course-avatar {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }

  /deep/.course-label .el-form-item__label {
    /* width: 100px !important; */
  }

  /deep/.course-label .el-form-item__content {
    margin-left: 100px !important;
  }

  /deep/.column .el-form-item__content {
    line-height: 30px;
  }

  /deep/ .columnLabel {
    .el-checkbox__label {
      padding-left: 0px;
      width: 85px;
      overflow: hidden;
      vertical-align: text-top;
      margin-left: 8px;
      text-overflow: ellipsis;
      white-space: nowrap;

    }


  }


  /deep/ .columnLabel .el-checkbox:hover > .el-checkbox__label{
        width: auto!important;
        min-width: 85px!important;
  }
</style>