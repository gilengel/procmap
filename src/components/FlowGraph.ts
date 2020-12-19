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
  ['indices', new Socket('indices')]
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
    // console.log(value)
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
          parameter.value,
          // eslint-disable-next-line @typescript-eslint/unbound-method
          parameter.control.isValid !== undefined ? parameter.control.isValid : () => true
        )
      )
    }
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
