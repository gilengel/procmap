import Vue from 'vue'
import Vuex from 'vuex'

import { Node as ReteNode } from 'rete'

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

interface PreviewStateInterface {
  previewNode: ReteNode,
  render: boolean,

  system: JSON,
  systemImported: boolean
}
export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  preview: PreviewStateInterface;
}

// Use a new variable and export values to change default behaviour.
let store: unknown = null

Vue.use(Vuex)

// .. other code

export default function () {
  const Store = new Vuex.Store({
    namespaced: true,
    name: 'global',
    state: {
      previewNode: undefined,
      render: false,
      system: {},
      systemImported: false
    },

    getters: {
      render: state => state.render,
      previewNode: state => state.previewNode, // state.previewNode }
      system: state => state.system,
      systemImported: state => state.systemImported
    },

    mutations: {

      update (state: PreviewStateInterface, node: ReteNode) {
        if (state.previewNode !== undefined) {
          state.previewNode.data.preview = false
        }

        state.previewNode = node
        state.previewNode.data.preview = true
      },

      saveSystem (state: PreviewStateInterface, arg: { system: JSON, imported: boolean }) {
        state.system = arg.system
        state.systemImported = arg.imported
      },

      resetSystemImported (state: PreviewStateInterface) {
        state.systemImported = false
      },

      render (state: PreviewStateInterface, render: boolean) {
        state.render = render
      }
    },

    actions: {
      updatePreview ({ commit }, node: ReteNode) {
        commit('update', node)
      },

      render ({ commit }, render: boolean) {
        commit('render', render)
      },

      saveSystem ({ commit }, arg: { system: JSON, imported: boolean }) {
        commit('saveSystem', { system: arg.system, imported: arg.imported === undefined ? false : arg.imported })
      },

      resetSystemImported ({ commit }) {
        commit('resetSystemImported')
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
