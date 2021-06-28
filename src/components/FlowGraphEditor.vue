<template>
  <div class="flow-graph-container column">
    <q-toolbar>
      <q-toolbar-title>
        {{ title }}
      </q-toolbar-title>
    </q-toolbar>
    <div class="flow">
      <div id="rete" ref="rete"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import 'regenerator-runtime/runtime';

import Rete, { Component, Node as ReteNode } from 'rete';
import { Data } from 'rete/types/core/data';
import ConnectionPlugin from 'rete-connection-plugin';
import VueRenderPlugin from 'src/plugins/rete-vue/Index';
import {
  MetaFlowCategory,
} from 'src/models/flow/Meta';
import { FlowComponent } from 'src/models/flow/Component';
import { ParameterSchema } from 'src/models/flow/Parameter';
import { SchemaBasedNodeEditor } from 'src/models/flow/SchemaEditor'
//import resize from 'vue-resize-directive'

const EDITOR_ID = 'demo@0.1.0';

export default defineComponent({
  props: {
    categories: {
      type: Array as PropType<Array<MetaFlowCategory>>,
      default: () => [],
      //required: true,
      //readonly: true
    },

    title: {
      default: 'Editor',
      //validator: (x) => { return typeof x === 'string' && x.length > 0
    },
  },

  data() {
    return {
      width: 0,
      height: 0,
      editor: undefined as undefined | SchemaBasedNodeEditor,
      engine: new Rete.Engine(EDITOR_ID),
    };
  },

  mounted() {
    this.createEditor();
    this.createCustomEditorEvents();
    this.registerNodes();
    this.registerEditorEvents();

    if (this.editor) {
      this.editor.view.resize();
      this.editor.trigger('process');
    }
  },

  methods: {
    createEditor() {
      const container = this.$refs.rete;
      this.editor = new SchemaBasedNodeEditor(EDITOR_ID, container as HTMLElement);
      this.editor.use(ConnectionPlugin);
      this.editor.use(VueRenderPlugin);

      this.enableDockWithDragDrop();
    },

    enableDockWithDragDrop() {
      if (!this.editor)
        throw new Error(
          'Cannot add flow node. Reason is: flow editor was not properly created'
        );
      this.editor.view.container.addEventListener('dragover', (e) =>
        e.preventDefault()
      );
      this.editor.view.container.addEventListener('drop', (e: DragEvent) => {
        if (!e.dataTransfer) return;

        if (!this.editor)
          throw new Error(
            'Cannot add flow node. Reason is: flow editor was not properly created'
          );

        const id = e.dataTransfer.getData('componentId');
        const component = this.editor.registeredNodes.get(id);

        if (!component) throw new Error(`Component ${id} not found`);

        // force update the mouse position
        this.editor.view.area.pointermove(e as unknown as PointerEvent);

        this.createNode(
          component.component,
          this.editor.view.area.mouse,
          Object.assign({}, component.defaultData)
        )
          .then((node: ReteNode) => {
            if (!this.editor)
              throw new Error(
                'Cannot add flow node. Reason is: flow editor was not properly created'
              );
            this.editor.addNode(node);
          })
          .catch((e) => {
            console.error(e);
          });
      });
    },

    async createNode(
      component: Component,
      position: { x: number; y: number },
      data: Record<string, unknown>
    ): Promise<ReteNode> {
      const node = await component.createNode(data);

      node.position = [position.x, position.y];

      return node;
    },

    createCustomEditorEvents() {
      if (!this.editor) {
        return;
      }

      this.editor.bind('previewnode');
    },

    registerSockets(pins: ParameterSchema[]) {
      for (const pin of pins) {
        if (this.editor?.registeredSockets.has(pin.type)) {
          continue;
        }

        this.editor?.addSocket(pin.type)
      }
    },

    registerNodes() {
      for (const category of this.categories) {
        category.components.map((c) => {
          const component = c.component as FlowComponent;
          this.editor?.register(component);
          this.engine.register(component);

          if (component.schema.inputs) {
            this.registerSockets(component.schema.inputs);
          }

          if (component.schema.outputs) {
            this.registerSockets(component.schema.outputs);
          }

          this.editor?.addNodeSchema(c.id, c);
        });
      }
    },

    registerEditorEvents() {
      this.editor?.on(
        [
          'process',
          'nodecreated',
          'noderemoved',
          'connectioncreated',
          'connectionremoved',
        ],
        async () => {
          await this.engine.abort();
          await this.engine.process(this.editor?.toJSON() as Data);
        }
      );
      this.editor?.on(['import'], async () => {
        await this.engine.abort();
        await this.engine.process(this.editor?.toJSON() as Data);
      });
      this.editor?.on(['keyup'], async (e: KeyboardEvent) => {
        this.keyUpEvent(e);
        await this.engine.process(this.editor?.toJSON() as Data);
      });
    },

    keyUpEvent(e: KeyboardEvent) {
      if (
        e.code === 'Delete' &&
        (e.target as HTMLElement).tagName.toUpperCase() !== 'INPUT'
      ) {
        this.editor?.selected.each((n) => this.editor?.removeNode(n));
      }
    },

    onResize(e: HTMLElement) {
      this.width = e.scrollWidth; // - (e.scrollWidth % 50)
      this.height = e.scrollHeight; // - (e.scrollHeight % 50)
      if (this.width !== e.scrollWidth || this.height !== e.scrollHeight) {
        this.editor?.view.resize();
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.flow-graph-container {
  min-height: 880x;
}
.flow {
  //position: absolute;
  min-height: 800px !important;
}
</style>
