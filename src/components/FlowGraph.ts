import Vue, { VueConstructor } from 'vue'
import Rete, { Socket, Node as ReteNode } from 'rete'
import { NodeEditor, Input, Output, Control as ReteControl } from 'rete/types'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import * as StringSimilarity from 'string-similarity'
import { Dimension } from './models'
import Node from './Node.vue'
declare module 'rete/types/events' {
  interface EventsTypes {
    previewnode: { node: ReteNode}
  }
}

const registeredSockets = new Map([
  ['points', new Socket('points')],
  ['voronoi', new Socket('voronoi')],
  ['dimension', new Socket('dimension')],
  ['indices', new Socket('indices')],
  ['number', new Socket('number')]
])

function createControl (
  Control: typeof FlowNumberControl,
  component: VueConstructor<Vue>,
  emitter: NodeEditor,
  key: string,
  value: unknown,
  isValid: (input: unknown) => boolean
): ReteControl {
  return new Control(component, emitter, key, value, isValid)
}

export interface FlowOutput<T> {
  processed: boolean;
  value: T;
}

export interface FlowData<T> {
  changed: boolean;
  value: T
}

export function setNodeValue (node: NodeData, key: string, value: unknown) {
  const oldValue: unknown = node.data['old_' + key]
  if (!oldValue) {
    node.data['old_' + key] = value
  }

  node.data[key] = value
}

export function hasNodeDataPropertyChanged (node: NodeData, key: string, value: unknown): boolean {
  const oldValue: unknown = node.data['old_' + key]
  if (!oldValue) {
    return false
  }

  return oldValue !== value
}

export function setDataForUnconnectedInput (node: NodeData, inputs: WorkerInputs, key: string, value: unknown) {
  // inputs[key] is undefined means that we don't have any connections to this value
  if (!inputs[key]) {
    if (node.data[key] && node.data[key].value === value) {
      node.data[key].processed = true
    }
  }
}

export function setOutputValue (node: NodeData, outputs: WorkerOutputs, key: string, value: unknown) {
  const oldValue: unknown = node.data['old_' + key]

  if (!oldValue) {
    node.data['old_' + key] = { processed: false, value: value }
    node.data[key] = node.data['old_' + key]

    outputs[key] = node.data['old_' + key]
    return
  }

  const dataDidNotChanged = node.data['old_' + key].value === value
  node.data['old_' + key] = node.data[key]
  node.data[key] = { processed: dataDidNotChanged, value: value }

  outputs[key] = node.data[key]
}

export function getInputValue<T> (key: string, inputs: WorkerInputs, node: NodeData) : FlowOutput<T> {
  if (inputs[key] === undefined && node.data[key] === undefined) {
    throw new Error(`input[${key}] of ${node.name} has no value`)
  }

  if (inputs[key] !== undefined && inputs[key][0] !== undefined) {
    return inputs[key][0] as FlowOutput<T>
  }

  return node.data[key] as FlowOutput<T>
}

export class FlowNumberControl<
  T extends VueConstructor<Vue>
> extends Rete.Control {
  component: VueConstructor<Vue>

  props: unknown;

  constructor (component: T, emitter: NodeEditor, key: string, value: unknown, isValid: (input: unknown) => boolean) {
    super(key)
    this.component = component
    this.props = { emitter, ikey: key, value: value, isValid: isValid }
  }
}

export class DimensionControl<
  T extends VueConstructor<Vue>
> extends Rete.Control {
  component: VueConstructor<Vue>;

  props: unknown;

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
}

export class VoronoiRelaxationControl<
  T extends VueConstructor<Vue>
> extends Rete.Control {
  component: VueConstructor<Vue>;

  props: unknown;

  constructor (component: T, emitter: NodeEditor, key: string, value: unknown) {
    super(key)
    this.component = component
    this.props = { emitter, ikey: key, value: value }
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
  ) => Promise<void>;
}

enum Direction {
  In,
  Out
}

interface ControlSchema {
  control: typeof FlowNumberControl;
  component: VueConstructor<Vue>;
  isValid?(input: unknown) : boolean;
  // Node property key, this is set automatically to the key of the input/output the control is connected to.
  // However sometimes you want to specify it by yourself for example if you want to add a control to an array of
  // random numbers and the control should control how many random numbers are generated.
  identifier?: string;
}

interface ParameterSchema {
  identifier: string;
  label: string;
  value?: unknown;

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
    node: ReteNode,
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

    if (direction === Direction.Out) {
      const pin = new Rete.Output(parameter.identifier, parameter.label, socket)
      node.addOutput(pin)

      if (parameter.control !== undefined) {
        node.addControl(
          createControl(
            parameter.control.control,
            parameter.control.component,
            editor,
            parameter.control.identifier !== undefined ? parameter.control.identifier : parameter.identifier,
            parameter.value,
            // eslint-disable-next-line @typescript-eslint/unbound-method
            parameter.control.isValid !== undefined ? parameter.control.isValid : () => true
          )
        )
      }

      return
    }

    const pin = new Rete.Input(parameter.identifier, parameter.label, socket)
    if (parameter.control !== undefined) {
      pin.addControl(
        createControl(
          parameter.control.control,
          parameter.control.component,
          editor,
          parameter.control.identifier !== undefined ? parameter.control.identifier : parameter.identifier,
          parameter.value,
          // eslint-disable-next-line @typescript-eslint/unbound-method
          parameter.control.isValid !== undefined ? parameter.control.isValid : () => true
        )
      )
    }

    node.addInput(pin)
  }

  builder (node: ReteNode): Promise<void> {
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

  async worker (node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs): Promise<void> {
    if (this.schema.workerFn !== undefined) {
      await this.schema.workerFn(node, inputs, outputs)
    }
  }
}
