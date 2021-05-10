import Vue, { VueConstructor } from 'vue'
import { NodeEditor, Control as ReteControl } from 'rete/types'
import Rete from 'rete'


export interface ControlSchema {
  component: VueConstructor<Vue>;
  isValid?(input: unknown) : boolean;
  // Node property key, this is set automatically to the key of the input/output the control is connected to.
  // However sometimes you want to specify it by yourself for example if you want to add a control to an array of
  // random numbers and the control should control how many random numbers are generated.
  identifier?: string;
}

export class FlowControl<S> extends Rete.Control {
  component: VueConstructor<Vue>

  props: FlowControlProps<S>

  constructor (component: VueConstructor<Vue>, emitter: NodeEditor, key: string, value: S, isValid: (input: S) => boolean) {
    super(key)
    this.component = component
    this.props = { emitter, propertyKey: key, value: value, isValid: isValid }
  }
}

interface FlowControlProps<T> {
  readonly emitter: NodeEditor
  readonly propertyKey: string
  value: T
  readonly isValid: (input: T) => boolean
}

export function createControl (
  component: VueConstructor<Vue>,
  emitter: NodeEditor,
  key: string,
  value: unknown,
  isValid: (input: unknown) => boolean
): ReteControl {
  return new FlowControl(component, emitter, key, value, isValid)
}
