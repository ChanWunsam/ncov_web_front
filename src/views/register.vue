<template>
  <div>
    <div class="register-wrapper">
      <div id="register">
        <p class="title">注册</p>
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="tel">
            <el-input
              v-model="ruleForm2.tel"
              auto-complete="off"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input
              type="password"
              v-model="ruleForm2.pass"
              auto-complete="off"
              placeholder="输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm2.checkPass"
              auto-complete="off"
              placeholder="确认密码"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item prop="region" class="code">
            <el-select v-model="ruleForm2.region" placeholder="请选择地区">
              <el-option
                v-for="(item, index) in regions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm2')"
              style="width:100%;"
              >注册</el-button
            >
            <p class="login" @click="gotoLogin">已有账号？立即登录</p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "query-string";
import { 
  register,
  login,
  getNextLoc,
} from "@/util/util.js";
import gotoHome from '../views/login.vue';

export default {
  name: "Register",
  data() {
    // <!--验证手机号是否合法-->
    let checkTel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else if (!this.checkMobile(value)) {
        callback(new Error("手机号码不合法"));
      } else {
        callback();
      }
    };
    //  <!--验证码是否为空-->
    let checkRegion = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择地区"));
      } else {
        callback();
      }
    };
    // <!--验证密码-->
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    // <!--二次验证密码-->
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        pass: "",
        checkPass: "",
        tel: "",
        region: ""
      },
      regions: [
        {
          label: "北京",
          value: 1
        }
      ],
      rules2: {
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }],
        tel: [{ validator: checkTel, trigger: "change" }],
        region: [{ validator: checkRegion, trigger: "change" }]
      },
      buttonText: "发送验证码",
      isDisabled: false, // 是否禁止点击发送验证码按钮
      flag: true
    };
  },
  methods: {
    // <!--提交注册-->
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var param = {
            phone: this.ruleForm2.tel,
            password: this.ruleForm2.pass,
            // regionId: [this.ruleForm2.region],
          }
          register(param).then(res => {
            if (res.status === 0) {
              // this.$message.success("注册成功")
              login(param).then(res => {
                if (res.status === 0) {
                  var homeParam = {
                    regionIds: res.data[0].region_id,
                    phone: this.ruleForm2.tel,
                    token: res.data[0].token
                  }
                  this.gotoHome(homeParam)
                }
              })
            }
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    gotoHome(param) {
      localStorage.setItem("regionIds", param.regionIds);
      localStorage.setItem("phone", param.phone);
      document.cookie = "token=" + escape(param.token)
      this.$router.push({
        path: "/"
      });
    },
    // <!--进入登录页-->
    gotoLogin() {
      this.$router.push({
        path: "/login"
      });
    },
    // 验证手机号
    checkMobile(str) {
      let re = /^1\d{10}$/;
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    // getNextLoc({
    //   locId: 0
    // }).then(res => {
    //   if(res) {
    //     res.data.forEach(i => {
    //       this.regions.push({
    //         label: i.name,
    //         value: i.id
    //       });
    //     });
    //   }
    // })
  }
};
</script>

<style scoped>
.loading-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #aedff8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-wrapper img {
  position: absolute;
  z-index: 1;
}
.register-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
#register {
  max-width: 340px;
  margin: 60px auto;
  background: #fff;
  padding: 20px 40px;
  border-radius: 10px;
  position: relative;
  z-index: 9;
}
.title {
  font-size: 26px;
  line-height: 50px;
  font-weight: bold;
  margin: 10px;
  text-align: center;
}
.el-form-item {
  text-align: center;
}
.login {
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #1ab2ff;
  cursor: pointer;
  text-align: left;
  text-indent: 8px;
  width: 160px;
}
.login:hover {
  color: #2c2fd6;
}
/* .code >>> .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
} */
/* .code button {
  margin-left: 20px;
  width: 140px;
  text-align: center;
} */
.el-select {
  width: 100%;
}
.el-button--primary:focus {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
</style>
