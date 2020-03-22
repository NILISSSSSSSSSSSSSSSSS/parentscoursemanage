<template>
  <div class="lableBox" v-loading="loading">
    <el-card class="box-card" style="width: 400px;">
      <div class="text item">
        <el-tree :expand-on-click-node='false' :data="data" :props="defaultProps" :default-expand-all="isExpandAll"
          @node-click="handleNodeClick"></el-tree>
      </div>
    </el-card>
    <el-card class="box-card" style="width: 500px;margin-left:30px">
      <div slot="header" class="clearfix">
        <span> {{ way=='ediet' ? '标签信息' : '新增标签'}}</span>
      </div>
      <div class="text item">
        <el-form :model="form" ref="form" label-width="136px">
          <el-form-item label="标签类型：">
            <el-radio v-model="form.level" label="1" :disabled="way=='ediet'"> 一级标签
            </el-radio>
            <el-radio v-model="form.level" label="2" v-if="current!=='2'" :disabled="way=='ediet'"> 二级标签
            </el-radio>
          </el-form-item>
          <el-form-item label="名称:" prop="name" :rules="notEmptyBlur">
            <el-input size="small" v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item v-if="form.level=='2'" label="父标签" prop="parentUuid" :rules="notEmptyChange">
            <el-select v-model="form.parentUuid" size="small">
              <el-option v-for="(value,index) in data" :key="index" :label="value.name" :value="value.uuid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示顺序:" prop="weight" :rules="notEmptyChange">
            <el-select v-model="form.weight" size="small">
              <el-option v-for="(value,index) in orderList" :key="index" :label="value.label" :value="value.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="form.enable">在标签栏中显示</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div class="tc">
        <template v-if="way=='ediet'">
          <el-button class="ml40 mb20 mt4" @click="reduction" type="primary" size="small">还原
          </el-button>
        </template>
        <el-button class="ml40 mb20 mt4" type="primary" size="small" @click="save('form')">保存
        </el-button>
        <el-button v-if="way=='ediet'" class="ml40 mb20 mt4" type="primary" size="small" @click="addNew">添加新标签
        </el-button>
      </div>
    </el-card>

  </div>
</template>
<script>
  import { tagList, addTag, edietTag } from '@/api/home'
  export default {
    props: {
      current: {
        type: String,
        default: "1"
      }
    },
    data() {
      return {
        form: {
          level: "1",
          enable: true,
        },
        orderList: [],
        notEmptyBlur: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        notEmptyChange: [
          { required: true, message: "不能为空", trigger: "change" }
        ],

        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        isExpandAll: true,
        way: "add",
        copyData: {},
        loading: false,
      }
    },
    mounted() {
      this.orderList = [];
      for (let i = 1; i < 20; i++) {
        this.orderList.push({ label: i, value: i })
      }
      this.getList();
    },
    methods: {
      getList() {
        let param = {
          tagType: Number(this.current),
          pageSize: 1000,
        }
        this.loading = true;
        tagList(param).then(res => {
          if (res.code === 200) {
            if (res.data && res.data.count > 0) {
              console.log("原数据：" + JSON.stringify(res.data.results));
              this.data = this.$utils.toTree({ allData: res.data.results, objKey: "uuid", parentNode: "parentUuid" });
              console.log('当前数据:' + JSON.stringify(this.data));
            }
            else {
              this.data = [];
            }
          }
          this.loading = false;
        }).catch(res => {
          this.loading = false;
        })
      },

      addNew() {
        this.resetForm();
      },
      handleNodeClick(data) {
        this.$refs['form'].resetFields();
        this.way = "ediet";
        console.log(data);
        this.copyData = JSON.parse(JSON.stringify(data));
        this.form = {
          name: data.name,
          level: data.level + '',
          weight: data.weight,
          enable: data.enable,
          parentUuid: data.parentUuid ? data.parentUuid.uuid : null,
          uuid: data.uuid
        }
      },
      save(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let param = {
              name: this.form.name,
              level: this.form.level,
              weight: this.form.weight,
              enable: this.form.enable,
              tagType: this.current,
              uuid: this.form.uuid,
            }
            this.form.level == '2' ? param.parentUuid = this.form.parentUuid : null;
            let apiName = this.way == "add" ? addTag : edietTag;
            apiName(param).then(res => {
              if (res.code === 200) {
                this.$message.success("成功");
                this.resetForm();
                this.getList();
              }
            }).catch(res => {

            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      reduction() {
        this.form = {
          name: this.copyData.name,
          level: this.copyData.level + '',
          weight: this.copyData.weight,
          enable: this.copyData.enable,
          parentUuid: this.copyData.parentUuid ? this.copyData.parentUuid.uuid : null,
          uuid: this.copyData.uuid
        }
      },
      resetForm() {
        this.$refs['form'].resetFields();
        this.way = "add";
        this.form = {
          level: "1",
          enable: true,
        };
      },
    },
  }
</script>
<style scoped>
  .lableBox {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 40px;
    padding: 30px;
  }
</style>