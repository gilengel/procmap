import { ref } from 'vue';
import 'regenerator-runtime/runtime';

import Rete, { Component, Node as ReteNode } from 'rete';
import { Data } from 'rete/types/core/data';
import ConnectionPlugin from 'rete-connection-plugin';
import VueRenderPlugin from 'src/plugins/rete-vue/Index';
import { MetaFlowCategory } from 'src/models/flow/Meta';
import { FlowComponent } from 'src/models/flow/Component';
import { ParameterSchema } from 'src/models/flow/Parameter';
import { SchemaBasedNodeEditor } from 'src/models/flow/SchemaEditor';

export default function flowEditor(
  editorID: string,
  categories: MetaFlowCategory[]
) {
  const editor = ref<SchemaBasedNodeEditor | undefined>(undefined);

  const width = ref(0);
  const height = ref(0);
  const importing = ref(false);
  const engine = new Rete.Engine(editorID);

  const createEditor = (container: HTMLElement) => {
    editor.value = new SchemaBasedNodeEditor(editorID, container);

    editor.value.use(ConnectionPlugin);
    editor.value.use(VueRenderPlugin);

    registerNodes();
  };

  const _createNode = async (
    component: Component,
    position: { x: number; y: number },
    data: Record<string, unknown>
  ): Promise<ReteNode> => {
    return new Promise<ReteNode>((resolve, reject) => {
      component
        .createNode(data)
        .then((v) => {
          v.position = [position.x, position.y];

          resolve(v);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  const createNode = (
    id: string,
    pos: { x: number; y: number },
    uuid: string
  ) => {
    const component = editor.value?.registeredNodes.get(id);

    if (!component) throw new Error(`Component ${id} not found`);

    _createNode(
      component.component,
      pos,
      Object.assign({}, component.defaultData, { uuid: uuid })
    )
      .then((node: ReteNode) => {
        editor.value?.addNode(node);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const removeNode = (uuid: string) => {
    for (const node of editor.value?.nodes as ReteNode[]) {
      if (node.data.uuid !== uuid) {
        continue;
      }

      editor.value?.removeNode(node);
    }
  };

  /*
  const createEventCallback = (
    events:
      | 'componentregister'
      | 'nodecreate'
      | 'nodecreated'
      | 'noderemove'
      | 'noderemoved'
      | 'connectioncreate'
      | 'connectioncreated'
      | 'connectionremove'
      | 'connectionremoved'
      | 'translatenode'
      | 'nodetranslate'
      | 'nodetranslated'
      | 'nodedraged'
      | 'nodedragged'
      | 'selectnode'
      | 'multiselectnode'
      | 'nodeselect'
      | 'nodeselected'
      | 'rendernode'
      | 'rendersocket'
      | 'rendercontrol'
      | 'renderconnection'
      | 'updateconnection'
      | 'keydown'
      | 'keyup'
      | 'translate'
      | 'translated'
      | 'zoom'
      | 'zoomed'
      | 'click'
      | 'mousemove'
      | 'contextmenu'
      | 'import'
      | 'export'
      | 'process'
      | 'clear',
    callback: () => void
  ) => {
    editor?.on(events, callback);
  };
  */

  const enableDragAndDrop = () => {
    if (!editor.value)
      throw new Error(
        'Cannot add flow node. Reason is: flow editor was not properly created'
      );
    editor.value.view.container.addEventListener('dragover', (e) =>
      e.preventDefault()
    );
    editor.value.view.container.addEventListener('drop', (e: DragEvent) => {
      if (!e.dataTransfer) return;

      if (!editor.value)
        throw new Error(
          'Cannot add flow node. Reason is: flow editor was not properly created'
        );

      createNode(e.dataTransfer.getData('componentId'), editor.value.view.area.mouse, '');

      // force update the mouse position
      editor.value?.view.area.pointermove(e as unknown as PointerEvent);
    });
  };

  const registerSockets = (pins: ParameterSchema[]) => {
    for (const pin of pins) {
      if (editor.value?.registeredSockets.has(pin.type)) {
        continue;
      }

      editor.value?.addSocket(pin.type);
    }
  };

  const registerNodes = () => {
    for (const category of categories) {
      category.components.map((c) => {
        const component = c.component as FlowComponent;
        editor.value?.register(component);
        engine.register(component);

        if (component.schema.inputs) {
          registerSockets(component.schema.inputs);
        }

        if (component.schema.outputs) {
          registerSockets(component.schema.outputs);
        }

        editor.value?.addNodeSchema(c.id, c);
      });
    }
  };

  const registerEditorEvents = () => {
    editor.value?.on(
      [
        'process',
        'nodecreated',
        'noderemoved',
        'connectioncreated',
        'connectionremoved',
      ],
      async () => {
        await engine.abort();
        await engine.process(editor.value?.toJSON() as Data);
      }
    );

    /*
    editor?.on(['keyup'], async (e: KeyboardEvent) => {
      keyUpEvent(e);
      await engine.process(editor?.toJSON() as Data );
    });
    */
    //editor?.on(['nodeselected'], (node: ReteNode) => emitter?.emit(FLOW_NODE_SELECTED, node) )
    //editor?.on(['nodecreated'], (node: ReteNode) => { if(!importing.value) { emitter?.emit(FLOW_NODE_ADDED, node) }})
  };

  const enableImport = () => {
    editor.value?.on(['import'], async () => {
      importing.value = true;
      await engine.abort();
      await engine.process(editor.value?.toJSON() as Data);
      importing.value = false;
    });
  };

  const keyUpEvent = (e: KeyboardEvent) => {
    if (
      e.code === 'Delete' &&
      (e.target as HTMLElement).tagName.toUpperCase() !== 'INPUT'
    ) {
      editor.value?.selected.each((n) => editor.value?.removeNode(n));
    }
  };

  const onResize = (e: HTMLElement) => {
    width.value = e.scrollWidth; // - (e.scrollWidth % 50)
    height.value = e.scrollHeight; // - (e.scrollHeight % 50)
    if (width.value !== e.scrollWidth || height.value !== e.scrollHeight) {
      editor.value?.view.resize();
    }
  };

  return {
    editor,
    createEditor,
    enableDragAndDrop,
    createNode,
    removeNode,
    registerSockets,
    registerEditorEvents,
    enableImport,
    keyUpEvent,
    onResize,
    //createEventCallback
  };
}
