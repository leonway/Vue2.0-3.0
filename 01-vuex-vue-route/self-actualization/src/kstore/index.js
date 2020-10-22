import Vue from 'vue'
import Vuex from './kvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    counter:1
  },
  mutations:{
    add(state){
      // console.log(state)
      state.counter++
    }
  },
  actions:{
    add(data){
      const {commit} = data;
      // console.log(commit);
      setTimeout(() => {
       commit('add') 
      }, 1000);
    }
  },
  getters: {
    doubleCounter(state) { // 计算剩余数量
    return state.counter * 2;
    }
  }
})
