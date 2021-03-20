/* eslint-disable */

import Vue, { VueConstructor } from 'vue'
import { Store } from 'vuex'

import Rete, { Socket, Node as ReteNode } from 'rete'
import { NodeEditor, Control as ReteControl } from 'rete/types'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import * as StringSimilarity from 'string-similarity'
import Node from './Node.vue'
declare module 'rete/types/events' {
    interface EventsTypes {
        previewnode: { node: ReteNode }
    }
}

const registeredSockets = new Map([

    ['table_data', new Socket('table_data')],
    ['text', new Socket('text')]

])

function createControl (
    component: VueConstructor<Vue>,
    emitter: NodeEditor,
    key: string,
    value: unknown,
    isValid: (input: unknown) => boolean
): ReteControl {
    return new FlowControl(component, emitter, key, value, isValid)
}

export function setNodeValue (node: NodeData, key: string, value: unknown) {
    const oldValue: unknown = node.data['old_' + key]
    if (!oldValue) {
        node.data['old_' + key] = value
    }

    node.data[key] = value
}

export function rejectMessage (nodeIdentifier: string, keyIdentifier: string): string {
    return `FlowNode[${nodeIdentifier}.${keyIdentifier}] is not set or invalid. Check that the pin is connected or a value is provided via a control element`
}

export function hasNodeDataPropertyChanged (node: NodeData, key: string, value: unknown): boolean {
    const oldValue: unknown = node.data['old_' + key]
    if (!oldValue) {
        return false
    }

    return oldValue !== value
}

export function setOutputValue (node: NodeData, outputs: WorkerOutputs, key: string, value: unknown) {
    node.data['old_' + key] = node.data[key]
    node.data[key] = value

    if (node.outputs[key]) {
        outputs[key] = value
    }
}

/**
 * Trys to get the value of an input pin with the key parameter.
 * You can specify the key index in case your node has multiple inputs with the same key.
 *
 * In case no input is connected for the key, the function will try to extract the value from the node data value.
 * If this also fails an error is thrown
 *
 * @param key
 * @param inputs
 * @param node
 */
export function getInputValue<T> (key: string, inputs: WorkerInputs, node: NodeData, index = 0): T {
    if (inputs[key] === undefined && node.data[key] === undefined) {
        console.error(`input[${key}] of ${node.name} has no value`)
    }

    if (inputs[key] !== undefined && inputs[key][index] !== undefined) {
        return inputs[key][index] as T
    }

    return node.data[key] as T
}

function xor (value1: boolean, value2: boolean): boolean {
    return value1 ? !value2 : value2
}

export function hasInputValueChanged (key: string, inputs: WorkerInputs, node: NodeData, index = 0): boolean {
    const hasInputValue = inputs[key] !== undefined && inputs[key][index] !== undefined
    const hasDataValue = node.data[key] !== undefined
    const hasOldDataValue = node.data['old_' + key] !== undefined

    // check if current data and old data have changed
    if (hasDataValue && hasOldDataValue) {
        return node.data[key] !== node.data['old_' + key]
    }

    if (hasInputValue && hasDataValue) {
        return inputs[key][index] !== node.data[key]
    }

    // case either input or current data has changed
    if (xor(hasInputValue, hasDataValue) || xor(hasDataValue, hasOldDataValue)) {
        return true
    }

    return false
}

interface FlowControlProps<T> {
    readonly emitter: NodeEditor
    readonly propertyKey: string
    value: T
    readonly isValid: (input: T) => boolean
}
export class FlowControl<S> extends Rete.Control {
    component: VueConstructor<Vue>

    props: FlowControlProps<S>

    constructor(component: VueConstructor<Vue>, emitter: NodeEditor, key: string, value: S, isValid: (input: S) => boolean) {
        super(key)
        this.component = component
        this.props = { emitter, propertyKey: key, value: value, isValid: isValid }
    }
}

interface ComponentSchema {
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

enum Direction {
    In,
    Out
}

interface ControlSchema {
    component: VueConstructor<Vue>;
    isValid?(input: unknown): boolean;
    // Node property key, this is set automatically to the key of the input/output the control is connected to.
    // However sometimes you want to specify it by yourself for example if you want to add a control to an array of
    // random numbers and the control should control how many random numbers are generated.
    identifier?: string;
}

interface ParameterSchema {
    type: string;
    id?: string;
    mandatory: boolean;
    label: string;
    value?: unknown;
    control?: ControlSchema;
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

    private buildParameterPin (
        editor: NodeEditor,
        node: ReteNode,
        parameter: ParameterSchema,
        direction: Direction
    ) {
        const socket = registeredSockets.get(parameter.type)
        if (socket === undefined) {
            const bestMatch = StringSimilarity.findBestMatch(
                parameter.type,
                Array.from(registeredSockets.keys())
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
                    parameter.control.identifier !== undefined ? parameter.control.identifier : parameter.type,
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

        if (this.schema.controls) {
            this.schema.controls.forEach(control => {
                node.addControl(
                    new FlowControl(
                        control.component,
                        this.editor as NodeEditor,
                        control.identifier as string,
                        0,
                        control.isValid as (input: 0) => boolean))
            })
        }

        return new Promise(resolve => resolve())
    }

    async worker (node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
        const nodeEditor = this.editor as NodeEditor

        let vueStore: Store<unknown> | undefined
        if (nodeEditor) {
            const renderPlugin = nodeEditor.plugins.get('vue-render')
            vueStore = renderPlugin.store as Store<unknown>
        }

        await this.schema.workerFn(node, inputs, outputs, vueStore)
    }
}

export class FlowComponentWithPreview extends FlowComponent {
    builder (node: ReteNode): Promise<void> {
        node.data.hasPreview = true
        node.data.preview = false

        return super.builder(node)
    }
}
