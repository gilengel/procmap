/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import './Filters'
import VueNode from '../Node.vue'
import Socket from '../Socket.vue'
import Vue, { Component } from 'vue'
import mixin from './Mixin'

import { NodeEditor, Node as ReteNode, Control } from 'rete'
interface VueElement {
  component: Component
  props: Record<string, unknown>
  vueContext: Vue
  render: string
  _vue: Vue
  update: () => void
}

function createVue (el: HTMLElement, vueComponent: Component, vueProps = {}, options = {}): Vue {
  const app = new Vue({
    render: h => h(vueComponent, { props: vueProps }),
    ...options
  })

  const nodeEl = document.createElement('div')

  el.appendChild(nodeEl)
  app.$mount(nodeEl)

  return app
}

interface VueReteWrapper {
  vueContext: Vue,
  _vue: Vue,
  render: string
}

function createNode (editor: NodeEditor,
  {
    el,
    node,
    component,
    bindSocket,
    bindControl
  }:
    {
      el: HTMLElement,
      node: ReteNode & VueReteWrapper,
      component: VueElement,
      // eslint-disable-next-line @typescript-eslint/ban-types
      bindSocket: Function,
      // eslint-disable-next-line @typescript-eslint/ban-types
      bindControl: Function
    }, options: Record<string, unknown> | undefined): Vue {
  const vueProps = { ...component.props, node, editor, bindSocket, bindControl }
  const app = createVue(el, VueNode, vueProps, options)

  node.vueContext = app.$children[0]

  return app
}

function createControl (editor: NodeEditor, { el, control }: { el: HTMLElement, control: Control & VueElement }, options: Record<string, unknown>) {
  const vueComponent = control.component
  const vueProps = { ...control.props, getData: control.getData.bind(control), putData: control.putData.bind(control) }
  const app = createVue(el, vueComponent, vueProps, options)

  control.vueContext = app.$children[0]

  return app
}

const update = (entity: VueElement) => {
  return new Promise((resolve) => {
    if (!entity.vueContext) return resolve(null)

    entity.vueContext.$forceUpdate()

    entity.vueContext.$nextTick(resolve)
  })
}

// const listeners = new WeakMap()
function install (editor: NodeEditor, options: Record<string, unknown>) {
  editor.on('rendernode', (
    {
      el,
      node,
      component,
      bindSocket,
      bindControl
    }) => {
    /*
    if (!listeners.has(el)) {
      listeners.set(el, true)
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation()
        // editor.trigger('resetconnection')
      })
    }
    */
    const vueComponent = component as VueElement

    if (vueComponent.render && vueComponent.render !== 'vue') return
    const vueNode = node as ReteNode & VueElement
    vueNode._vue = createNode(editor, { el, node: node as ReteNode & VueReteWrapper, component: vueComponent, bindSocket, bindControl }, options)
    vueNode.update = async () => await update(vueNode)
  })

  editor.on(['rendercontrol'], ({ el, control }) => {
    const vueControl = control as Control & VueElement

    if (vueControl.render && vueControl.render !== 'vue') return
    vueControl._vue = createControl(editor, { el, control: vueControl }, options)
    vueControl.update = async () => await update(vueControl)
  })

  editor.on(['connectioncreated', 'connectionremoved'], async connection => {
    await update(connection.output.node as unknown as ReteNode & VueElement)
    await update(connection.input.node as unknown as ReteNode & VueElement)
  })

  editor.on('nodeselected', () => {
    editor.nodes.map(n => update(n as ReteNode & VueElement))
  })
}

export default {
  name: 'vue-render',
  install,
  mixin,
  Node,
  Socket
}
