import { store } from 'quasar/wrappers'
import Vue from 'vue'
import Vuex from 'vuex'

import { Node as ReteNode } from 'rete'

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

import preview from './preview'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

interface PreviewStateInterface {
  previewNode: ReteNode
}
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
      previewNode: undefined,
      count: 0
    },

    getters: {
      count: state => { console.log(state); return state.count },
      previewNode: state => state.previewNode // state.previewNode }
    },

    mutations: {
      increment (state) {
        state.count++
      },

      update (state: PreviewStateInterface, node: ReteNode) {
        if (state.previewNode !== undefined) {
          state.previewNode.data.preview = false
        }

        state.previewNode = node
        state.previewNode.data.preview = true
      }
    },

    actions: {
      updatePreview ({ commit }, node: ReteNode) {
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
