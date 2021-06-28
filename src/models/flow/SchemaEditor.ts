import { NodeEditor, Socket } from 'rete';
import { MetaFlowComponent } from './Meta'

export class SchemaBasedNodeEditor extends NodeEditor {
  private _registeredSockets: Map<string, Socket>
  private _registeredNodes: Map<string, MetaFlowComponent>

  constructor(id: string, container: HTMLElement){
    super(id, container);

    this._registeredSockets = new Map();
    this._registeredNodes = new Map();
  }

  get registeredSockets(): Map<string, Socket> {
    return this._registeredSockets
  }

  get registeredNodes(): Map<string, MetaFlowComponent> {
    return this._registeredNodes
  }

  addSocket(id: string) : Socket {
    if(this._registeredSockets.has(id)) {
      throw new Error(`Adding new socket failed. Reason: Socket with id ${id} already exists`);
    }

    const socket = new Socket(id);
    this._registeredSockets.set(id, socket)

    return socket
  }

  addNodeSchema(id: string, node: MetaFlowComponent) : MetaFlowComponent {
    if(this._registeredNodes.has(id)) {
      throw new Error(`Adding new node failed. Reason: Node with id ${id} already exists`);
    }

    this._registeredNodes.set(id, node)

    return node
  }



}
