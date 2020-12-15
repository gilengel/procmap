import Vue, { VueConstructor } from 'vue'
import Rete, { Socket, Control } from 'rete'
import { NodeEditor, Input, Output } from 'rete/types'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import * as StringSimilarity from 'string-similarity'
import { Dimension } from './models'
import Node from './Node.vue'

const registeredSockets = new Map([
  ['points', new Socket('points')],
  ['cells', new Socket('cells')],
  ['dimension', new Socket('dimension')]
])

function createControl (
  Control: typeof FlowPointsControl,
  component: any,
  emitter: NodeEditor,
  key: string,
  value: any
): Control {
  return new Control(component, emitter, key, value)
}

export class FlowPointsControl<
  T extends VueConstructor<Vue>
> extends Rete.Control {
  component: VueConstructor<Vue>;

  constructor (component: T, emitter: NodeEditor, key: string, value: any) {
    // console.log(value)
    super(key)
    this.component = component
    this.props = { emitter, ikey: key, value: value }
  }

  setValue (val: string) {
    console.log(this)
    // this.vueContext.value = val
  }
}

export class DimensionControl<
  T extends VueConstructor<Vue>
> extends Rete.Control {
  component: VueConstructor<Vue>;

  constructor (
    component: T,
    emitter: NodeEditor,
    key: string,
    value: Dimension
  ) {
    super(key)
    this.component = component
    this.props = { emitter, ikey: key, value }
  }

  setValue (val: string) {
    this.vueContext.value = val
  }
}

interface ComponentSchema {
  label: string;

  inputs?: ParameterSchema[];
  outputs?: ParameterSchema[];

  data?: unknown;

  workerFn?: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) => void;
}

enum Direction {
  In,
  Out
}

interface ControlSchema {
  control: typeof FlowPointsControl;
  component: any;
}

interface ParameterSchema {
  identifier: string;
  label: string;
  value?: any;

  control?: ControlSchema;
}

export class FlowComponent extends Rete.Component {
  readonly schema: ComponentSchema;

  constructor (inSchema: ComponentSchema) {
    super(inSchema.label)

    this.schema = inSchema

    this.data = {
      render: 'vue',
      component: Node
    }
  }

  private buildParameterPin (
    editor: NodeEditor,
    node: Node,
    parameter: ParameterSchema,
    direction: Direction
  ) {
    const socket = registeredSockets.get(parameter.identifier)
    if (socket === undefined) {
      const bestMatch = StringSimilarity.findBestMatch(
        parameter.identifier,
        Array.from(registeredSockets.keys())
      )

      throw new Error(
        `Socket with the name ${parameter.identifier} does not exists.` +
          (bestMatch.bestMatch.rating > 0.5
            ? ` Did you mean the socket "${bestMatch.bestMatch.target}"?`
            : 'Make sure that a socket with this name is registered in the FlowGraphComponent.')
      )
    }

    const pin =
      direction === Direction.In
        ? new Rete.Input(parameter.identifier, parameter.label, socket)
        : new Rete.Output(parameter.identifier, parameter.label, socket)

    if (direction === Direction.In) {
      node.addInput(pin as Input)
    } else {
      node.addOutput(pin as Output)
    }

    if (parameter.control !== undefined) {
      node.addControl(
        createControl(
          parameter.control.control,
          parameter.control.component,
          editor,
          parameter.identifier,
          parameter.value
        )
      )
    }
  }

  builder (node: Node): Promise<void> {
    if (this.schema.inputs) {
      this.schema.inputs.forEach(parameter => {
        this.buildParameterPin(
          this.editor as NodeEditor,
          node,
          parameter,
          Direction.In
        )
      })
    }

    if (this.schema.outputs) {
      this.schema.outputs.forEach(parameter => {
        this.buildParameterPin(
          this.editor as NodeEditor,
          node,
          parameter,
          Direction.Out
        )
      })
    }

    return new Promise(resolve => resolve())
  }

  worker (node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs): void {
    if (this.schema.workerFn !== undefined) {
      this.schema.workerFn(node, inputs, outputs)
    }
  }
}
