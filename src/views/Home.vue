<template>
  <div class="home" style="margin-bottom: 40px">
    <!-- <p class="title">
      <span>数据录入</span>
    </p> -->
    <el-tooltip
      class="item"
      effect="dark"
      content="注销"
      placement="top-start"
    >
      <el-button
        icon="el-icon-switch-button"
        style="float:right; position: absolute; top: 20px; right: 20px"
        circle
        @click="logout"
      ></el-button>
    </el-tooltip>
    <div class="flex-box">
      <div class="flex-item">
        <el-container>
          <el-main>
            <el-form
              ref="form"
              :model="form"
              label-width="100px"
              :rules="rules"
            >
              <el-form-item label="地区" prop="region">
                <el-cascader
                  :props="props"
                  :disabled="disableSearch"
                  v-model="form.region"
                  id="region"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="日期" prop="date">
                <el-date-picker
                  v-model="form.date"
                  type="date"
                  :disabled="disableSearch"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </div>
    </div>

    <!-- 按钮组合 -->
    <el-button
      type="primary"
      @click="onSearch"
    > 查询 </el-button>
    <!-- <el-button
      v-show="!disableSearch"
      type="primary"
      @click="onSubmit"
      :disabled="disabledBtn"
    >查询/提交</el-button> -->
    <!-- <el-button
      v-show="disableSearch"
      type="warning"
      @click="onModify"
      :disabled="disabledBtn"
    >修改</el-button> -->
    <!-- <el-button
      v-show="disableSearch"
      type="danger"
      @click="onDelete"
      :disabled="disabledBtn"
    >删除</el-button> -->
    <el-button
      type="default"
      @click="onReturn"
    > 解锁 </el-button>
    
    <p 
      class="title" 
      style="border-bottom: 1px solid #eee"
    >统计信息</p>

    <div style="padding:0px 40px;" id="formData">
      <el-form
        :ref="form"
        :model="form"
        v-if="isFormAlive"
        label-width="90px"
      >
        <el-table 
          :data="form.countData"
          style="width:100%"
        >
          <el-table-column property="locName" label="地区" width="150">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit">
                <!-- {{ scope.row.locName ? scope.row.locName : regionName }} -->
                <el-cascader
                  :props="subRegions"
                  v-model = "scope.row.locId"
                  clearable
                ></el-cascader>
              </el-form-item>
              <span v-else>{{scope.row.locName}}</span>
            </template>
          </el-table-column>
          <el-table-column property="countConfirm" label="新增确诊" width="100">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'countData.' + scope.$index + '.countConfirm'"
              >
                <el-input v-model="scope.row.countConfirm" placeholder=""></el-input>
              </el-form-item>
              <span v-else>{{scope.row.countConfirm}}</span>
            </template>
          </el-table-column>
          <el-table-column property="countRecover" label="新增康复" width="100">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'countData.' + scope.$index + '.countRecover'"
              >
                <el-input v-model="scope.row.countRecover" placeholder=""></el-input>
              </el-form-item>
              <span v-else>{{scope.row.countRecover}}</span>
            </template>
          </el-table-column>
          <el-table-column property="countDead" label="新增死亡" width="100">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'countData.' + scope.$index + '.countDead'"
              >
                <el-input v-model="scope.row.countDead" placeholder=""></el-input>
              </el-form-item>
              <span v-else>{{scope.row.countDead}}</span>
            </template>
          </el-table-column>
          <el-table-column
            property="countSourceText"
            label="源数据"
          >
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'countData.' + scope.$index + '.countSourceText'"
              >
                <el-input type="textarea" v-model="scope.row.countSourceText" placeholder=""></el-input>
              </el-form-item>
              <span v-else>{{scope.row.countSourceText}}</span>
            </template>
          </el-table-column>
          <el-table-column
            property="countSourceUrl"
            label="源url"
          >
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'countData.' + scope.$index + '.countSourceUrl'"
              >
                <el-input type="textarea" v-model="scope.row.countSourceUrl" placeholder=""></el-input>
              </el-form-item>
              <span v-else>{{scope.row.countSourceUrl}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.edit">
                <el-button type="success" size="mini" @click="onSaveCount(scope.row)">
                  <span>保存</span>
                </el-button>
                <el-button type="primary" size="mini" @click="onCancelCount(scope.row, scope.$index)">
                  <span>取消</span>
                </el-button>
              </div>
              <div v-else>
                <el-button type="primary" size="mini" @click="onEditCount(scope.row)">
                  <span>编辑</span>
                </el-button>
                <el-button type="danger" size="mini" @click="onDelCount(scope.row, scope.$index)">
                  <span>删除</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table> 
      </el-form>
    </div>
    <el-button type="primary" @click="onAddCount" style="margin: 10px">添加统计</el-button> 
    <el-button type="success" @click="onSaveAllCounts" style="margin-top: 10px">保存所有统计</el-button>
    
    <p 
      class="title" 
      style="border-bottom: 1px solid #eee"
    >具体病例</p>
    <div style="padding:0px 40px;" id="nowData">
      <el-form
        :ref="formPat"
        :model="formPat"
        v-if="isFormPatAlive"
        label-width="90px"
      >
        <el-table 
          :data="formPat.patData"
          style="width:100%"
        >
          <el-table-column property="locName" label="地区" width="150">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit">
                <!-- {{ scope.row.locName ? scope.row.locName : regionName }} -->
                <el-cascader
                  :props="subRegions"
                  v-model = "scope.row.locId"
                  clearable
                ></el-cascader>
              </el-form-item>
              <span v-else>{{scope.row.locName}}</span>
            </template>
          </el-table-column>
          <el-table-column property="sampleAge" label="年龄" width="150">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'patData.' + scope.$index + '.sampleAge'"
              >
                <el-input v-model="scope.row.sampleAge" placeholder=""></el-input>
              </el-form-item>
              <span v-else>{{scope.row.sampleAge}}</span>
            </template>
          </el-table-column>
          <el-table-column property="sampleSex" label="性别" width="150">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'patData.' + scope.$index + '.sampleSex'" 
              >
                <el-select v-model="scope.row.sampleSex" placeholder="">
                  <el-option label="男" value="0">男</el-option>
                  <el-option label="女" value="1">女</el-option>
                </el-select>
              </el-form-item>
              <span v-else>
                <p v-if="scope.row.sampleSex==0">男</p>
                <p v-if="scope.row.sampleSex==1">女</p>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            property="sampleSourceText"
            label="源数据"
          >
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'patData.' + scope.$index + '.sampleSourceText'"
              >
                <el-input type="textarea" v-model="scope.row.sampleSourceText" placeholder=""></el-input>
              </el-form-item>
              <span v-else>{{scope.row.sampleSourceText}}</span>
            </template>
          </el-table-column>
          <el-table-column
            property="sampleSourceUrl"
            label="源url"
          >
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'patData.' + scope.$index + '.sampleSourceUrl'"
              >
                <el-input type="textarea" v-model="scope.row.sampleSourceUrl" placeholder=""></el-input>
              </el-form-item>
              <span v-else>{{scope.row.sampleSourceUrl}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.edit">
                <el-button type="success" size="mini" @click="onSavePat(scope.row)">
                  <span>保存</span>
                </el-button>
                <el-button type="primary" size="mini" @click="onCancelPat(scope.row, scope.$index)">
                  <span>取消</span>
                </el-button>
              </div>
              <div v-else>
                <el-button type="primary" size="mini" @click="onEditPat(scope.row)">
                  <span>编辑</span>
                </el-button>
                <el-button type="danger" size="mini" @click="onDelPat(scope.row, scope.$index)">
                  <span>删除</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table> 
      </el-form>
    </div>
    <el-button type="primary" @click="onAddPat" style="margin-top: 10px">添加病例</el-button> 
    <el-button type="success" @click="onSaveAllPats" style="margin-top: 10px">保存所有病例</el-button>
  </div>
</template>

<script>
import qs from "query-string";
import { 
  getCount, 
  getCase,
  insertCount,
  insertCases,
  modifyCount,
  modifyCase,
  deleteCase,
  deleteCount 
} from "@/api/count.js";

export default {
  name: "home",
  components: {},
  data() {
    let checkAge = (rule, value, callback) => {
      if (value > 150 || value < 0) {
        callback(new Error("请输入正确年龄(0~150,整数)"));
      } else {
        callback();
      }
    };
    let checkInteger = (rule, value, callback) => {
      if (!/(^[1-9]\d*$)/.test(value)) {
        if (value == 0 || !value) {
          callback();
        } else {
          callback(new Error("请输入正整数"));
        }
      } else {
        callback();
      }
    };
    return {
      isFormPatAlive: true, // 用于强制刷新
      isFormAlive: true,
      disabledBtn: false,
      readValue: "", // 用于解决selcet框回显value的bug
      closeMsg: false, // 用于关掉删除统计信息后的无查询结果
      // todo isInit没有使用，但暂时不删掉
      // isInit: true, // 页面初始化时，只显示地区、时间两个框和确认按钮（只有页面初始化时才可修改地区、时间）
      disableSearch: false, // 点击确认按钮后，是否有疫情数据，无的话显示提交按钮，反之则无

      regionId: localStorage.getItem("regionId"),
      regionName: "",
      form: {
        region: "",
        date: "",
        // 当前region所管辖的所有区域
        countData: []
        // {
        //   countConfirm
        //   countRecover
        //   countDead
        //   countSourceText
        //   countSourceUrl
        // }
      },
      searchForm: {
        date: "",
        region: ""
      },
      formPat: {
        patData: []
        // {
        //   id
        //   sampleSex
        //   sampleAge
        //   sampleConfirmTime
        //   sampleSourceText
        //   sampleSourceUrl
        //   locName
        // }
      },
      rules: {
        sampleAge: [{ validator: checkAge, trigger: "blur" }],
        // sex: [{ validator: checkAge, trigger: "blur" }],
        date: [
          { type: "date", required: true, message: "不能为空", trigger: "blur" }
        ],
        number1: [{ validator: checkInteger, trigger: "blur" }],
        number2: [{ validator: checkInteger, trigger: "blur" }],
        number3: [{ validator: checkInteger, trigger: "blur" }],
        region: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          var { level } = node;
          // eslint-disable-next-line no-undef
          axios
            .post(
              "/api/mark/info/getNextLoc",
              {
                locId:
                  level == 0
                    ? localStorage.getItem("regionId")
                    : node.data.value
              }
            )
            .then(res => {
              var nodes = [];
              res.data.data.forEach(item => {
                nodes.push({
                  value: item.id,
                  label: item.name,
                  leaf: level >= 0
                });
              });
              resolve(nodes);
            });
        }
      },
      subRegions: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          // if(!checkDateRegion(window.vue.$data.searchForm)) {
          if(!window.vue.$data.searchForm.date || !window.vue.$data.searchForm.locId) {
            this.$message.warning("请填入时间和地区")
            return false
          }
          var { level } = node;
          var locId = window.vue.$data.searchForm.locId // this获取不到。。。只能hack写法了，而且必须锁定查询框
          // eslint-disable-next-line no-undef
          axios
            .post(
              "/api/mark/info/getNextLoc",
              {
                locId:
                  level == 0
                    ? locId
                    : node.data.value
              }
            ).then(res => {
              var nodes = [];
              res.data.data.forEach(item => {
                nodes.push({
                  value: item.id,
                  label: item.name
                });
              });
              window.vue.$data.disableSearch = true
              resolve(nodes);
            });
        }
      },
    };
  },

  methods: {
    reloadCount () {
      this.isFormAlive = false
      this.$nextTick(function() {
        this.isFormAlive = true
      })
    },
    reloadPat () {
      this.isFormPatAlive = false
      this.$nextTick(function() {
        this.isFormPatAlive = true
      })
    },
    // 注：仅用于判断输入值是否符合
    isEmpty(value) {
      if ((!value || value.length === 0) && value !== 0) { // value == 0 也不是 empty
        return true;
      } else {
        return false;
      }
    },
    clearData() {
      this.form = {
        region: this.form.region,
        date: this.form.date,
        countData: []
        // number1: null, // 确诊
        // number2: null, // 康复
        // number3: null, // 死亡
        // text: null,
        // url: null
      },
      this.formPat.patData = [];
      this.searchForm = {}
    },
    getData(params) {
      this.getCount(params)
      this.getPat(params)
    },
    getCount(params) {
      getCount(params).then(res => {
        if (res.status === 0) {
          if(res.data.length == 0) {
            this.$message.success("无统计信息")
          }
          this.form.countData = Array.isArray(res.data) ? 
                                res.data : [res.data]
          this.form.countData.forEach((item, index) => {
            item.edit = false
            item.locId = [item.countRegionId]
          })
          this.disableSearch = true
          // this.isInit = false
        } else {
          this.$message.error(res.desc);
        }
        this.reloadCount()
      })
      .catch((res) => {
        this.clearData()
        if (res.status === 602) {
          if(!this.closeMsg) {
            this.$message.error(res.desc);
          } else {
            this.closeMsg = false
          }
        }
      })
      .finally(() => {
        this.disabledBtn = false;
      });
    },
    getPat(params) {
      getCase(params).then(res => {
        if(res.status === 0) {
          this.formPat.patData = res.data
          this.formPat.patData.forEach((item, index) => {
            item.edit = false
            item.locId = [item.sampleRegionId]
          })
          this.disableSearch = true
        } else {
          this.$message.error(res.desc);
        }
        this.reloadPat()
      })
    },
    onSearch() {
      // this.isInit = false
      this.searchForm = {
        locId: this.form.region[this.form.region.length - 1],
        date: new Date(this.form.date).Format("yyyy-MM-dd")
      };
      if(this.checkDateRegion(this.searchForm)) {
        this.getData(this.searchForm)
      }
    },
    onReturn() {
      this.clearData()
      // this.isInit = true
      this.disableSearch = false
    },
    onSubmit() {
      // if(!this.searchForm.date || !this.searchForm.locId) {
      //   this.$message.warning("请填入时间和地区")
      //   return false
      // }
      // this.disabledBtn = true;
      // var isEmpty = this.isEmpty;
      // var params_count = {
      //   countRegionId: this.form.region[this.form.region.length - 1],
      //   countDate: new Date(this.form.date).Format("yyyy-MM-dd"),
      //   countConfirm: this.form.countData.countConfirm,
      //   countRecover: this.form.countData.countRecover,
      //   countDead: this.form.countData.countDead,
      //   countSourceUrl: this.form.countData.countSourceUrl,
      //   countSourceText: this.form.countData.countSourceText,
      // };
      // this.$refs["form"].validate(valid => {
      //   if (valid) {
      //     // 如果都为空，执行查询操作；如果有一项不为空，执行提交操作
      //     if (isEmpty(params_count.countConfirm) &&
      //       isEmpty(params_count.countRecover) &&
      //       isEmpty(params_count.countDead) &&
      //       isEmpty(params_count.countSourceText) &&
      //       isEmpty(params_count.countSourceUrl)
      //     ) {
      //       if(!this.checkDateRegion(this.searchForm)) {
      //         this.disabledBtn = false;
      //         return false
      //       }
      //       this.searchForm = {
      //         locId: this.form.region[this.form.region.length - 1],
      //         date: new Date(this.form.date).Format("yyyy-MM-dd")
      //       };
      //       this.getData(this.searchForm)
      //     } else {
      //       // 检查输入数据是否都有效
      //       if(!this.checkDateRegion(this.searchForm) || !this.checkCount(params_count)) {
      //         this.disabledBtn = false;
      //         return false
      //       }
      //       insertCount(params_count)
      //         .then(res => {
      //           if(res.status === 0) {
      //             this.$message.success("提交成功");
      //             this.onReturn()
      //           } else {
      //             this.$message.error(res.desc)
      //           }
      //         })
      //         .finally(() => {
      //           this.disabledBtn = false;
      //         });
      //     }
      //   } else {
      //     this.disabledBtn = false;
      //   }
      // });
    },
    onModify() { 
      // this.$confirm("确认修改？")
      //   .then(() => {
      //     this.disabledBtn = true;
      //     var param = {
      //       id: this.form.id,
      //       countRegionId: this.form.region[this.form.region.length - 1],
      //       countDate: new Date(this.form.date).Format("yyyy-MM-dd"),
      //       countConfirm: this.form.countData.countConfirm,
      //       countRecover: this.form.countData.countRecover,
      //       countDead: this.form.countData.countDead,
      //       countSourceUrl: this.form.countData.countSourceUrl,
      //       countSourceText: this.form.countData.countSourceText,
      //     };
      //     if(!this.checkDateRegion(this.searchForm) || !this.checkCount(param)) {
      //       this.disabledBtn = false;
      //       return false
      //     }
      //     modifyCount(param).then(res => {
      //       if(res.status == 0) {
      //         this.$message.success("修改成功")
      //         this.onReturn()
      //       } else {
      //         this.$message.error(res.desc)
      //       }
      //     })
      //     .finally(() => {
      //       this.disabledBtn = false;
      //     });
      //   })
    }, 
    onDelete() { 
      // this.$confirm("将同时删除所有病例，确认删除？") // 确认删除该信息及所有病例
      //   .then(() => {
      //     this.disabledBtn = true;
      //     deleteCount(this.form.id).then((res) => {
      //       if(res.status == 0) {
      //         this.$message.success("删除成功")
      //         this.onReturn()
      //       } else {
      //         this.$message.error(res.desc)
      //       }
      //     })
      //     .finally(() => {
      //       this.disabledBtn = false;
      //     });
      //   }).catch(() => {});
    },

    onAddCount() {
      if(!this.checkDateRegion(this.searchForm)) {
        return false
      }
      this.form.countData.push({
        edit: true,
        id: "",
        countConfirm: "",
        countRecover: "0",
        countDead: "0",
        countSourceText: "",
        countSourceUrl: "",
        locName: ""
      })
    },
    onEditCount(row) {
      row.edit = true
      row.locId = []
      this.reloadCount()
    },
    onCancelCount(row, index) {
      if(!row.id) {
        this.form.countData.splice(index, 1);
      } else {
        row.edit = false
        this.getCount(this.searchForm)
      }
    },
    onSaveCount(row) {
      if(!this.checkDateRegion(this.searchForm) || !this.checkCount(row)) {
        return false
      }
      var count = {
        countRegionId: row.locId[row.locId.length - 1],
        countDate: new Date(this.form.date).Format("yyyy-MM-dd"),
        countConfirm: row.countConfirm,
        countRecover: row.countRecover,
        countDead: row.countDead,
        countSourceUrl: row.countSourceUrl,
        countSourceText: row.countSourceText,
      };
      if(!row.id) {
        insertCount(count).then(res => {
          if(res.status === 0) {
            this.$message.success("保存统计成功");
            row.edit = false;
            this.getCount(this.searchForm)
          } else {
            this.$message.error(res.desc)
          }
        })
      } else {
        count.id = row.id
        modifyCount(count).then(res => {
          if(res.status === 0) {
            this.$message.success("修改统计成功");
            row.edit = false;
            this.getCount(this.searchForm)
          } else {
            this.$message.error(res.desc)
          }
        })
      }
    },
    onSaveAllCounts() {
      if(this.checkDateRegion(this.searchForm)) {
        var valid = true
        this.form.countData.forEach((item, index) => {
          if(!this.checkCount(item)) {
            valid = false
          }
        })
        if(valid) {
          // 先检查所有的填空是否有效，再逐个保存
          this.form.countData.forEach((item, index) => {
            this.onSaveCount(item)
          })
        }
      }
    },
    onDelCount(row, index) {
      this.$confirm("将同时删除对应的所有病例，确认删除统计？")
        .then(() => {
          deleteCount(row.id).then((res) => {
            if(res.status == 0) {
              this.$message.success("删除统计成功");
              this.closeMsg = true
              this.getCount(this.searchForm)
              this.getPat(this.searchForm)
            } else {
              this.$message.error(res.desc)
            }
          })
        }).catch(() => {});
    },

    // 添加/确认/编辑/删除 表单里的病例栏
    onAddPat() {
      if(!this.checkDateRegion(this.searchForm)) {
        return false
      }
      this.formPat.patData.push({
        edit: true,
        id: "",
        sampleSex: "",
        sampleAge: "",
        sampleConfirmTime: "",
        sampleSourceText: "",
        sampleSourceUrl: "",
        locName: ""
      })
    },
    onSavePat(row) {
      if(!this.checkDateRegion(this.searchForm) || !this.checkPat(row)) {
        return false
      }
      var pat = {
        // sampleRegionId: this.form.region[
        //   this.form.region.length - 1
        // ],
        sampleRegionId: row.locId[row.locId.length - 1],
        sampleSex: row.sampleSex,
        sampleAge: row.sampleAge,
        sampleDate: new Date().Format(
          "yyyy-MM-dd"
        ), // 录入的时间
        sampleConfirmTime: new Date(this.form.date).Format(
          "yyyy-MM-dd"
        ),
        sampleSourceUrl: row.sampleSourceUrl,
        sampleSourceText: row.sampleSourceText
      }
      if(!row.id) {
        insertCases(pat).then((res) => {
          if(res.status === 0) {
            this.$message.success("保存病例成功");
            row.edit = false;
            this.getPat(this.searchForm)
          } else {
            this.$message.error(res.desc)
          }
        })
      } else {
        pat.id = row.id
        modifyCase(pat).then((res) => { 
          if(res.status === 0) {
            this.$message.success("修改病例成功");
            row.edit = false;
            this.getPat(this.searchForm)
          } else {
            this.$message.error(res.desc)
          }
        })
      }
    },
    onCancelPat(row, index) {
      if(!row.id) {
        this.formPat.patData.splice(index, 1);
      } else {
        row.edit = false
        this.getPat(this.searchForm)
      }
    },
    onEditPat(row) {
      row.edit = true
      // this.readValue = row.sampleSex
      // row.sampleSex = String(this.readValue)
      // this.readValue = row.sampleAge
      // row.sampleAge = String(this.readValue)
      row.locId = []
      this.reloadPat()
    },
    onDelPat(row, index) {
      this.$confirm("确认删除病例？")
        .then(() => {
          deleteCase(row.id).then((res) => {
            if(res.status == 0) {
              this.$message.success("删除病例成功");
              this.getPat(this.searchForm)
            } else {
              this.$message.error(res.desc)
            }
          })
        }).catch(() => {});
    },
    onSaveAllPats() {
      if(this.checkDateRegion(this.searchForm)) {
        var valid = true
        this.formPat.patData.forEach((item, index) => {
          if(!this.checkPat(item)) {
            valid = false
          }
        })
        if(valid) {
          // 先检查所有的填空是否有效，再逐个保存
          this.formPat.patData.forEach((item, index) => {
            this.onSavePat(item)
          })
        }
      }
    },
    checkDateRegion(form) {
      if(!form.date || !form.locId) {
        this.$message.warning("请填入时间和地区")
        return false
      }
      return true
    },
    checkPat(pat) {
      var isEmpty = this.isEmpty
      if (
        isEmpty(pat.locId) ||
        isEmpty(pat.sampleSex) ||
        isEmpty(pat.sampleAge) ||
        isEmpty(pat.sampleSourceText) ||
        isEmpty(pat.sampleSourceUrl)
      ) {
        this.$message.warning("请填入所有的病例信息")
        return false
      }
      return true
    },
    checkCount(count) {
      var isEmpty = this.isEmpty
      if (
        isEmpty(count.locId) ||
        isEmpty(count.countConfirm) ||
        isEmpty(count.countRecover) ||
        isEmpty(count.countDead) ||
        isEmpty(count.countSourceText) ||
        isEmpty(count.countSourceUrl)
      ) {
        this.$message.warning("请填入所有的统计信息")
        return false
      }
      return true
    },

    logout() {
      // eslint-disable-next-line no-useless-escape
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (var i = keys.length; i--; )
          document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
      }
      localStorage.removeItem("regionId");

      this.$router.push({ name: "login" });
    },
  },
  watch: {
    form: {
      handler: function() {
        this.searchForm = {
          locId: this.form.region[this.form.region.length - 1],
          date: new Date(this.form.date).Format("yyyy-MM-dd")
        };
        setTimeout(() => {
          this.regionName = document.getElementById("region")
            .querySelectorAll(".el-input")[0]
            .querySelectorAll("input")[0]
            .value.split(" / ").join("-");
        }, 300)
        if(
          this.formPat.patData.length === 0 &&
          this.form.countData.length === 0
        ) {
          this.disableSearch = false
        }
      },
      deep: true
    },
    formPat: {
      handler: function() {
        if(
          this.formPat.patData.length === 0 &&
          this.form.countData.length === 0
        ) {
          this.disableSearch = false
        }
      },
      deep: true
    },
    // searchForm: {
    //   handler: function() {
    //   },
    //   deep: true
    // }
  },
  mounted() {
    (function() {
      // canvas 实现 watermark
      function __canvasWM({
        // 使用 ES6 的函数默认值方式设置参数的默认取值
        // 具体参见 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Default_parameters
        container = document.getElementById("nowData"),
        width = "150px",
        height = "100px",
        textAlign = "center",
        textBaseline = "middle",
        font = "10px Microsoft Yahei",
        fillStyle = "rgba(184, 184, 184, 0.6)",
        content = "请勿外传",
        rotate = "30",
        zIndex = 1000
      } = {}) {
        const args = arguments[0];
        const canvas = document.createElement("canvas");

        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        const ctx = canvas.getContext("2d");

        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.font = font;
        ctx.fillStyle = fillStyle;
        ctx.rotate((Math.PI / 180) * rotate);
        ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

        const base64Url = canvas.toDataURL();
        const __wm = document.querySelector(".__wm");

        const watermarkDiv = __wm || document.createElement("div");
        const styleStr = `
          position:absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          z-index:${zIndex};
          pointer-events:none;
          background-repeat:repeat;
          background-image:url('${base64Url}')`;

        watermarkDiv.setAttribute("style", styleStr);
        watermarkDiv.classList.add("__wm");

        if (!__wm) {
          container.style.position = "relative";
          container.insertBefore(watermarkDiv, container.firstChild);
        }

        const MutationObserver =
          window.MutationObserver || window.WebKitMutationObserver;
        if (MutationObserver) {
          let mo = new MutationObserver(function() {
            const __wm = document.querySelector(".__wm");
            // 只在__wm元素变动才重新调用 __canvasWM
            if ((__wm && __wm.getAttribute("style") !== styleStr) || !__wm) {
              // 避免一直触发
              mo.disconnect();
              mo = null;
              __canvasWM(JSON.parse(JSON.stringify(args)));
            }
          });

          mo.observe(container, {
            attributes: true,
            subtree: true,
            childList: true
          });
        }
      }

      if (typeof module != "undefined" && module.exports) {
        //CMD
        module.exports = __canvasWM;
        // eslint-disable-next-line no-undef
      } else if (typeof define == "function" && define.amd) {
        // AMD
        // eslint-disable-next-line no-undef
        define(function() {
          return __canvasWM;
        });
      } else {
        window.__canvasWM = __canvasWM;
      }
    })();

    // 调用
    // eslint-disable-next-line no-undef
    __canvasWM({
      content: localStorage.getItem("phone")
    });

    window.vue = this
  }
};
</script>

<style scoped>
.home {
  margin: auto 0;
}

.flex-box .el-main {
  padding: 20px 20px 0 20px !important;
}
.flex-box .el-input {
  width: 100% !important;
}

.flex-box .el-select {
  width: 100%;
}
.flex-box .el-cascader {
  width: 100%;
}
.flex-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-box2 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.float-box {
  float: left;
  width: 50%;
}
.title {
  font-size: 20px;
  line-height: 20px;
  font-weight: bold;
  /* margin: 10px; */
  padding: 15px 0px 15px 0px;
  margin: 0px;
  text-align: center;
}
#formData >>> .el-form-item {
  margin: 0px!important;
}
#formData >>> .el-form-item__content {
  margin: 0px!important;
}
#nowData >>> .el-form-item {
  margin: 0px!important;
}
#nowData >>> .el-form-item__content {
  margin: 0px!important;
}
</style>
