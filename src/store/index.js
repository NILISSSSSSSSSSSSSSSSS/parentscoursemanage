import Vue from 'vue'
import Vuex from 'vuex'
import {Message} from 'element-ui'
import imInfo from './modules/imInfo'
import createPersistedState from "vuex-persistedstate"  //vuex持久化插件

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    imInfo
  },
  plugins: [createPersistedState()]
})
