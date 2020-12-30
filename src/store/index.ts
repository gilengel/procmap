import Vue from 'vue'
import Vuex from 'vuex'

import { Node as ReteNode } from 'rete'

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

import MessageModule from './messages'
import { Data } from 'rete/types/core/data'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

interface PreviewStateInterface {
  previewNode: ReteNode | undefined,
  render: boolean,
  system: Data | undefined,
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
    modules: {
      MessageModule
    },

    state: {
      previewNode: undefined,
      render: false,
      system: undefined,
      systemImported: false
    },

    getters: {
      render: state => state.render,
      previewNode: (state: PreviewStateInterface): ReteNode | undefined => state.previewNode,
      system: (state: PreviewStateInterface): Data | undefined => state.system,
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

      saveSystem (state: PreviewStateInterface, arg: { system: Data, imported: boolean }) {
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
