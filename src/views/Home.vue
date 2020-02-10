<template>
  <div class="home">
    <p class="title">
      <span>数据录入</span>
      <el-tooltip
        class="item"
        effect="dark"
        content="注销"
        placement="top-start"
      >
        <el-button
          icon="el-icon-switch-button"
          style="float:right"
          circle
          @click="logout"
        ></el-button>
      </el-tooltip>
    </p>
    <div class="flex-box">
      <div class="flex-item">
        <el-container>
          <el-main>
            <el-form
              ref="form"
              :model="form"
              label-width="100px"
              :rules="rules2"
            >
              <el-form-item label="地区" prop="region">
                <el-cascader
                  :props="props"
                  :disabled="!isInit"
                  v-model="form.region"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="日期" prop="date1">
                <el-date-picker
                  v-model="form.date1"
                  type="date"
                  :disabled="!isInit"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="新增确诊" prop="number1">
                <el-input v-model="form.number1"></el-input>
              </el-form-item>
              <el-form-item label="新增康复" prop="number2">
                <el-input v-model="form.number2"></el-input>
              </el-form-item>
              <el-form-item label="新增死亡" prop="number3">
                <el-input v-model="form.number3"></el-input>
              </el-form-item>
              <el-form-item label="源数据" prop="text">
                <el-input type="textarea" v-model="form.text"></el-input>
              </el-form-item>
              <el-form-item label="源url" prop="url">
                <el-input type="textarea" v-model="form.url"></el-input>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </div>
    </div>

    <el-footer style="margin-bottom: 30px">
      <!-- 按钮组合 -->
      <!-- <el-button
        v-show="isInit"
        type="primary"
        @click="onShow"
        style="margin-top: 12px; "
      > 确认 </el-button> -->
      <el-button
        v-show="!hasData"
        type="primary"
        @click="onSubmit"
        style="margin-top: 12px; "
        :disabled="disabledBtn"
      >查询/提交</el-button>
      <el-button
        v-show="hasData"
        type="warning"
        @click="onModify"
        style="margin-top: 12px; "
        :disabled="disabledBtn"
      >修改</el-button>
      <el-button
        v-show="hasData"
        type="danger"
        @click="onDelete"
        style="margin-top: 12px; "
        :disabled="disabledBtn"
      >删除</el-button>
      <el-button
        v-show="!isInit"
        type="default"
        @click="onReturn"
        style="margin-top: 12px; "
      >取消</el-button>
    </el-footer>

    <p 
      class="title" 
      style="border-bottom: 1px solid #eee; marigin: 10px 0px;"
    >具体病例</p>
    <div style="padding:0px 40px;" id="nowData">
      <el-form
        :ref="formPat"
        :model="formPat"
        v-if="isFormAlive"
        label-width="90px"
      >
        <el-table 
          :data="formPat.patData"
        >
          <el-table-column property="sampleAge" label="年龄">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'patData.' + scope.$index + '.sampleAge'"
              >
                <el-input v-model="scope.row.sampleAge" placeholder=""></el-input>
              </el-form-item>
              <span v-else>{{scope.row.sampleAge}}</span>
            </template>
          </el-table-column>
          <el-table-column property="sampleSex" label="性别">
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div v-if="scope.row.edit">
                <el-button type="success" size="mini" @click="cfmPatScope(scope.row)">
                  <span>保存</span>
                </el-button>
                <el-button type="primary" size="mini" @click="cancelScope(scope.row, scope.$index)">
                  <span>取消</span>
                </el-button>
              </div>
              <div v-else>
                <el-button type="primary" size="mini" @click="editPatScope(scope.row)">
                  <span>编辑</span>
                </el-button>
                <el-button type="danger" size="mini" @click="delPatScope(scope.row, scope.$index)">
                  <span>删除</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button 
          type="primary" 
          @click="addPatScope"
          style="margin-top: 10px"
        >添加病例</el-button> 
      </el-form>
    </div>
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
      isFormAlive: true, // 用于强制刷新
      regionId: localStorage.getItem("regionId"),
      form: {
        region: "",
        date1: "",
        number1: null, // 确诊
        number2: null, // 康复
        number3: null, // 死亡
        text: null,
        url: null
      },
      disabledBtn: false,
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
      readValue: "", // 用于解决selcet框回显value的bug
      rules2: {
        age: [{ validator: checkAge, trigger: "blur" }],
        sex: [{ validator: checkAge, trigger: "blur" }],
        date1: [
          { type: "date", required: true, message: "不能为空", trigger: "blur" }
        ],
        number1: [{ validator: checkInteger, trigger: "blur" }],
        number2: [{ validator: checkInteger, trigger: "blur" }],
        number3: [{ validator: checkInteger, trigger: "blur" }],
        region: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      hasDetailCase: false,
      isInit: true, // 页面初始化时，只显示地区、时间两个框和确认按钮（只有页面初始化时才可修改地区、时间）
      hasData: false, // 点击确认按钮后，是否有疫情数据，无的话显示提交按钮，反之则无
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          var { level } = node;
          // eslint-disable-next-line no-undef
          axios
            .post(
              "/api/info/getNextLoc",
              qs.stringify({
                locId:
                  level == 0
                    ? localStorage.getItem("regionId")
                    : node.data.value
              })
            )
            .then(res => {
              var nodes = [];
              res.data.forEach(item => {
                nodes.push({
                  value: item.id,
                  label: item.name
                });
              });
              resolve(nodes);
            });
        }
      }
    };
  },

  methods: {
    reload () {
      this.isFormAlive = false
      this.$nextTick(function() {
        this.isFormAlive = true
      })
    },
    // 注：仅用于判断输入值是否符合
    isEmpty(value) {
      if (!value && value !== 0) { // value == 0 也不是 empty
        return true;
      } else {
        return false;
      }
    },
    clearData() {
      this.form = {
        region: this.form.region,
        date1: this.form.date1,
        number1: null, // 确诊
        number2: null, // 康复
        number3: null, // 死亡
        text: null,
        url: null
      },
      this.formPat.patData = [];
      this.searchForm = {}
    },
    getData(params) {
      this.getForm(params)
      this.getPat(params)
    },
    getForm(params) {
      getCount(params).then(res => {
        if (res.status === 0) {
          var data = res.Counts
          this.form.id = data.id
          this.form.number1 = data.countConfirm
          this.form.number2 = data.countRecover
          this.form.number3 = data.countDead
          this.form.text = data.countSourceText
          this.form.url = data.countSourceUrl
          this.hasData = true
          this.isInit = false
        } else {
          this.$message(res.desc);
        }
      })
      .catch(() => {
        this.clearData()
      })
      .finally(() => {
        this.disabledBtn = false;
      });
    },
    getPat(params) {
      if(!this.searchForm.date || !this.searchForm.locId) {
        this.$message("请填入时间和地区")
      } else {
        getCase(params).then(res => {
          if(res.status === 0) {
            this.formPat.patData = res.Patients
            this.formPat.patData.forEach((item, index) => {
              item.edit = false
            })
          } else {
            this.$message(res.desc);
          }
        })
      }
    },
    // onShow() {
    //   this.isInit = false
    //   this.searchForm = {
    //     locId: this.form.region[this.form.region.length - 1],
    //     date: new Date(this.form.date1).Format("yyyy-MM-dd")
    //   };
    //   this.getData(this.searchForm)
    // },
    onReturn() {
      this.clearData()
      this.isInit = true
      this.hasData = false
    },
    onSubmit() {
      this.disabledBtn = true;
      var isEmpty = this.isEmpty;
      var params_count = {
        countRegionId: this.form.region[this.form.region.length - 1],
        countDate: new Date(this.form.date1).Format("yyyy-MM-dd"),
        countConfirm: this.form.number1,
        countRecover: this.form.number2,
        countDead: this.form.number3,
        countSourceUrl: this.form.url,
        countSourceText: this.form.text,
      };
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 如果都为空，执行查询操作；如果有一项不为空，执行提交操作
          if (isEmpty(params_count.countConfirm) &&
            isEmpty(params_count.countRecover) &&
            isEmpty(params_count.countDead) &&
            isEmpty(params_count.countSourceText) &&
            isEmpty(params_count.countSourceUrl)
          ) {
            this.searchForm = {
              locId: this.form.region[this.form.region.length - 1],
              date: new Date(this.form.date1).Format("yyyy-MM-dd")
            };
            this.getData(this.searchForm)
          } else {
            // 检查输入数据是否都有效
            if (isEmpty(params_count.countConfirm) ||
              isEmpty(params_count.countRecover) ||
              isEmpty(params_count.countDead) ||
              isEmpty(params_count.countSourceText) ||
              isEmpty(params_count.countSourceUrl)
            ) {
              this.$message("请填写完整，或输入有效数据")
              this.disabledBtn = false;
              return false
            }
            insertCount(params_count)
              .then(res => {
                if(res.status === 0) {
                  this.$message("提交成功");
                  this.onReturn()
                } else {
                  this.$message(res.desc)
                }
              })
              .finally(() => {
                this.disabledBtn = false;
              });
          }
        } else {
          this.disabledBtn = false;
        }
      });
    },
    onModify() { 
      this.$confirm("确认修改？")
        .then(() => {
          this.disabledBtn = true;
          var param = {
            id: this.form.id,
            countRegionId: this.form.region[this.form.region.length - 1],
            countDate: new Date(this.form.date1).Format("yyyy-MM-dd"),
            countConfirm: this.form.number1,
            countRecover: this.form.number2,
            countDead: this.form.number3,
            countSourceUrl: this.form.url,
            countSourceText: this.form.text,
          };
          var isEmpty = this.isEmpty
          if (isEmpty(param.countConfirm) ||
            isEmpty(param.countRecover) ||
            isEmpty(param.countDead) ||
            isEmpty(param.countSourceText) ||
            isEmpty(param.countSourceUrl)
          ) {
            this.$message("请填写完整，或输入有效数据")
            this.disabledBtn = false;
            return false
          }
          modifyCount(param).then(res => {
            if(res.status == 0) {
              this.$message("修改成功")
              this.onReturn()
            } else {
              this.$message(res.desc)
            }
          })
          .finally(() => {
            this.disabledBtn = false;
          });
        })
    }, 
    onDelete() { 
      this.$confirm("将同时删除所有病例，确认删除？") // 确认删除该信息及所有病例
        .then(() => {
          this.disabledBtn = true;
          deleteCount(this.form.id).then((res) => {
            if(res.status == 0) {
              this.$message("删除成功")
              this.onReturn()
            } else {
              this.$message(res.desc)
            }
          })
          .finally(() => {
            this.disabledBtn = false;
          });
        }).catch(() => {});
    },

    // 添加/确认/编辑/删除 表单里的病例栏
    addPatScope() {
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
    cfmPatScope(row) {
      var isEmpty = this.isEmpty
      if (isEmpty(row.sampleSex) ||
        isEmpty(row.sampleAge) ||
        isEmpty(row.sampleSourceText) ||
        isEmpty(row.sampleSourceUrl)
      ) {
        this.$message("请填写完整，或输入有效数据")
        return false
      }
      if(!this.searchForm.date || !this.searchForm.locId) {
        this.$message("请填入时间和地区")
        return false
      }
      var pat = {
        sampleRegionId: this.form.region[
          this.form.region.length - 1
        ],
        sampleSex: row.sampleSex,
        sampleAge: row.sampleAge,
        sampleDate: new Date().Format(
          "yyyy-MM-dd"
        ), // 录入的时间
        sampleConfirmTime: new Date(this.form.date1).Format(
          "yyyy-MM-dd"
        ),
        sampleSourceUrl: row.sampleSourceUrl,
        sampleSourceText: row.sampleSourceText
      }
      if(!row.id) {
        insertCases([pat]).then((res) => {
          if(res.status === 0) {
            this.$message("保存成功");
            row.edit = false;
            this.getPat(this.searchForm)
            this.reload() 
          } else {
            this.$message(res.desc)
          }
        })
      } else {
        pat.id = row.id
        modifyCase(pat).then((res) => { 
          if(res.status === 0) {
            this.$message("修改成功");
            row.edit = false;
            this.getPat(this.searchForm)
            this.reload()
          } else {
            this.$message(res.desc)
          }
        })
      }
    },
    cancelScope(row, index) {
      if(!row.id) {
        this.formPat.patData.splice(index, 1);
      } else {
        row.edit = false
        this.getPat(this.searchForm)
        this.reload()
      }
    },
    editPatScope(row) {
      row.edit = true
      this.readValue = row.sampleSex
      row.sampleSex = String(this.readValue)
      this.reload()
    },
    delPatScope(row, index) {
      this.$confirm("确认删除？")
        .then(() => {
          deleteCase(row.id).then((res) => {
            if(res.status == 0) {
              this.$message("删除成功");
              this.getPat(this.searchForm)
            } else {
              this.$message(res.desc)
            }
          })
        }).catch(() => {});
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
          date: new Date(this.form.date1).Format("yyyy-MM-dd")
        };
      },
      deep: true
    }
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
  font-size: 26px;
  line-height: 50px;
  font-weight: bold;
  margin: 10px;
  text-align: center;
}
</style>
