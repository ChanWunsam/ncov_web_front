import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    admin: 0,
    regions: []
  },
  mutations: {
    login(state, data) {
      state.admin = data.admin
      state.regions = data.regions
    },
    logout(state) {
      state.admin = 0
      state.regions = []
    }
  },
  actions: {
  },
  modules: {
  }
})

export default store