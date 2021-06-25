/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import VueNode from 'components/Node.vue';
import Socket from 'components/Socket.vue';
import Vue, {
  defineComponent,
  createApp,
  ComponentOptions,
  ComponentPublicInstance,
  Component as VueComponent,
} from 'vue';

//import { FLOW_NODE_ADDED, FLOW_NODES_CONNECTED, FLOW_NODES_DISCONNECTED } from 'src/components/flow/FlowEventBus'

import { NodeEditor, Node as ReteNode, Control } from 'rete';
interface VueReteWrapper {
  vueContext: ComponentPublicInstance;
  _vue: Vue.App<Element>;
  render: string;
}

interface VueElement {
  component: typeof defineComponent;
  props: Record<string, unknown>;
  vueContext: ComponentPublicInstance;
  render: string;
  _vue: Vue.App<Element>;
  update: () => void;
}

function createVue(
  el: Element,
  vueComponent: VueComponent,
  vueProps: Record<string, unknown>,
  node: VueElement
): Vue.App<Element> {
  const app = createApp(vueComponent, vueProps);
  const reactive = app.mount(el);

  if (node) {
    node.vueContext = reactive;
  }

  return app;
}

function createNode(
  editor: NodeEditor,
  {
    el,
    node,
    component,
    bindSocket,
    bindControl,
  }: {
    el: HTMLElement;
    node: ReteNode & VueElement;
    component: VueElement;
    // eslint-disable-next-line @typescript-eslint/ban-types
    bindSocket: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    bindControl: Function;
  }
): Vue.App<Element> {
  const vueProps = {
    ...component.props,
    node,
    editor,
    bindSocket,
    bindControl,
  };
  const app = createVue(el, VueNode, vueProps, node);

  return app;
}

function createControl(
  editor: NodeEditor,
  { el, control }: { el: HTMLElement; control: Control & VueElement }
) {
  const vueComponent = control.component;
  const vueProps = {
    ...control.props,
    getData: control.getData.bind(control),
    putData: control.putData.bind(control),
  };
  const app = createVue(el, vueComponent, vueProps, control);

  return app;
}

const update = (entity: VueElement) => {
  return new Promise((resolve) => {
    if (!entity.vueContext) return resolve(null);

    entity.vueContext.$forceUpdate();
    //entity.vueContext.$nextTick(resolve);
  });
};

// const listeners = new WeakMap()
function install(editor: NodeEditor) {
  editor.on(
    'rendernode',
    ({ el, node, component, bindSocket, bindControl }) => {
      const vueComponent = component as VueElement;

      if (vueComponent.render && vueComponent.render !== 'vue') return;
      const vueNode = node as ReteNode & VueElement;

      vueNode._vue = createNode(editor, {
        el,
        node: vueNode,
        component: vueComponent,
        bindSocket,
        bindControl,
      });
      //vueNode.update = async () => await update(vueNode)
    }
  );

  editor.on(['rendercontrol'], ({ el, control }) => {
    const vueControl = control as Control & VueElement;

    if (vueControl.render && vueControl.render !== 'vue') return;
    vueControl._vue = createControl(editor, { el, control: vueControl });
    vueControl.update = async () => await update(vueControl);
  });

  editor.on(['connectioncreated', 'connectionremoved'], async (connection) => {
    await update(connection.output.node as unknown as ReteNode & VueElement);
    await update(connection.input.node as unknown as ReteNode & VueElement);
  });

  editor.on('nodeselected', () => {
    editor.nodes.map((n) => update(n as ReteNode & VueElement));
  });

  //editor.on(['nodecreated'], node => this.emitter.emit(FLOW_NODE_ADDED, node))

  //editor.on(['connectioncreated'], connection => this.emitter.emit(FLOW_NODES_CONNECTED, connection))
  //editor.on(['connectionremoved'], connection => this.emitter.emit(FLOW_NODES_DISCONNECTED, connection))

  editor.on(['click'], () => {
    editor.selected.clear();

    // update the selection status of all nodes
    editor.nodes.map((n) => update(n as ReteNode & VueElement));
  });
}

export default {
  name: 'vue-render',
  install,
  Node,
  Socket,
};
