<template>
  <div>
    <div class="login-wrapper">
      <div id="login">
        <p class="title">登录</p>
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
              v-model="ruleForm2.pass"
              type="password"
              auto-complete="off"
              placeholder="输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm2')"
              style="width:100%;"
              >登录</el-button
            >
            <p class="login" @click="gotoRegister">没有账号？立即注册</p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import qs from "query-string";
import {
  login,
  deepCopyArr
} from "@/util/util.js";

export default {
  name: "login",
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
    // <!--验证密码-->
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        // if (this.ruleForm2.checkPass !== "") {
        //   this.$refs.ruleForm2.validateField("checkPass");
        // }
        callback();
      }
    };
    return {
      ruleForm2: {
        pass: "",
        tel: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "change" }],
        tel: [{ validator: checkTel, trigger: "change" }]
      },
      buttonText: "发送验证码",
      isDisabled: false, // 是否禁止点击发送验证码按钮
      flag: true
    };
  },
  methods: {
    // <!--提交登录-->
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var param = {
            phone: this.ruleForm2.tel,
            password: this.ruleForm2.pass
          }
          login(param).then(res => {
            if (res.status === 0) {
              var homeParam = {
                regions: res.data[0].region_info,
                phone: this.ruleForm2.tel,
                token: res.data[0].token,
                admin: res.data[0].admin
              }
              this.gotoHome(homeParam)
            }
          })
        } else {
          return false;
        }
      });
    },
    gotoHome(param) {
      // localStorage.setItem("regionIds", param.regionIds)
      localStorage.setItem("phone", param.phone);
      document.cookie = "token=" + escape(param.token)
      this.$store.commit({
        type: "login",
        admin: param.admin,
        regions: param.regions
      })
      this.$router.push({
        name: "home"
      });
    },
    gotoRegister() {
      this.$router.push({
        path: "/register"
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
.login-wrapper img {
  position: absolute;
  z-index: 1;
}
.login-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
#login {
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
.code >>> .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.code button {
  margin-left: 20px;
  width: 140px;
  text-align: center;
}
.el-button--primary:focus {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
</style>
