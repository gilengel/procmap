<template>
  <q-page>
    <div id="rete" ref="rete"></div>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import '@babel/polyfill'
import Rete, { Node as ReteNode } from 'rete'
import { Input, Output } from 'rete/types'

import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from 'rete-vue-render-plugin'
import PointsControl from './PointsControl.vue'

import { RandomMap, Dimension } from './models'

import Component from 'vue-class-component'

import {
  FlowPointsControl,
  DimensionControl,
  FlowComponent
} from './FlowGraph'

import * as d3 from 'd3'

import DimensionControlVue from './DimensionControl.vue'
import { Delaunay, Voronoi } from 'd3-delaunay'

const FlowGraphProps = Vue.extend({
  props: {
    map: Object,
    geometry: Object
  }
})

@Component
export default class FlowGraphComponent extends FlowGraphProps {
   previewNode: Record<string, unknown> = {};

   async mounted () {
     const container = this.$refs.rete
     const editor = new Rete.NodeEditor('demo@0.1.0', container as HTMLElement)

     editor.bind('previewnode')
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

     const growComponent = new FlowComponent({
       label: 'grow',

       inputs: [
         {
           identifier: 'voronoi',
           label: 'voronoi'
         },
         {
           identifier: 'indices',
           label: 'indices'
         }
       ],

       outputs: [
         {
           identifier: 'indices',
           label: 'indices',

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
         const voronoi: Voronoi<number> = inputs.voronoi[0] as Voronoi<number>

         const selectedKeys = new Set<number>(inputs.indices[0] as Array<number>)

         const iterations = node.data.numPoints ? node.data.numPoints as number : 1
         for (let i = 0; i < iterations; i++) {
           const indices = Array.from(selectedKeys)
           for (const index of indices) {
             for (const neighbour of voronoi.neighbors(index)) {
               selectedKeys.add(neighbour)
             }
           }
         }

         node.data.voronoi = voronoi
         node.data.indices = selectedKeys
         outputs.voronoi = voronoi
         outputs.indices = selectedKeys
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
         const points = inputs.points[0] as Array<number>
         if (!points) {
           node.data.voronoi = null
           return
         }

         const iterations : number =
          node.data.numPoints || (node.data.numPoints as number) > 0
            ? node.data.numPoints as number
            : 1

         const delaunay: Delaunay<number> = Delaunay.from(inputs.points[0] as ArrayLike<Delaunay.Point>)
         const voronoi = delaunay.voronoi([0, 0, 512, 512])

         for (let s = 0; s < iterations; ++s) {
           const sVoronoi = voronoi.delaunay.voronoi([0, 0, 512, 512])
           const points = sVoronoi.delaunay.points as Array<number>

           for (let i = 0; i < points.length; i += 2) {
             const polygon = sVoronoi.cellPolygon(i >> 1)
             if (polygon === null) continue
             const x0 = sVoronoi.delaunay.points[i],
               y0 = points[i + 1]

             const [x1, y1] = d3.polygonCentroid(polygon as Array<[number, number]>)

             points[i] = x0 + (x1 - x0) * 1.0
             points[i + 1] = y0 + (y1 - y0)
           }

           voronoi.delaunay.update()
           // UPDATE!
         }

         node.data.voronoi = voronoi.delaunay.voronoi([0, 0, 512, 512])
         outputs.voronoi = node.data.voronoi
       }
     })

     const selectRandomComponent = new FlowComponent({
       label: 'select random',

       inputs: [
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

       outputs: [
         {
           identifier: 'voronoi',
           label: 'voronoi'
         },
         {
           identifier: 'indices',
           label: 'indices'
         }
       ],

       workerFn: (
         node: NodeData,
         inputs: WorkerInputs,
         outputs: WorkerOutputs
       ) => {
         const voronoi: Voronoi<number> = inputs.voronoi[0] as Voronoi<number>

         if (voronoi) {
           const cells = new Map<number, Delaunay.Polygon>()
           for (const cell of voronoi.cellPolygons()) {
             cells.set(cell.index, cell)
             // cells.push(cell);
           }

           const keys = Array.from(cells.keys())
           let keysLength = keys.length
           const numSelected = (node.data.numPoints as number > keysLength) ? keysLength : (node.data.numPoints as number)

           let selectedKeys = []
           for (let i = 0; i < numSelected; i++) {
             const randomIndex = Math.floor(Math.random() * keysLength)
             const newKey = keys[randomIndex]
             selectedKeys.push(newKey)

             keys.splice(randomIndex, 1)
             keysLength--
           }
           selectedKeys = selectedKeys.sort()

           node.data.voronoi = voronoi.delaunay.voronoi([0, 0, 512, 512])
           node.data.indices = selectedKeys

           outputs.voronoi = voronoi
           outputs.indices = selectedKeys
         }
       }
     })

     const engine = new Rete.Engine('demo@0.1.0')
     var components = [
       mapComponent,
       randomComponent,
       voronoiComponent,
       selectRandomComponent,
       growComponent
     ]
     components.map(c => {
       editor.register(c)
       engine.register(c)
     })

     const mapNode = await components[0].createNode({
       dimension: this.map ? (this.map as RandomMap).dimension : { width: 256, height: 256 }
     })
     mapNode.position = [80, 200]
     editor.addNode(mapNode)

     const randNode = await components[1].createNode({ numPoints: 200, preview: false })
     randNode.position = [80 + 375, 200]
     editor.addNode(randNode)

     const voroniNode = await components[2].createNode({ numPoints: 20, preview: false })
     voroniNode.position = [80 + 800, 200]
     editor.addNode(voroniNode)

     const selectRandomNode = await components[3].createNode({ numPoints: 20, preview: false })
     selectRandomNode.position = [80 + 1210, 200]
     editor.addNode(selectRandomNode)

     const growNode = await components[4].createNode({ numPoints: 20, preview: false })
     growNode.position = [80, 450]
     editor.addNode(growNode)

     editor.connect(
      mapNode.outputs.get('dimension') as Output,
      randNode.inputs.get('dimension') as Input
     )
     editor.connect(
      randNode.outputs.get('points') as Output,
      voroniNode.inputs.get('points') as Input
     )

     editor.connect(
      voroniNode.outputs.get('voronoi') as Output,
      selectRandomNode.inputs.get('voronoi') as Input
     )

     editor.connect(
      selectRandomNode.outputs.get('voronoi') as Output,
      growNode.inputs.get('voronoi') as Input
     )

     editor.connect(
      selectRandomNode.outputs.get('indices') as Output,
      growNode.inputs.get('indices') as Input
     )

     editor.on('previewnode', node => {
       if (this.previewNode instanceof ReteNode) {
         this.previewNode.data.preview = false
       }

       this.previewNode = node
       this.updatePreviewGeometry()
     })

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

         this.updatePreviewGeometry()
       }
     )

     editor.view.resize()
     editor.trigger('process')
   }

   updatePreviewGeometry () {
     if (!(this.previewNode instanceof ReteNode)) {
       return
     }

     const node = this.previewNode as ReteNode
     switch (node.name) {
       case 'random': {
         this.$emit('update:geometry', { points: node.data.points })
         break
       }
       case 'voronoi': {
         this.$emit('update:geometry', node.data.voronoi)
         break
       }
       case 'select random': {
         this.$emit('update:geometry', { voronoi: node.data.voronoi, selected: node.data.indices })
         break
       }
       case 'grow': {
         this.$emit('update:geometry', { voronoi: node.data.voronoi, selected: node.data.indices })
         break
       }

       default: {
         break
       }
     }
   }
}
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
