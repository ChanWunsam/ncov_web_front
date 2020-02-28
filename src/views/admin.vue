<template>
  <el-container>
    <el-header>
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
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="24"></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"></el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="6">
          <span></span>
        </el-col>
        <el-col :span="12">
          <el-cascader 
            :props="lazyRegions"
          ></el-cascader>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { 
  getNextLoc,
  // getCount, 
  // getCase,
  // insertCount,
  // insertCases,
  // modifyCount,
  // modifyCase,
  // deleteCase,
  // deleteCount
} from "@/util/util.js";
export default {
  name: "admin",
  components: {},
  data() {
    return {
      lazyRegions: {
        lazy: true,
        checkStrictly: true,
        expandTrigger: 'hover',
        lazyLoad(node, resolve) {
          // var { level } = node;
          getNextLoc({
            locId: 0
          }).then(res => {
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
    }
  },
  methods() {

  },
  watch() {

  },
  mounted() {

  }
}
</script>

<style scoped>
  
</style>