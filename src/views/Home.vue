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
                  v-model="form.region"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="日期" prop="date1">
                <el-date-picker
                  v-model="form.date1"
                  type="date"
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
              <el-form-item label="有详细病例">
                <el-switch v-model="hasDetailCase"></el-switch>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </div>
      <div
        class="flex-item"
        v-if="hasDetailCase"
        style="width:1000px;height:500px;overflow-y:auto"
      >
        <div class="flex-box2">
          <div
            class=""
            style="padding:5px;margin:0 5px;border:0px dashed gray;width:45%"
            v-for="(item, index) in cases"
            :key="index"
          >
            <el-form
              :ref="'case' + index"
              :model="item"
              :rules="rules2"
              label-width="90px"
            >
              <el-form-item label="年龄" prop="age">
                <el-input v-model="item.age"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <!-- <el-input v-model="item.sex"></el-input> -->
                <el-select v-model="item.sex" placeholder="">
                  <el-option label="男" value="0"></el-option>
                  <el-option label="女" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="确诊日期" prop="date">
                <el-date-picker
                  v-model="item.date"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="源数据" prop="text">
                <el-input type="textarea" v-model="item.text"></el-input>
              </el-form-item>
              <el-form-item label="源url" prop="url">
                <el-input type="textarea" v-model="item.url"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  @click="delCase(index)"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                >
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div style="width:45%">
            <el-button @click="addCase" type="">加一条</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-footer style="border-bottom: 1px solid #eee">
      <el-button
        type="primary"
        @click="onSubmit2"
        style="margin-top: 12px; "
        :disabled="inserting"
        >{{ inserting == true ? "提交中" : "提交" }}</el-button
      >
    </el-footer>

    <p class="title">目前数据</p>

    <div style="padding:0px 40px;" id="nowData">
      <table style="width:100%;margin:20px 0">
        <td>地区：{{ countData.countRegion }}</td>
        <td>日期：{{ new Date(countData.countDate).Format("yyyy-MM-dd") }}</td>
        <td>新增确诊：{{ countData.countConfirm }}</td>
        <td>新增康复：{{ countData.countRecover }}</td>
        <td>新增死亡：{{ countData.countDead }}</td>
        <td>源数据：{{ countData.countSourceText }}</td>
        <td>源url：{{ countData.countSourceUrl }}</td>
      </table>

      <el-table :data="patData">
        <el-table-column property="id" label="id"></el-table-column>
        <el-table-column property="locName" label="地区">
          <template slot-scope="scope">
            {{ scope.row.locName.replace("null-", "") }}
          </template>
        </el-table-column>

        <el-table-column property="sampleAge" label="年龄"></el-table-column>
        <el-table-column property="sampleSex" label="性别">
          <template slot-scope="scope">
            {{ scope.row.sampleSex == 0 ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column
          property="sampleConfirmTime"
          label="确诊日期"
        ></el-table-column>
        <el-table-column
          property="sampleSourceText"
          label="源数据"
        ></el-table-column>
        <el-table-column
          property="sampleSourceUrl"
          label="源url"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import qs from "query-string";
import { insertCount, insertCases } from "@/api/count.js";

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
      regionId: localStorage.getItem("regionId"),
      form: {
        region: "",
        date1: "",
        number1: null,
        number2: null,
        number3: null,
        text: null,
        url: null
      },
      inserting: false,
      searchForm: {
        date: "",
        region: ""
      },
      patData: [],
      countData: {
        countDate: 0,
        countConfirm: 0,
        countRecover: 0,
        countDead: 0,
        countText: "",
        countRegion: ""
      },
      cases: [
        {
          age: null,
          sex: null,
          date: null,
          url: null,
          text: null
        }
      ],
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
    onSubmit2() {
      this.inserting = true;
      var params_count = {
        countRegionId: this.form.region[this.form.region.length - 1],
        countDate: new Date(this.form.date1).Format("yyyy-MM-dd"),
        countConfirm: this.form.number1 || 0,
        countRecover: this.form.number2 || 0,
        countDead: this.form.number3 || 0,
        countSourceUrl: this.form.url,
        countSourceText: this.form.text,
        countUserId: this.regionId
      };
      var isEmpty = this.isEmpty;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (
            //只有region和date  只查询
            isEmpty(params_count.countConfirm) &&
            isEmpty(params_count.countRecover) &&
            isEmpty(params_count.countDead) &&
            isEmpty(params_count.countSourceText) &&
            isEmpty(params_count.countSourceUrl)
          ) {
            this.searchForm = {
              region: this.form.region,
              date: this.form.date1
            };
            this.inserting = false;
          } else {
            //更新加查询
            if (this.hasDetailCase == true) {
              //两种都更新
              insertCount(params_count)
                .then(() => {
                  var params_cases = [];
                  for (let i = 0; i < this.cases.length; i++) {
                    params_cases.push({
                      sampleRegionId: this.form.region[
                        this.form.region.length - 1
                      ],
                      sampleSex: this.cases[i].sex,
                      sampleAge: this.cases[i].age,
                      sampleDate: new Date(this.form.date1).Format(
                        "yyyy-MM-dd"
                      ),
                      sampleConfirmTime: new Date(this.cases[i].date).Format(
                        "yyyy-MM-dd"
                      ),
                      sampleSourceUrl: this.cases[i].url,
                      sampleSourceText: this.cases[i].text,
                      sampleUserId: this.regionId
                    });
                  }
                  insertCases(params_cases).then(() => {
                    this.$message("插入成功");
                    this.searchForm = {
                      region: this.form.region,
                      date: this.form.date1
                    };
                  });
                })
                .finally(() => {
                  this.inserting = false;
                });
            } else {
              //只更新count
              insertCount(params_count)
                .then(res => {
                  console.log(res);
                  this.$message("插入成功");
                  this.searchForm = {
                    region: this.form.region,
                    date: this.form.date1
                  };
                })
                .finally(() => {
                  this.inserting = false;
                });
            }
          }
        } else {
          this.inserting = false;
        }
      });
    },
    addCase() {
      this.cases = this.cases.concat([
        {
          age: null,
          sex: null,
          date: null,
          url: null,
          text: null
        }
      ]);
    },
    delCase(index) {
      this.cases.splice(index, 1);
    },
    getPatData(params) {
      this.axios
        .post(
          "/api/info/getPat",
          qs.stringify({
            locId: params.region[params.region.length - 1],
            date: new Date(params.date).Format("yyyy-MM-dd")
          })
        )
        .then(res => {
          if (res.data.status == 0) {
            this.patData = res.data.Patients;
          } else {
            this.$message(res.data.desc);
          }
        });
      this.axios
        .post(
          "/api/info/getCount",
          qs.stringify({
            locId: params.region[params.region.length - 1],
            date: new Date(params.date).Format("yyyy-MM-dd")
          })
        )
        .then(res => {
          if (res.data != "") {
            if (res.data.status == 0) {
              this.countData = res.data.Counts;
              this.countData.countDate = String(this.form.date1);
              var region = res.data.Counts.locName.replace("null-", "");
              this.countData.countRegion = region;
            } else {
              this.$message(res.data.desc);
            }
          }
        });
      this.form.number1 = null;
      this.form.number2 = null;
      this.form.number3 = null;
      this.form.text = "";
      this.form.url = "";
      this.cases = [
        {
          age: null,
          sex: null,
          date: null,
          url: null,
          text: null
        }
      ];
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
    isEmpty(value) {
      if (!value || value == "" || value == 0) {
        return true;
      } else {
        return false;
      }
    },
    handleDelete(index, row) {
      this.$confirm("确认删除？")
        .then(() => {
          this.axios
            .post("/api/sample/delete", qs.stringify({ patId: row.id }))
            .then(res => {
              if (res.data.status == 0) {
                //成功
                this.getPatData(this.searchForm);
                // eslint-disable-next-line no-undef
                // done();
              }
            });
        })
        .catch(() => {});
    }
  },
  watch: {
    searchForm: {
      handler: function() {
        this.getPatData(this.searchForm);
        //do something
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
