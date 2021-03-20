import Vue from 'vue'
import Vuex from 'vuex'
import { Store } from 'vuex'
import Layout from './Layout';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

let store: Store<unknown> | undefined;

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    modules: {
      Layout
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING
  })

  store = Store



  return Store
}

export { store }
