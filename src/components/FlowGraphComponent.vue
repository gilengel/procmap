<template>
  <q-page>
    <div id="rete" ref="rete"></div>
  </q-page>
</template>

<script lang="ts">
import Vue, { VueConstructor, PropType } from "vue";
import "@babel/polyfill";
import Rete, { Socket, Control } from "rete";
import { Node, NodeEditor, Input, Output } from "rete/types";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import SVGRenderer from "components/SVGRenderer";
import PointsControl from "./PointsControl";
import { Component } from "rete/types/engine";

import RandomProperties from "components/RandomProperties";

import RandomPropertiesVue from "./RandomProperties.vue";

import {
  FlowPointsControl,
  DimensionControl,
  FlowComponent
} from "./FlowGraph";

import * as d3 from "d3";


import DimensionControlVue from "./DimensionControl.vue";
import { Delaunay, Voronoi } from "d3-delaunay";
import { compareTwoStrings } from "string-similarity";

export default Vue.extend({
  name: "FlowGraphComponent",

  props: ["map", "geometry"],

  async mounted() {
    const container = this.$refs.rete;
    const editor = new Rete.NodeEditor("demo@0.1.0", container as HTMLElement);

    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);

    let mapComponent = new FlowComponent({
      label: "map",

      outputs: [
        {
          identifier: "dimension",
          label: "Dimension",
          value: this.map.dimension,

          control: {
            control: DimensionControl,
            component: DimensionControlVue
          }
        }
      ],

      workerFn: (
        node: NodeData,
        inputs: WorkerInputs,
        outputs: WorkerOutputs
      ) => {
        outputs.dimension = node.data.dimension;
      }
    });

    let randomComponent = new FlowComponent({
      label: "random",

      inputs: [
        {
          identifier: "dimension",
          label: "Dimension"
        }
      ],

      outputs: [
        {
          identifier: "points",
          label: "Random Points",
          //value: "Foobar :)",

          control: {
            control: FlowPointsControl,
            component: PointsControl
          }
        }
      ],

      workerFn: (
        node: NodeData,
        inputs: WorkerInputs,
        outputs: WorkerOutputs
      ) => {
        let dimension: any = inputs["dimension"].length
          ? inputs["dimension"][0]
          : node.data.dimenion;

        const amount: number = node.data.numPoints as number;

        const randomX = d3.randomNormal(
          dimension.width / 2,
          dimension.height / 3
        );
        const randomY = d3.randomNormal(
          dimension.height / 2,
          dimension.height / 3
        );
        outputs.points = Array.from({ length: amount }, () => [
          randomX(),
          randomX()
        ]);

        node.data.points = outputs.points;
      }
    });

    let voronoiComponent = new FlowComponent({
      label: "voronoi",

      inputs: [
        {
          identifier: "points",
          label: "points",
        }
      ],

      outputs: [
        {
          identifier: "cells",
          label: "cells",
          value: ""
        }
      ],

      workerFn: (
        node: NodeData,
        inputs: WorkerInputs,
        outputs: WorkerOutputs
      ) => {
        node.data.voronoi = Delaunay.from(inputs.points[0])
      }
    });

    let svgComponent = new FlowComponent({
      label: "svg",
      inputs: [
        {
          identifier: "cells",
          label: "geometry",
          value: "Test"
        }
      ],

      workerFn: (
        node: NodeData,
        inputs: WorkerInputs,
        outputs: WorkerOutputs
      ) => {}
    });

    const engine = new Rete.Engine("demo@0.1.0");
    var components = [
      mapComponent,
      randomComponent,
      voronoiComponent,
      svgComponent
    ];
    components.map(c => {
      editor.register(c);
      engine.register(c);
    });

    let mapNode = await components[0].createNode({
      dimension: this.$props.map.dimension
    });
    mapNode.position = [80, 200];
    editor.addNode(mapNode);

    let randNode = await components[1].createNode({ numPoints: 200 });
    randNode.position = [80 + 320, 200];
    editor.addNode(randNode);

    let voroniNode = await components[2].createNode();
    voroniNode.position = [80 + 320 * 2, 200];
    editor.addNode(voroniNode);

    editor.connect(
      mapNode.outputs.get("dimension") as Output,
      randNode.inputs.get("dimension") as Input
    )    
    editor.connect(
      randNode.outputs.get("points") as Output,
      voroniNode.inputs.get("points") as Input
    );


    editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      async () => {
        await engine.abort();
        await engine.process(editor.toJSON());

        if(editor.selected.list.length == 1) {
          this.updatePreviewGeometry(editor.selected.list[0])
        }
      }
    );

    editor.on("nodeselected", async (node: Node) => {
      this.updatePreviewGeometry(node)
    });

    editor.view.resize();
    editor.trigger("process");
  },

  methods: {
    updatePreviewGeometry(node: Node) {
      switch (node.name) {
        case "random": {
          this.$emit("update:geometry", { points: node.data.points });
          break;
        }
        case "voronoi": {
          const {points, halfedges, triangles} = node.data.voronoi as Delaunay;
          this.$emit("update:geometry", { points: points, lines: halfedges, triangles: triangles })
        }
        default: {
          break;
        }
      }
    }
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
