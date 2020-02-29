<template>
  <el-container>
    <el-tooltip
      class="item"
      effect="dark"
      content="返回"
      placement="top-start"
    >
      <el-button
        icon="el-icon-refresh-left"
        style="float:right; position: absolute; top: 20px; right: 20px"
        circle
        @click="gotoHome"
      ></el-button>
    </el-tooltip>
    <el-main>
      <el-tabs type="card" style="width: 800px; margin: auto">
        <el-tab-pane label="用户权限">
          <el-container>
            <el-main>
              <el-row :gutter="10" type="flex" justify="center" align="middle">
                <el-col :span="10">
                  <el-input v-model="phone" placeholder="输入手机号"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-button type="info" @click="onSearchUser(phone)">查询</el-button>
                  <el-button type="success" v-show="showInfo" @click="onUpdateUser(phone, curCities)">保存</el-button>
                </el-col>
              </el-row>
              <el-container v-show="showInfo">
                <el-main id="curCities">
                  <el-row :gutter="1" type="flex" justify="start" style="min-height: 215px; margin-bottom: 20px; flex-flow: wrap; align-content: flex-start;">
                    <el-tag 
                      v-for="city in curCities" :key="city.value"
                      closable
                      @close="onDelUserCity(city)"
                      style="margin: 4px;"
                    >
                      {{ city.label }}
                    </el-tag>
                  </el-row>
                  <el-row :gutter="10" type="flex" justify="center">
                    <el-col :span="9">
                      <el-select v-model="selPro" placeholder="选择省份">
                        <el-option
                          v-for="(item, index) in provinces"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="9">
                      <el-select v-model="selCities" multiple collapse-tags placeholder="选择城市">
                        <el-option 
                          v-for="city in cities" :key="city.value"
                          :label="city.label" :value="city.value"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" @click="onAddUserCity(selCities)">添加</el-button>
                    </el-col>
                  </el-row>
                </el-main>
              </el-container>
            </el-main>
          </el-container>
        </el-tab-pane>
        <el-tab-pane label="地区新增">
          <el-container>
            <el-main>
              <el-row :gutter="10" type="flex" justify="center" align="middle">
                <el-col :span="8">
                  <el-cascader
                    style="width: 100%"
                    v-model="newRegionForm.locIds"
                    :props="allRegions"
                    placeholder="选择上级行政区"
                  ></el-cascader>
                </el-col>
                <el-col :span="5">
                  <el-input v-model="newRegionForm.name" placeholder="输入子地区名"></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" @click="onAddRegion(newRegionForm)">添加</el-button>
                </el-col>
              </el-row>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import { 
  message,
  insertLoc,
  getNextLoc,
  getUserInfo,
  updateUserInfo,
} from "@/util/util.js";

export default {
  name: "admin",
  data() {
    return {
      showInfo: false,
      phone: "",
      curCities: [],
      selPro: "",
      provinces: [],
      selCities: [],
      cities: [],

      newRegionForm: {
        locIds: [],
        name: "",
        partnerId: "",
        level: ""
      },
      allRegions: {
        expandTrigger: 'hover',
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          getNextLoc({
            locId: level === 0 ? 0 : node.data.value
          }).then(res => {
            var nodes = [];
            for(let i = 0; i < res.data.length; i++) {
              var region = res.data[i]
              nodes.push({
                label: region.name,
                value: region.id,
                level: region.level
              });
              window.vue.$data.regionDict[region.id] = region
            }
            resolve(nodes)
          })
        }
      },
      regionDict: {}
    }
  },
  methods: {
    gotoHome() {
      this.$router.push({
        name: 'home'
      })
    },
    onSearchUser(phone) {
      if(!phone) {
        message("warning", "请输入手机号")
        return false
      }
      getUserInfo({
        phone: phone
      }).then(res => {
        this.curCities = []
        var regions = res.data[0].region_info
        if(regions.length === 0) {
          message("info", "无地区权限")
        } else {
          for(var i = 0; i < regions.length; i++) {
            this.curCities.push({
              label: regions[i].name,
              value: regions[i].id
            })
          }
        }
        this.showInfo = true
      })
    },
    onUpdateUser(phone, curCities) {
      if(!phone) {
        message("warning", "请输入手机号")
        return false
      }
      var locIds = curCities.map(city => city.value)
      updateUserInfo({
        phone: phone,
        region_id: locIds
      }).then(() => {
        message("success", "保存成功")
      })
    },
    onAddUserCity(cityIds) {
      for(let i = 0; i < cityIds.length; i++) {
        var name = this.regionDict[cityIds[i]].name
        this.curCities.push({
          label: name,
          value: cityIds[i]
        })
      }
    },
    onDelUserCity(city) {
      this.curCities.splice(
        this.curCities.indexOf(city),
        1
      )
    },
    onAddRegion(newRegionForm) {
      var partnerId = newRegionForm.locIds[newRegionForm.locIds.length - 1]
      var level = this.regionDict[partnerId].level
      insertLoc({
        partnerId: partnerId,
        level: level,
        name: newRegionForm.name
      }).then(() => {
        message("success", "添加子地区成功")
      })
    }
  },
  watch: {
    selPro: {
      handler: function() {
        getNextLoc({
          locId: Number(this.selPro)
        }).then(res => {
          this.selCities = []
          this.cities = []
          var curCityIds = this.curCities.map(item => item.value)
          for(let i = 0; i < res.data.length; i++) {
            this.cities.push({
              value: res.data[i].id,
              label: res.data[i].name
            })
            this.regionDict[res.data[i].id] = res.data[i]
            // 如果存在该标签，就自动选上
            if(curCityIds.includes(res.data[i].id)) {
              this.selCities.push(res.data[i].id)
            }
          }
        })
      },
      deep: true
    }
  },
  mounted() {
    getNextLoc({
      locId: 0
    }).then(res => {
      for(let i = 0; i < res.data.length; i++) {
        this.provinces.push({
          value: res.data[i].id,
          label: res.data[i].name
        })
      }
    });

    window.vue = this
  }
}
</script>

<style scoped>
#curCities {
  min-height: 300px; 
  width: auto; 
  border: 2px solid #DCDFE6; 
  margin: 20px 100px; 
  overflow: hidden;
}
</style>