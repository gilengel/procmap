<template>
  <div class="preview">
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title>Flow</q-toolbar-title>
      <q-btn flat round dense>
        <q-icon name="las la-window-minimize" />
      </q-btn>
    </q-toolbar>

    <div v-resize="onResize" class="flow">
      <div id="rete" ref="rete" />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */

import { Vue, Component, Prop } from "vue-property-decorator";
import "@babel/polyfill";
import Rete, { Engine, NodeEditor, Node as ReteNode } from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "../render/Index";
import DockPlugin from "../dock/Index";
import { v4 as uuidv4 } from "uuid";
import resize from "vue-resize-directive";
import { store } from "../../store/index";
import EventBus, {
  FLOW_NODE_SELECTED,
  FLOW_NODE_ADDED,
  FLOW_NODE_REMOVED,
  FLOW_GRAPH_UPDATED,
  FLOW_GRAPH_IMPORTED,
  FLOW_GRAPH_MANUALLY_CHANGED,
} from "../../EventBus";
import { MetaFlowCategory } from "../flow/Index";

import { Data } from "rete/types/core/data";

@Component({
  directives: {
    resize,
  },
})
export default class FlowGraphComponent extends Vue {
  @Prop() readonly nodes!: Array<MetaFlowCategory>;

  // All nodes of the current graph
  @Prop() graph!: Array<ReteNode>;

  editor!: NodeEditor;
  engine!: Engine;

  createEditor() {
    const container = this.$refs.rete;
    this.editor = new Rete.NodeEditor("demo@0.1.0", container as HTMLElement);

    this.editor.use(ConnectionPlugin);
    this.editor.use(VueRenderPlugin, { store });
    this.editor.use(DockPlugin, this.nodes);
  }

  createCustomEditorEvents() {
    this.editor.bind("previewnode");
  }

  registerComponents() {
    for (const category of this.nodes) {
      category.components.map((c) => {
        this.editor.register(c.component);
        this.engine.register(c.component);
      });
    }
  }

  /*
  makeComponentDataReactive() {
    for (const category of this.nodes) {
      category.components.forEach((c) => {
        const data = c.defaultData;

        // Convert all default values to vue reactive ones
        for (const i in data) {
          if (!(data[i] instanceof Object)) {
            Vue.set(data, i, data[i]);
          }
        }
      });
    }
  }
  */

  registerEditorEvents() {
    this.editor.on(["nodecreate"], (node) => {
      // Add random uuid used to identify model in store related to the new node
      if (!node.data.uuid) {
        node.data.uuid = uuidv4();
      }

      this.graph.push(node);

      this.$emit("add-widget", node);
      EventBus.$emit(FLOW_NODE_ADDED, node);

      return node;
    });

    this.editor.on(
      ["process", "nodecreated", "connectioncreated", "noderemoved"],
      async () => {
        const data = this.editor.toJSON();
        await this.engine.abort();
        await this.engine.process(data);

        EventBus.$emit(FLOW_GRAPH_UPDATED, data);
      }
    );

    this.editor.on(["nodeselected"], (node: ReteNode) => {
      EventBus.$emit(FLOW_NODE_SELECTED, node);
    });

    this.editor.on(["import"], async () => {
      await this.engine.abort();
      await this.engine.process(this.editor.toJSON());
    });

    this.editor.on(["keyup"], async (e: KeyboardEvent) => {
      this.keyUpEvent(e);

      await this.engine.process(this.editor.toJSON());

      EventBus.$emit(FLOW_GRAPH_MANUALLY_CHANGED, this.editor.toJSON());
    });

    this.editor.on(["click"], (e: KeyboardEvent, container: HTMLElement) => {
      this.editor.selected.list = [];
    });
  }

  private registerToEventBus() {
    EventBus.$on(FLOW_NODE_SELECTED, () => {
      this.engine.process(this.editor.toJSON());
    });

    EventBus.$on(FLOW_GRAPH_IMPORTED, (model: Data) => {
      this.editor.fromJSON(model);
    });
  }

  async mounted() {
    this.createEditor();
    this.createCustomEditorEvents();

    this.engine = new Rete.Engine("demo@0.1.0");
    this.registerComponents();

    // Progress is used for longer task to display a progress bar
    //this.makeComponentDataReactive();

    this.registerEditorEvents();

    this.registerToEventBus();

    const data = {
      id: "demo@0.1.0",
      nodes: {
        "1": {
          id: 1,
          data: {},
          inputs: {},
          outputs: {
            text: {
              connections: [
                {
                  node: 2,
                  input: "text",
                  data: {},
                },
              ],
            },
          },
          position: [80, 200],
          name: "text",
        },

        "2": {
          id: 2,
          data: {},
          inputs: {},
          outputs: {
            map: {
              connections: [
                {
                  node: 3,
                  input: "map",
                  data: {},
                },
              ],
            },
          },
          position: [280, 200],
          name: "TextFilter",
        },

        "3": {
          id: 3,
          data: {},
          inputs: {},
          outputs: {},
          position: [580, 200],
          name: "table",
        },
      },
    };

    //await this.editor.fromJSON(data);

    this.editor.view.resize();
    this.editor.trigger("process");
  }

  keyUpEvent(e: KeyboardEvent) {
    if (
      e.code === "Delete" &&
      (e.target as HTMLElement).tagName.toUpperCase() !== "INPUT"
    ) {
      this.editor.selected.each((n) => this.editor.removeNode(n));
    }
  }

  width = 512;
  height = 512;

  onResize(e: HTMLElement) {
    this.width = e.scrollWidth; // - (e.scrollWidth % 50)
    this.height = e.scrollHeight; // - (e.scrollHeight % 50)

    if (this.width !== e.scrollWidth || this.height !== e.scrollHeight) {
      this.editor.view.resize();
    }
  }
}
</script>

<style lang="scss" scoped>
.preview {
  display: flex;
  flex-direction: column;
  height: 100%;

  overflow: hidden;

  .flow {
    flex-grow: 2;
    display: flex;
    flex-direction: column;

    #rete {
      height: 100%;
      overflow: collapse;

      flex-grow: 2;
    }
  }
}
</style>
