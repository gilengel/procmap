/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import './Filters'
import Node from '../Node.vue'
import Socket from '../Socket.vue'
import Vue from 'vue'
import mixin from './Mixin'

interface VueElement {
  component: unknown
  props: Record<string, unknown>
  vueContext: Node
  render: string
}

import { NodeEditor, Node as ReteNode, Control } from 'rete'

function createVue (el: HTMLElement, vueComponent: string | Record<string, unknown>, vueProps = {}, options = {}) : Vue {
  const app = new Vue({
    render: h => h(vueComponent, { props: vueProps }),
    ...options
  })

  const nodeEl = document.createElement('div')

  el.appendChild(nodeEl)
  app.$mount(nodeEl)

  return app
}

function createNode (editor: NodeEditor, CommonVueComponent: CommonVueComponent, { el, node, component, bindSocket, bindControl }: { el: HTMLElement; node: ReteNode; component: VueElement; bindSocket: Function; bindControl: Function }, options: Record<string, unknown> | undefined) : Vue {
  const vueComponent = component.component || CommonVueComponent || Node
  const vueProps = { ...component.props, node, editor, bindSocket, bindControl }
  const app = createVue(el, vueComponent, vueProps, options)

  node.vueContext = app.$children[0]

  return app
}

function createControl (editor: NodeEditor, { el, control } : { el: HTMLElement, control: VueElement}, options: Record<string, unknown>) : VueControl {
  const vueComponent = control.component
  const vueProps = { ...control.props, getData: control.getData.bind(control), putData: control.putData.bind(control) }
  const app = createVue(el, vueComponent, vueProps, options)

  control.vueContext = app.$children[0]

  return app
}

interface VueNode extends ReteNode {
  vueContext: Vue
}

const update = (entity: VueNode) => {
  return new Promise((resolve) => {
    if (!entity.vueContext) return resolve(null)

    entity.vueContext.$forceUpdate()
    entity.vueContext.$nextTick(resolve)
  })
}

const listeners = new WeakMap()

interface CommonVueComponent {
    render: string
}

interface VueNode extends ReteNode {
  _vue: Vue
}

interface VueControl extends Control {
  _vue: Vue
}

interface Params {
  component: CommonVueComponent
  options: Record<string, unknown>
}

function install (editor: NodeEditor, params : Params) {
  editor.on('rendernode', ({ el, node, component, bindSocket, bindControl }) => {
    if (!listeners.has(el)) {
      listeners.set(el, true)
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation()
        console.log(e)
        // editor.trigger('resetconnection')
      })
    }

    if ((component as VueElement).render && (component as VueElement).render !== 'vue') return
    (node as VueNode)._vue = createNode(editor, params.component, { el, node, component, bindSocket, bindControl }, params.options)
    node.update = async () => await update(node as VueNode)
  })

  editor.on(['rendercontrol'], ({ el, control }) => {
    if (control.render && control.render !== 'vue') return
    control._vue = createControl(editor, { el, control }, params.options)
    control.update = async () => await update(control)
  })

  editor.on(['connectioncreated', 'connectionremoved'], connection => {
    update(connection.output.node)
    update(connection.input.node)
  })

  editor.on('nodeselected', () => {
    editor.nodes.map(update)
  })
}

export default {
  name: 'vue-render',
  install,
  mixin,
  Node,
  Socket
}
