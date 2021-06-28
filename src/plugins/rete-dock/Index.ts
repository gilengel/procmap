import { MetaFlowComponent } from 'src/models/Flow';

import { Node, NodeEditor } from 'rete'

//import { findRegisteredComponentById } from 'src/components/flow/components/Index'

import { createNode } from './Utils'


function install(editor: NodeEditor, nodes: Map<string, MetaFlowComponent>) {
  editor.view.container.addEventListener('dragover', e => e.preventDefault())
  editor.view.container.addEventListener('drop', (e: DragEvent) => {
    if (!e.dataTransfer) return

    const id = e.dataTransfer.getData('componentId')
    const component = nodes.get(id)



    if (!component) throw new Error(`Component ${id} not found`)

    // force update the mouse position
    editor.view.area.pointermove(e as unknown as PointerEvent)

    createNode(component.component, editor.view.area.mouse, Object.assign({}, component.defaultData)).then((node: Node) => {
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
