<template>
  <q-page style="display: flex;">
    <q-splitter v-model="splitterModel" style="flex-grow: 2">
      <template v-slot:before>
        <q-page>
          <q-toolbar class="bg-black text-white">
            <q-toolbar-title>
              Control Flow
            </q-toolbar-title>
            <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
            <q-btn flat round dense icon="gamepad" />
          </q-toolbar>
          <q-page>
            <div id="rete" ref="rete"></div>
          </q-page>
        </q-page>
      </template>

      <template v-slot:after>
        <q-page>
          <div ref="viewer" class="preview"></div>
        </q-page>
      </template>
    </q-splitter>
  </q-page>
</template>

<script lang="ts">
import Vue from "vue";
import "@babel/polyfill";
import Rete from "rete";
import { Node, NodeEditor, Input, Output } from "rete/types";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";

import ImageRenderer from "components/ImageRenderer";
import ViewportRender from "components/ViewportRenderer";
import SVGRenderer from 'components/SVGRenderer'
import ImageControl from "components/ImageControl";
import { Component } from "rete/types/engine";

const imageSocket = new Rete.Socket("Image value");
// const csvSocket = new Rete.Socket('CSV value')
// const binarySocket = new Rete.Socket('Binary value')

class ImageInputComponent extends Rete.Component {
  constructor() {
    super("Image");
  }

  builder(node: Node): Promise<void> {
    const out = new Rete.Output("image", "Image", imageSocket);

    node
      .addControl(new NumControl(this.editor as NodeEditor, "image", true))
      .addOutput(out);

    return new Promise(resolve => resolve());
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs): void {
    outputs.image = node.data.image;
  }
}

class RandomPointsComponent extends Rete.Component {
  constructor() {
    super("Random 2D");
  }

  builder(node: Node): Promise<void> {
    const out = new Rete.Output("points", "points", imageSocket);

    node
      .addControl(new PointControl(this.editor as NodeEditor, "points", true))
      .addOutput(out);

    return new Promise(resolve => resolve());
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs): void {
    outputs.points = node.data.points;
  }
}

class NumControl extends Rete.Control {
  component: Component;

  constructor(emitter: NodeEditor, key: string, readonly: boolean) {
    super(key);
    this.component = ImageControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val: string) {
    this.vueContext.value = val;
  }
}

class PointControl extends Rete.Control {
  component: Component;

  constructor(emitter: NodeEditor, key: string, readonly: boolean) {
    super(key);
    this.component = ImageControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val: string) {
    this.vueContext.value = val;
  }
}

class ImageRenderComponent extends Rete.Component {
  constructor() {
    super("Image Viewer");
  }

  builder(node: Node): Promise<void> {
    const input = new Rete.Input("image", "Image", imageSocket);
    input.addControl(new NumControl(this.editor as NodeEditor, "image", true));

    node
      .addInput(input)
      .addControl(new NumControl(this.editor as NodeEditor, "preview", true));

    return new Promise(resolve => resolve());
  }

  worker(node: NodeData, inputs: WorkerInputs, _outputs: WorkerOutputs): void {
    var n1 = inputs.image.length ? inputs.image[0] : node.data,
      image;

    node.data.image = n1;

    const foundNode = (this.editor as NodeEditor).nodes
      .find(n => n.id === node.id)
      ?.controls.get("preview")
      ?.putData("image", n1);
  }
}

class SVGRenderComponent extends Rete.Component {
  constructor() {
    super("SVG Viewer");
  }

  builder(node: Node): Promise<void> {
    const input = new Rete.Input("points", "Points", imageSocket);
    input.addControl(
      new PointControl(this.editor as NodeEditor, "point", true)
    );

    node
      .addInput(input)
      .addControl(new PointControl(this.editor as NodeEditor, "point", true));

    return new Promise(resolve => resolve());
  }

  worker(node: NodeData, inputs: WorkerInputs, _outputs: WorkerOutputs): void {
    var n1 = inputs.points.length ? inputs.points[0] : node.data,
      points;

    node.data.points = n1;

    const foundNode = (this.editor as NodeEditor).nodes
      .find(n => n.id === node.id)
      ?.controls.get("preview")
      ?.putData("points", n1);
  }
}

class ViewportRenderComponent extends Rete.Component {
  constructor() {
    super("3D Viewer");
  }

  builder(node: Node): Promise<void> {
    const input = new Rete.Input("image", "Image", imageSocket);
    input.addControl(new NumControl(this.editor as NodeEditor, "image", true));

    node
      .addInput(input)
      .addControl(new NumControl(this.editor as NodeEditor, "preview", true));

    return new Promise(resolve => resolve());
  }

  worker(node: NodeData, inputs: WorkerInputs, _outputs: WorkerOutputs): void {}
}

export default Vue.extend({
  name: "FlowGraphComponent",

  data() {
    return {
      splitterModel: 50 // start at 50%
    };
  },

  async mounted() {
    const container = this.$refs.rete;
    const editor = new Rete.NodeEditor("demo@0.1.0", container as HTMLElement);

    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);

    const engine = new Rete.Engine("demo@0.1.0");
    var components = [new RandomPointsComponent(), new SVGRenderComponent()];
    components.map(c => {
      editor.register(c);
      engine.register(c);
    });

    /*
    var n1 = await components[0].createNode({
      image:
        'https://product.cdn.cevaws.com/var/storage/images/media/feliway-2017/images/ger-de/image_blog_kitten_eingewoehnen_1548x870/2320018-1-ger-DE/image_blog_kitten_eingewoehnen_1548x870.png'
    })
    var n2 = await components[1].createNode()

    var n3 = await components[0].createNode({
      image: 'https://rabbit.org/adoption/bunny.jpg'
    })
    var n4 = await components[1].createNode()
    */

    let randNode = await components[0].createNode({
      points: [
        { x: 10, y: 10 },
        { x: 20, y: 20 }
      ]
    });
    randNode.position = [80, 200];

    let svgNode = await components[1].createNode();
    svgNode.position = [300, 200];

    editor.addNode(randNode);
    editor.addNode(svgNode);
    editor.connect(
      randNode.outputs.get("points") as Output,
      svgNode.inputs.get("points") as Input
    );
    /*
    n3.position = [80, 400]
    n4.position = [300, 400]
    editor.addNode(n1)
    editor.addNode(n2)
    editor.addNode(n3)
    editor.addNode(n4)
    editor.addNode(n5)
    */
    //editor.connect(n1.outputs.get('image') as Output, n2.inputs.get('image') as Input)
    //editor.connect(n3.outputs.get('image') as Output, n4.inputs.get('image') as Input)
    // editor.connect(n2.outputs.get('num'), add.inputs.get('num2'))

    editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
      }
    );

    editor.on("nodeselected", async (e: Node) => {
      let viewer: HTMLElement = this.$refs.viewer as HTMLElement;

      switch (e.name) {
        case "Image Viewer": {
          // clear previous childs if existing
          viewer.innerHTML = "";

          const ComponentClass = Vue.extend(ImageRenderer);
          const instance = new ComponentClass({
            propsData: { image: e.data.image }
          });
          instance.$mount();
          viewer.appendChild(instance.$el);
          break;
        }

        case "3D Viewer": {
          // clear previous childs if existing
          viewer.innerHTML = "";

          const ComponentClass = Vue.extend(ViewportRender);
          const instance = new ComponentClass({
            propsData: { image: e.data.image }
          });
          instance.$mount();
          viewer.appendChild(instance.$el);
        }

        case "SVG Viewer": {
          viewer.innerHTML = "";

          const ComponentClass = Vue.extend(SVGRenderer);
          const instance = new ComponentClass({
            propsData: { image: e.data.image }
          });
          instance.$mount();
          viewer.appendChild(instance.$el);
        }

        default: {
          break;
        }
      }
    });

    editor.view.resize();
    // AreaPlugin.zoomAt(editor);
    editor.trigger("process");
  }
});
</script>

<style>
.preview {
  position: relative;
  width: 100%;
  height: 100vh;
}

.left {
  border: solid 5px red;

  height: 100%;
}

.right {
  border: solid 5px green;
}
</style>
