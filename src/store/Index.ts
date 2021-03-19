import Vue from 'vue'
import Vuex from 'vuex'

let store: unknown = null

Vue.use(Vuex)

export default function () {
    const Store = new Vuex.Store({

      state: {
      },

      getters: {
      },

      mutations: {
      },

      actions: {

      }
      // mutations / getters / plugins/ other code
    })

    // add this so that we export store
    store = Store

    // Quasar default
    return Store
  }

export { store }
