import { ControlSchema } from './Control';
import { ParameterSchema } from './Parameter'
import { Store } from 'vuex'
import { FlowControl, createControl } from './Control'
import Rete, { Node as ReteNode } from 'rete'
import { NodeEditor } from 'rete/types'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import * as StringSimilarity from 'string-similarity'
import { SchemaBasedNodeEditor } from './SchemaEditor';

export interface ComponentSchema {
  label: string;

  inputs?: ParameterSchema[];
  outputs?: ParameterSchema[];

  controls?: ControlSchema[];

  data?: unknown;

  hasValidInputsFn?: (node: NodeData, inputs: WorkerInputs, keys: [string]) => boolean;

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs,
    store?: Store<unknown>
  ) => Promise<void>;
}

declare module 'rete/types/events' {
  interface EventsTypes {
    previewnode: { node: ReteNode }
  }
}

export enum Direction {
  In,
  Out
}

export function buildParameterPin(
  editor: SchemaBasedNodeEditor,
  node: ReteNode,
  parameter: ParameterSchema,
  direction: Direction
) {
  const socket = editor.registeredSockets.get(parameter.type)
  if (socket === undefined) {
    const bestMatch = StringSimilarity.findBestMatch(
      parameter.type,
      Array.from(editor.registeredSockets.keys())
    )

    throw new Error(
      `Socket with the name ${parameter.type} does not exists.` +
      (bestMatch.bestMatch.rating > 0.5
        ? ` Did you mean the socket "${bestMatch.bestMatch.target}"?`
        : 'Make sure that a socket with this name is registered in the FlowGraphComponent.')
    )
  }

  if (direction === Direction.Out) {
    const pin = new Rete.Output(parameter.id !== undefined ? parameter.id : parameter.type, parameter.label, socket)
    node.addOutput(pin)

    if (parameter.control !== undefined) {
      node.addControl(
        createControl(
          parameter.control.component,
          editor,
          node,
          parameter.control.identifier !== undefined ? parameter.control.identifier : parameter.type,
          parameter.value,
          // eslint-disable-next-line @typescript-eslint/unbound-method
          parameter.control.isValid !== undefined ? parameter.control.isValid : () => true
        )
      )
    }

    return
  }

  const pin = new Rete.Input(parameter.id !== undefined ? parameter.id : parameter.type, parameter.label, socket)
  if (parameter.control !== undefined) {
    pin.addControl(
      createControl(
        parameter.control.component,
        editor,
        node,
        parameter.control.identifier !== undefined ? parameter.control.identifier : parameter.type,
        parameter.value,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        parameter.control.isValid !== undefined ? parameter.control.isValid : () => true
      )
    )
  }

  node.addInput(pin)
}
export class FlowComponent extends Rete.Component {
  readonly schema: ComponentSchema;

  constructor(inSchema: ComponentSchema) {
    super(inSchema.label)

    this.schema = inSchema

    this.data = {
      render: 'vue',
      component: Node
    }
  }



  builder(node: ReteNode): Promise<void> {
    const editor = this.editor
    if (!editor) {
      throw new Error('Cannot create instance of type FlowComponent because the provided editor is undefined')
    }

    if (this.schema.inputs) {
      this.schema.inputs.forEach(parameter => {
        buildParameterPin(
          editor as SchemaBasedNodeEditor,
          node,
          parameter,
          Direction.In
        )
      })
    }

    if (this.schema.outputs) {
      this.schema.outputs.forEach(parameter => {
        buildParameterPin(
          editor as SchemaBasedNodeEditor,
          node,
          parameter,
          Direction.Out
        )
      })
    }

    if (this.schema.controls) {
      this.schema.controls.forEach(control => {
        node.addControl(
          new FlowControl(control.component, editor, control.identifier as string, 0, () => true /*control.isValid*/, node))
      })
    }

    return new Promise(resolve => resolve())
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    const nodeEditor = this.editor as NodeEditor

    let vueStore: Store<unknown> | undefined
    if (nodeEditor) {
      //const renderPlugin = nodeEditor.plugins.get('vue-render')
      //vueStore = (renderPlugin as ReteEditorWithStore).store as Store<unknown>
    }

    await this.schema.workerFn(node, inputs, outputs, vueStore)
  }
}
