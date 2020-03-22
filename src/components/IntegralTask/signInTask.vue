<template>
  <div>
    <el-form :rules='rules' inline :model="editForm" ref='editForm' labelPosition='right' labelWidth='0px'>
      <el-form-item prop="singleSign" :rules="notEmptyBlur">
        <el-row>单日最多可签到
          <el-input class="w100p" size="small" v-model="editForm.singleSign" /> 次</el-row>
      </el-form-item>
      <el-form-item prop="singleSign" :rules="notEmptyBlur">
        <el-row>第
          <el-input class="w100p" size="small" v-model="editForm.singleSign" /> 天签到起，每日签到+
          <el-input class="w100p" size="small" v-model="editForm.singleSign" /> 积分</el-row>
      </el-form-item>
      <!-- 连续签到相关 -->
      <template>
        <!-- <el-form-item prop="singleSign" :rules="notEmptyBlur">
          连续签到
          <el-input class="w100p" size="small" v-model="editForm.singleSign" /> 天送
          <el-input class="w100p" size="small" v-model="editForm.singleSign" /> 积分
        </el-form-item> -->
        <el-form-item label="连续签到" labelWidth='100px' prop="continueSign" :rules="continueCheck">
            <template v-for="(industry, index) in shopsInfo.shopsInfoIndustry">
                <el-cascader :key="index" expand-trigger="hover" :props="propsCascader" :options="allMenu"
                    v-model="shopsInfo.shopsInfoIndustry[index]" :size="$size"></el-cascader>
                <el-button v-if="index!==shopsInfo.shopsInfoIndustry.length-1" class="operateButton del"
                    type="primary" :size="$size" @click="addIndustry('del',index)">
                    <i class="el-icon-minus"></i>
                </el-button>
            </template>
            <el-button @click="addIndustry('add')" type="primary" :size="$size" class="operateButton">
                <i class="el-icon-plus"></i>
            </el-button>
        </el-form-item>
      </template>
    </el-form>


    <div class="dialog-footer" style="text-align:center">
      <template v-if="type=='look'">
        <el-button type="primary" class="mr10" @click="type=='ediet'" :loading="saveLoding">编辑</el-button>
        <el-button type="primary" class="mr10">停用</el-button>
      </template>
      <template v-else>
        <el-button type="primary" class="mr10" @click="save()" :loading="saveLoding">保存</el-button>
        <el-button type="primary" class="mr10" @click="type=='look'">取消</el-button>
      </template>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: "look",
        rules: [],
        editForm: {},
        notEmptyBlur: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
      }
    },
    methods: {
      save(formName) {
        this.$refs['editForm'].validate(valid => {
          if (valid) {



          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
    },
  }
</script>