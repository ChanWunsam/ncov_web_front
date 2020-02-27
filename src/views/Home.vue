<template>
  <div class="home" style="margin-bottom: 40px">
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
    <el-tooltip
      class="item"
      effect="dark"
      content="管理"
      v-if="admin === 1"
      placement="top-start"
    >
      <el-button
        icon="el-icon-setting"
        style="float:right; position: absolute; top: 20px; right: 80px"
        circle
        @click="gotoAdmin"
      ></el-button>
    </el-tooltip>
    <div class="flex-box">
      <div class="flex-item">
        <el-container>
          <el-main>
            <el-form
              ref="searchForm"
              :model="searchForm"
              label-width="100px"
              :rules="rules"
            >
              <el-form-item label="地区" prop="inputRegion">
                <el-select v-model="searchForm.inputRegion" placeholder="选择地区" 
                  :disabled="disableSearch"
                  id="region"
                >
                  <el-option
                    v-for="(item, index) in regions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日期" prop="inputDate">
                <el-date-picker
                  v-model="searchForm.inputDate"
                  type="date"
                  :disabled="disableSearch"
                  placeholder="选择日期"
                  clearable
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </div>
    </div>

    <!-- 按钮组合 -->
    <!-- <el-button
      type="primary"
      @click="onSearch"
    > 查询 </el-button>
    <el-button
      type="default"
      @click="onReturn"
    > 解锁 </el-button> -->
    
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
          <el-table-column property="locName" label="地区" width="100">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit">
                <el-cascader
                  :props="subRegions"
                  v-model = "scope.row.locId"
                  @change="onChangeRegion(scope.row)"
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
                <el-input type="textarea" 
                  v-model="scope.row.countSourceText" 
                  placeholder=""
                  style="font-size: xx-small"
                >
                </el-input>
              </el-form-item>
              <span v-else style="font-size: xx-small">{{scope.row.countSourceText}}</span>
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
                <el-input type="textarea" 
                  v-model="scope.row.countSourceUrl" 
                  placeholder=""
                  style="font-size: xx-small"
                >
                </el-input>
              </el-form-item>
              <span v-else style="font-size: xx-small">{{scope.row.countSourceUrl}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
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
                <el-button type="danger" size="mini" @click="onDelCount(scope.row)">
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
          <el-table-column property="locName" label="地区" width="100">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit">
                <el-cascader
                  :props="subRegions"
                  v-model = "scope.row.locId"
                  @change="onChangeRegion(scope.row)"
                ></el-cascader>
              </el-form-item>
              <span v-else>{{scope.row.locName}}</span>
            </template>
          </el-table-column>
          <el-table-column property="sampleAge" label="年龄" width="100">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'patData.' + scope.$index + '.sampleAge'"
              >
                <el-input v-model="scope.row.sampleAge" placeholder=""></el-input>
              </el-form-item>
              <span v-else>{{scope.row.sampleAge}}</span>
            </template>
          </el-table-column>
          <el-table-column property="sampleSex" label="性别" width="100">
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
          <el-table-column property="sampleSex" label="性别" width="100">
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
                <el-input type="textarea" 
                  v-model="scope.row.sampleSourceText" 
                  placeholder=""
                  style="font-size: xx-small"
                >
                </el-input>
              </el-form-item>
              <span v-else style="font-size: xx-small">{{scope.row.sampleSourceText}}</span>
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
                <el-input type="textarea" 
                  v-model="scope.row.sampleSourceUrl" 
                  placeholder=""
                  style="font-size: xx-small"
                >
                </el-input>
              </el-form-item>
              <span v-else style="font-size: xx-small">{{scope.row.sampleSourceUrl}}</span>
            </template>
          </el-table-column>
          <el-table-column property="sampleCustomTag" label="自定义标签" width="100">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.edit" 
                :prop="'patData.' + scope.$index + '.sampleCustomTag'" 
              >
                <el-tag
                  v-for="tag in scope.row.sampleCustomTag"
                  :key="tag.key"
                  @close="onDelPatTag(scope.row, tag)"
                  size="small"
                  closable
                >
                  {{tag.key}}:{{tag.value}}
                </el-tag>
                <el-button class="button-new-tag" size="small" 
                  @click="scope.row.dialogVisible=true"
                >+ New Tag</el-button>
              </el-form-item>
              <span v-else>
                <span v-if="scope.row.sampleCustomTag.length > 0">
                  <el-tag
                    v-for="tag in scope.row.sampleCustomTag"
                    :key="tag.key"
                    size="small"
                  >
                    {{tag.key}}:{{tag.value}}
                  </el-tag>
                </span>
              </span>
              <el-dialog
                title="New Tag"
                :visible.sync="scope.row.dialogVisible"
                v-on:close="onCloseTagDialog(scope.row)"
                width="30%"
              >
                <el-form-item 
                  :prop="'patData.' + scope.$index + '.newTag.key'"
                >
                  <el-input v-model="scope.row.newTag.key"
                    placeholder="标签名"
                  ></el-input>
                </el-form-item>
                <el-form-item 
                  :prop="'patData.' + scope.$index + '.newTag.key'"
                  style="margin-top: 20px!important"
                >
                  <el-input v-model="scope.row.newTag.value"
                    placeholder="标签值"
                  ></el-input>
                </el-form-item>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="onCancelPatTag(scope.row)" style="margin-right: 10px">取 消</el-button>
                  <el-button type="primary" @click="onAddPatTag(scope.row)">确 定</el-button>
                </span>
              </el-dialog>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
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
                <el-button type="danger" size="mini" @click="onDelPat(scope.row)">
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
// import qs from "query-string";
import { 
  getNextLoc,
  getCount, 
  getCase,
  insertCount,
  insertCases,
  modifyCount,
  modifyCase,
  deleteCase,
  deleteCount,
  deepCopyArr
} from "@/util/util.js";

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
      admin: 0,
      isFormPatAlive: true, // 用于强制刷新
      isFormAlive: true,
      disabledBtn: false,
      readValue: "", // 用于解决selcet框回显value的bug
      closeMsg: false, // 用于关掉删除统计信息后的无查询结果
      disableSearch: false, // todo 删掉
      dialogVisible: false,

      form: {
        countData: [],
        oldCountData: []
      },
      searchForm: {
        inputDate: "",
        inputRegion: "",
      },
      searchParam: {
        locId: "",
        date: "",
      },
      formPat: {
        patData: [],
        oldPatData: []
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
      regions: [],
      regionDicts: {},
      subRegions: {
        lazy: true,
        checkStrictly: true,
        expandTrigger: 'hover',
        lazyLoad(node, resolve) {
          if(!window.vue.$data.searchParam.date || !window.vue.$data.searchParam.locId) {
            this.$message.warning("请填入时间和地区")
            return false
          }
          var { level } = node;
          var locId = window.vue.$data.searchParam.locId // this获取不到，只能 hack写法
          // eslint-disable-next-line no-undef
          getNextLoc({
            locId:
              level == 0
                ? locId
                : node.data.value,
          }).then(res => {
            var nodes = [];
            res.data.forEach(item => {
              nodes.push({
                value: item.id,
                label: item.name
              });
              window.vue.$data.regionDicts[item.id] = item.name
            });
            // window.vue.$data.disableSearch = true
            resolve(nodes);
          });
        }
      },
    };
  },
  methods: {
    // 注：仅用于判断输入值是否符合
    isEmpty(value) {
      if ((!value || (Array.isArray(value) && value.length === 0)) && value !== 0) { // value == 0 也不是 empty
        return true;
      } else {
        return false;
      }
    },
    clearData() {
      this.form.countData = []
      this.formPat.patData = [];
      // this.searchParam = {}
    },
    getAll() {
      this.getCount()
      this.getPat()
    },
    getCount() {
      getCount(this.searchParam).then(res => {
        if (res.status === 0) {
          if(res.data.length == 0) {
            this.$message.success("无统计信息")
          }
          // 清空再逐个赋值，可以省去强制刷新
          this.form.countData = []
          for(var i = 0; i < res.data.length; i++) {
            this.form.countData.push({
              id: res.data[i].id,
              countConfirm: res.data[i].countConfirm,
              countRecover: res.data[i].countRecover,
              countDead: res.data[i].countDead,
              countSourceText: res.data[i].countSourceText,
              countSourceUrl: res.data[i].countSourceUrl,
              locName: res.data[i].locName.split('-').slice(2).join(' / '),
              edit: false
            })
          }
          // this.disableSearch = true
          this.form.oldCountData = deepCopyArr(this.form.countData)
          // this.reloadPat()
        } else {
          this.$message.error(res.desc);
        }
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
    getPat() {
      getCase(this.searchParam).then(res => {
        if(res.status === 0) {
          this.formPat.patData = []
          for(var i = 0; i < res.data.length; i++) {
            this.formPat.patData.push({
              id: res.data[i].id,
              sampleSex: res.data[i].sampleSex,
              sampleAge: res.data[i].sampleAge,
              sampleConfirmTime: res.data[i].sampleConfirmTime,
              sampleSourceText: res.data[i].sampleSourceText,
              sampleSourceUrl: res.data[i].sampleSourceUrl,
              sampleCustomTag: res.data[i].sampleCustomTag,
              locName: res.data[i].locName.split('-').slice(2).join(' / '),
              edit: false,
              dialogVisible: false,
              newTag: {
                key: "",
                value: ""
              }
            })
          }
          // this.disableSearch = true
          this.formPat.oldPatData = deepCopyArr(this.formPat.patData)
          // this.reloadPat()
        } else {
          this.$message.error(res.desc);
        }
      })
    },
    onSearch() {
      this.searchParam.locId = Number(this.searchForm.inputRegion);
      this.searchParam.date = new Date(this.searchForm.inputDate).Format("yyyy-MM-dd")
      if(this.checkSearchParam()) {
        this.getAll()
      }
    },
    onReturn() {
      this.clearData()
      // this.disableSearch = false
    },

    onAddCount() {
      if(!this.checkSearchParam()) {
        return false
      }
      var last_count = this.form.countData[this.form.countData.length - 1]
      this.form.countData.push({
        edit: true,
        id: "",
        countConfirm: last_count ? last_count.countConfirm : "",
        countRecover: last_count ? last_count.countRecover : "0",
        countDead: last_count ? last_count.countDead : "0",
        countSourceText: last_count ? last_count.countSourceText : "",
        countSourceUrl: last_count ? last_count.countSourceUrl : "",
        locName: ""
      })
    },
    onEditCount(row) {
      row.edit = true
      row.locId = []
      // this.reloadCount()
    },
    onCancelCount(row, index) {
      if(!row.id) {
        this.form.countData.splice(index, 1);
      } else {
        // 不能直接赋值，以防干掉vue的对象跟踪
        row.countConfirm = this.form.oldCountData[index].countConfirm
        row.countRecover = this.form.oldCountData[index].countRecover
        row.countDead = this.form.oldCountData[index].countDead
        row.countSourceText = this.form.oldCountData[index].countSourceText
        row.countSourceUrl = this.form.oldCountData[index].countSourceUrl
        row.locName = this.form.oldCountData[index].locName
        row.edit = false
        // this.getCount()
      }
    },
    onSaveCount(row) {
      if(!this.checkSearchParam() || !this.checkCount(row)) {
        return false
      }
      var count = {
        countRegionId: row.locId[row.locId.length - 1],
        countDate: new Date(this.searchParam.date).Format("yyyy-MM-dd"),
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
            // this.getCount()
            this.form.oldCountData = deepCopyArr(this.form.countData)
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
            // this.getCount()
            this.form.oldCountData = deepCopyArr(this.form.countData)
          } else {
            this.$message.error(res.desc)
          }
        })
      }
    },
    onSaveAllCounts() {
      if(this.checkSearchParam()) {
        var forSaved = this.form.countData.filter(count => {
          return count.edit
        })
        // 先检查所有的填空是否有效，再逐个保存
        if(forSaved.every(this.checkCount)) {
          forSaved.forEach((item) => {
            this.onSaveCount(item)
          })
        }
      }
    },
    onDelCount(row) {
      this.$confirm("将同时删除对应的所有病例，确认删除统计？")
        .then(() => {
          deleteCount(row.id).then((res) => {
            if(res.status == 0) {
              this.$message.success("删除统计成功");
              this.closeMsg = true
              this.getAll()
            } else {
              this.$message.error(res.desc)
            }
          })
        }).catch(() => {});
    },
    onChangeRegion(row) {
      var names = []
      row.locId.forEach(id => {
        names.push(this.regionDicts[id])
      })
      row.locName = names.join(' / ')
    },

    // 添加/确认/编辑/删除 表单里的病例栏
    onAddPat() {
      if(!this.checkSearchParam()) {
        return false
      }
      var last_pat = this.formPat.patData[this.formPat.patData.length - 1]
      this.formPat.patData.push({
        edit: true,
        dialogVisible: false,
        id: "",
        sampleSex: last_pat ? last_pat.sampleSex : "",
        sampleAge: last_pat ? last_pat.sampleAge : "",
        sampleConfirmTime: last_pat ? last_pat.sampleConfirmTime : "",
        sampleSourceText: last_pat ? last_pat.sampleSourceText : "",
        sampleSourceUrl: last_pat ? last_pat.sampleSourceUrl : "",
        sampleCustomTag: [],
        locName: "",
        newTag: {
          key: "",
          value: ""
        }
      })
      var newPat = this.formPat.patData[this.formPat.patData.length - 1]
      this.readValue = newPat.sampleSex
      newPat.sampleSex = String(this.readValue)
    },
    onSavePat(row) {
      if(!this.checkSearchParam() || !this.checkPat(row)) {
        return false
      }
      var pat = {
        sampleRegionId: row.locId[row.locId.length - 1],
        sampleSex: row.sampleSex,
        sampleAge: row.sampleAge,
        sampleDate: new Date().Format(
          "yyyy-MM-dd"
        ), // 录入的时间
        sampleConfirmTime: new Date(this.searchParam.date).Format(
          "yyyy-MM-dd"
        ),
        sampleSourceUrl: row.sampleSourceUrl,
        sampleSourceText: row.sampleSourceText,
        sampleCustomTag: row.sampleCustomTag,
      }
      if(!row.id) {
        insertCases(pat).then((res) => {
          if(res.status === 0) {
            this.$message.success("保存病例成功");
            row.edit = false;
            // this.getPat()
            this.formPat.oldPatData = deepCopyArr(this.formPat.patData)
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
            // this.getPat()
            this.formPat.oldPatData = deepCopyArr(this.formPat.patData)
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
        row.sampleSex = this.formPat.oldPatData[index].sampleSex
        row.sampleAge = this.formPat.oldPatData[index].sampleAge
        row.sampleConfirmTime = this.formPat.oldPatData[index].sampleConfirmTime
        row.sampleSourceText = this.formPat.oldPatData[index].sampleSourceText
        row.sampleSourceUrl = this.formPat.oldPatData[index].sampleSourceUrl
        row.sampleCustomTag = this.formPat.oldPatData[index].sampleCustomTag
        row.locName = this.formPat.oldPatData[index].locName
        row.edit = false
        // this.getPat()
      }
    },
    onEditPat(row) {
      row.edit = true
      row.locId = []
      // this.reloadPat()
    },
    onDelPat(row) {
      this.$confirm("确认删除病例？")
        .then(() => {
          deleteCase(row.id).then((res) => {
            if(res.status == 0) {
              this.$message.success("删除病例成功");
              this.getPat()
            } else {
              this.$message.error(res.desc)
            }
          })
        }).catch(() => {});
    },
    onSaveAllPats() {
      if(this.checkSearchParam()) {
        var forSaved = this.formPat.patData.filter(pat => {
          return pat.edit
        })
        // 先检查所有的填空是否有效，再逐个保存
        if(forSaved.every(this.checkPat)) {
          forSaved.forEach((item) => {
            this.onSavePat(item)
          })
        }
      }
    },
    onAddPatTag(row) {
      if(row.newTag.key.length > 10 || row.newTag.value.length > 10) {
        this.$message.warning("标签各栏的输入不能超过10个单位长度")
        return false;
      }
      if(row.newTag.key.length === 0 || row.newTag.value.length === 0) {
        this.$message.warning("标签各栏的输入不能为空")
        return false;
      }
      row.sampleCustomTag.push(row.newTag);
      row.newTag = {
        key: "",
        value: ""
      }
      row.dialogVisible = false
      // this.reloadPat()
    },
    onDelPatTag(row, tag) {
      row.sampleCustomTag.splice(
        row.sampleCustomTag.indexOf(tag),
        1
      )
      // this.reloadPat()
    },
    onCancelPatTag(row) {
      row.dialogVisible = false
    },
    onCloseTagDialog(row) {
      row.newTag = {
        key: "",
        value: ""
      }
    },

    checkSearchParam(warning = true) {
      var param = this.searchParam
      if(!param.locId || !param.date || param.date === "1970-01-01" || param.date === "NaN-aN-aN") {
        if(warning) {
          this.$message.warning("请填入时间和地区")
        }
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

    gotoAdmin() {
      this.$router.push({
        path: "/admin"
      });
    },
    logout() {
      // eslint-disable-next-line no-useless-escape
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (var i = keys.length; i--; )
          document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
      }
      // localStorage.removeItem("regionIds");
      this.$store.commit('logout')
      this.$router.push({ name: "login" });
    },
  },
  watch: {
    searchForm: {
      handler: function() {
        this.searchParam.locId = Number(this.searchForm.inputRegion);
        this.searchParam.date = new Date(this.searchForm.inputDate).Format("yyyy-MM-dd")
        var disableWarning = false
        if(this.checkSearchParam(disableWarning)) {
          this.clearData()
          this.onSearch()
        }
      },
      deep: true
    },
    // form: {
    //   handler: function() {
    //     if(
    //       this.formPat.patData.length === 0 &&
    //       this.form.countData.length === 0
    //     ) {
    //       this.disableSearch = false
    //     }
    //   },
    //   deep: true
    // },
    // formPat: {
    //   handler: function() {
    //     if(
    //       this.formPat.patData.length === 0 &&
    //       this.form.countData.length === 0
    //     ) {
    //       this.disableSearch = false
    //     }
    //   },
    //   deep: true
    // },
  },
  mounted() {
    // 查询框地址项
    // var regionIds = localStorage.getItem("regionIds").split(',')
    this.admin = this.$store.state.admin || 0;
    this.$store.state.regions.forEach(region => {
      this.regions.push({
        label: region.name,
        value: region.id
      })
    });

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
#formData >>> .el-button+.el-button {
  margin-top: 10px;
  margin-left: 0px;
}
#nowData >>> .el-form-item {
  margin: 0px!important;
}
#nowData >>> .el-form-item__content {
  margin: 0px!important;
}
#nowData >>> .el-button+.el-button {
  margin-top: 10px;
  margin-left: 0px;
}
#nowData >>> .el-tag {
  height: auto;
  width: auto;
  max-width: 100px;
  white-space: normal;
}
</style>
