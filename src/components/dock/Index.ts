import { MetaFlowCategory } from './../flow/Index';

import { Node, NodeEditor } from 'rete'

import { findRegisteredComponentById } from '../flow/Index'

import { createNode } from './Utils'

import EventBus, {
  FLOW_GRAPH_MANUALLY_CHANGED,
} from "../../EventBus";

let registeredComponents: Array<MetaFlowCategory> = [];

function install(editor: NodeEditor, nodes: Array<MetaFlowCategory>) {
    registeredComponents = nodes;

    editor.view.container.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault()
    })
    editor.view.container.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault()
    if (!e.dataTransfer) return

    const id = e.dataTransfer.getData('componentId')

    const component = findRegisteredComponentById(id, registeredComponents)
    if (!component) throw new Error(`Component ${id} not found`)

    // force update the mouse position
    editor.view.area.pointermove(e as unknown as PointerEvent)

    const defaultData = component.defaultData ? component.defaultData : {}

    createNode(component.component, editor.view.area.mouse, defaultData).then((node: Node) => {
      editor.addNode(node)

      EventBus.$emit(FLOW_GRAPH_MANUALLY_CHANGED, editor.toJSON());
    }).catch(e => {
      console.error(e)
    })

  })
}

export default {
  name: 'dock',
  install
}
