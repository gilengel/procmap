<template>
  <q-page>
    <div id="rete" ref="rete"></div>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import '@babel/polyfill'
import Rete from 'rete'
import { Node, Input, Output } from 'rete/types'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from 'rete-vue-render-plugin'
import PointsControl from './PointsControl.vue'

import { Dimension } from './models'

import {
  FlowPointsControl,
  DimensionControl,
  FlowComponent
} from './FlowGraph'

import * as d3 from 'd3'

import DimensionControlVue from './DimensionControl.vue'
import { Delaunay, Voronoi } from 'd3-delaunay'

export default Vue.extend({
  name: 'FlowGraphComponent',

  props: ['map', 'geometry'],

  async mounted () {
    const container = this.$refs.rete
    const editor = new Rete.NodeEditor('demo@0.1.0', container as HTMLElement)

    editor.use(ConnectionPlugin)
    editor.use(VueRenderPlugin)

    const mapComponent = new FlowComponent({
      label: 'map',

      outputs: [
        {
          identifier: 'dimension',
          label: 'Dimension',
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
        outputs.dimension = node.data.dimension
      }
    })

    const randomComponent = new FlowComponent({
      label: 'random',

      inputs: [
        {
          identifier: 'dimension',
          label: 'Dimension'
        }
      ],

      outputs: [
        {
          identifier: 'points',
          label: 'Points',

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
        const dimension: Dimension = inputs.dimension.length
          ? (inputs.dimension[0] as Dimension)
          : (node.data.dimenion as Dimension)

        const amount: number = node.data.numPoints as number

        const randomX = d3.randomNormal(
          dimension.width / 2,
          dimension.height / 3
        )
        const randomY = d3.randomNormal(
          dimension.height / 2,
          dimension.height / 3
        )
        outputs.points = Array.from({ length: amount }, () => [
          randomX(),
          randomY()
        ])

        node.data.points = outputs.points
      }
    })

    const voronoiComponent = new FlowComponent({
      label: 'voronoi',

      inputs: [
        {
          identifier: 'points',
          label: 'points'
        }
      ],

      outputs: [
        {
          identifier: 'voronoi',
          label: 'voronoi',
          value: '',

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
        /*
        const delaunay: Delaunay<number> = Delaunay.from(inputs.points[0])
        const voronoi = delaunay.voronoi([0, 0, 512, 512])

        for (let i = 0; i < 1; i++) {
          for (let i = 0; i < delaunay.points.length; i += 2) {
            const cell = voronoi.cellPolygon(i >> 1)
            if (cell === null) continue

            const x0 = delaunay.points[i],
              y0 = delaunay.points[i + 1]
            const [x1, y1] = d3.polygonCentroid(cell)

            delaunay.points[i] = x0 + (x1 - x0)
            delaunay.points[i + 1] = y0 + (y1 - y0)
          }

          voronoi.delaunay.update()
        }

        node.data.voronoi = voronoi
        node.data.delaunay = delaunay
        // outputs.voronoi = voronoi
        outputs.voronoi = node.data.voronoi
        */

        const iterations = node.data.numPoints || (node.data.numPoints as number > 0) ? node.data.numPoints : 1

        const delaunay: Delaunay<number> = Delaunay.from(inputs.points[0])
        const voronoi = delaunay.voronoi([0, 0, 512, 512])
        for (let s = 0; s < iterations; ++s) {
          const sVoronoi = voronoi.delaunay.voronoi([0, 0, 512, 512])

          for (let i = 0; i < sVoronoi.delaunay.points.length; i += 2) {
            const cell = sVoronoi.cellPolygon(i >> 1)
            if (cell === null) continue
            const x0 = sVoronoi.delaunay.points[i],
              y0 = sVoronoi.delaunay.points[i + 1]
            const [x1, y1] = d3.polygonCentroid(cell)

            sVoronoi.delaunay.points[i] = x0 + (x1 - x0) * 1.0
            sVoronoi.delaunay.points[i + 1] = y0 + (y1 - y0)
          }

          voronoi.delaunay.update()
          // UPDATE!
        }

        node.data.voronoi = voronoi.delaunay.voronoi([0, 0, 512, 512])
      }
    })

    const svgComponent = new FlowComponent({
      label: 'svg',
      inputs: [
        {
          identifier: 'cells',
          label: 'geometry',
          value: 'Test'
        }
      ],

      workerFn: (
        node: NodeData,
        inputs: WorkerInputs,
        outputs: WorkerOutputs
      ) => {}
    })

    const engine = new Rete.Engine('demo@0.1.0')
    var components = [mapComponent, randomComponent, voronoiComponent]
    components.map(c => {
      editor.register(c)
      engine.register(c)
    })

    const mapNode = await components[0].createNode({
      dimension: this.$props.map.dimension
    })
    mapNode.position = [80, 200]
    editor.addNode(mapNode)

    const randNode = await components[1].createNode({ numPoints: 200 })
    randNode.position = [80 + 375, 200]
    editor.addNode(randNode)

    const voroniNode = await components[2].createNode({ numPoints: 20 })
    voroniNode.position = [80 + 800, 200]
    editor.addNode(voroniNode)

    editor.connect(
      mapNode.outputs.get('dimension') as Output,
      randNode.inputs.get('dimension') as Input
    )
    editor.connect(
      randNode.outputs.get('points') as Output,
      voroniNode.inputs.get('points') as Input
    )

    editor.on(
      [
        'process',
        'nodecreated',
        'noderemoved',
        'connectioncreated',
        'connectionremoved'
      ],
      async () => {
        await engine.abort()
        await engine.process(editor.toJSON())

        if (editor.selected.list.length == 1) {
          this.updatePreviewGeometry(editor.selected.list[0])
        }
      }
    )

    editor.on('nodeselected', async (node: Node) => {
      this.updatePreviewGeometry(node)
    })

    editor.view.resize()
    editor.trigger('process')
  },

  methods: {
    updatePreviewGeometry (node: Node) {
      switch (node.name) {
        case 'random': {
          this.$emit('update:geometry', { points: node.data.points })
          break
        }
        case 'voronoi': {
          this.$emit('update:geometry', node.data.voronoi)
          break
        }
        case 'voronoi relaxation': {
          this.$emit('update:geometry', node.data.voronoi)
          break
        }

        default: {
          break
        }
      }
    }
  }
})
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
