
import { Node, NodeEditor } from 'rete'

import { getRegisteredFlowComponents } from '../flow'

import { createNode } from './Utils'

function install (editor: NodeEditor) {
  editor.view.container.addEventListener('dragover', e => e.preventDefault())
  editor.view.container.addEventListener('drop', (e: DragEvent) => {
    if (!e.dataTransfer) return

    const id = e.dataTransfer.getData('componentId')
    const component = getRegisteredFlowComponents().find(component => component.id === id)

    if (!component) throw new Error(`Component ${id} not found`)

    // force update the mouse position
    editor.view.area.pointermove(e as any)

    createNode(component.component, editor.view.area.mouse).then((node : Node) => {
      editor.addNode(node)
    }).catch(e => {
      console.error(e)
    })
  })
}

export default {
  name: 'dock',
  install
}
