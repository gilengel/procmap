import Vue from 'vue'
import Vuex from 'vuex'
import Model from './Model'
import Page from './Page'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

let store: unknown = null

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    modules: {
      Model,
      Page
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING
  })

  // add this so that we export store
  store = Store

  // Quasar default
  return Store
}

// add this line to access store wherever you need
export { store }
