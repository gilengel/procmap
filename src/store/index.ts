import { store } from 'quasar/wrappers'
import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';
import { PreviewStateInterface } from './preview/state'

import preview from './preview'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  preview: PreviewStateInterface;
}

// Use a new variable and export values to change default behaviour.
let store = null

Vue.use(Vuex)

// .. other code

export default function () {
  const Store = new Vuex.Store({
    namespaced: true,
    name: 'global',
    state: {
      previewNode: undefined
    },

    getters: {
      previewNode: state => { return state.previewNode }
    },

    mutations: {
      update (state: PreviewStateInterface, node: Node) {
        state.previewNode = node
      }
    },

    actions: {
      updatePreview ({ commit }, node: unknown) {
        commit('update', node)
      }
    }
    // mutations / getters / plugins/ other code
  })

  // add this so that we export store
  store = Store

  // Quasar default
  return Store
}

// add this line to access store wherever you need
export { store }

/*
export default store(function ({ Vue }) {
  Vue.use(Vuex)

  const Store = new Vuex.Store<StateInterface>({
    modules: {
      preview
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  })

  return Store
})
*/
