<template>
  <q-page>
    <div id="rete" ref="rete"></div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import '@babel/polyfill'
import Rete, { Node as ReteNode, NodeEditor } from 'rete'
import { Input, Output } from 'rete/types'

import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from 'rete-vue-render-plugin'

import PointsControl from './PointsControl.vue'

import mapComponent from './flow/Map'
import voronoiComponent from './flow/Voronoi'
import mountainsComponent from './flow/Mountains'
import randomComponent from './flow/Random'
import growComponent from './flow/Grow'
import selectRandomComponent from './flow/SelectRantom'

import { RandomMap, Dimension, Color } from './models'

import {
  FlowPointsControl,
  DimensionControl,
  FlowComponent
} from './FlowGraph'

import * as d3 from 'd3'

import { Delaunay, Voronoi } from 'd3-delaunay'

@Component
export default class FlowGraphComponent extends Vue {
  @Prop(RandomMap) map: RandomMap | undefined;
  @Prop(Object) geometry: Record<string, unknown> | undefined;
  @Prop({ default: true }) showMinimap : boolean | undefined;

  editor: NodeEditor;

  @Watch('showMinimap')
  onShowMinimap (val: boolean) {
    console.log(this.editor.plugins)
    const minimapPlugin = this.editor.plugins.get('minimap')

    if (minimapPlugin instanceof Object && 'enable' in minimapPlugin) {
      minimapPlugin.enable = val
    }
  }

   previewNode: Record<string, unknown> = {};

   async mounted () {
     const container = this.$refs.rete

     this.editor = new Rete.NodeEditor('demo@0.1.0', container as HTMLElement)

     this.editor.bind('previewnode')
     this.editor.use(ConnectionPlugin)
     this.editor.use(VueRenderPlugin)

     const engine = new Rete.Engine('demo@0.1.0')
     var components = [
       mapComponent,
       randomComponent,
       voronoiComponent,
       selectRandomComponent,
       mountainsComponent,
       growComponent
     ]
     components.map(c => {
       this.editor.register(c)
       engine.register(c)
     })

     const mapNode = await components[0].createNode({
       dimension: this.map ? this.map.dimension : { width: 256, height: 256 }
     })
     mapNode.position = [80, 200]
     this.editor.addNode(mapNode)

     const randNode = await components[1].createNode({ numPoints: 200, preview: false, progress: 1 })
     randNode.position = [80 + 375, 200]
     this.editor.addNode(randNode)

     const voroniNode = await components[2].createNode({ numPoints: 20, preview: false, progress: 1 })
     voroniNode.position = [80 + 800, 200]
     this.editor.addNode(voroniNode)

     const selectRandomNode = await components[3].createNode({ numPoints: 20, preview: false, progress: 1 })
     selectRandomNode.position = [80 + 1210, 200]
     this.editor.addNode(selectRandomNode)

     const mountainNode = await components[4].createNode({ numPoints: 20, preview: false, progress: 1 })
     mountainNode.position = [80, 450]
     this.editor.addNode(mountainNode)

     this.editor.connect(
      mapNode.outputs.get('dimension') as Output,
      randNode.inputs.get('dimension') as Input
     )
     this.editor.connect(
      randNode.outputs.get('points') as Output,
      voroniNode.inputs.get('points') as Input
     )

     this.editor.connect(
      voroniNode.outputs.get('voronoi') as Output,
      selectRandomNode.inputs.get('voronoi') as Input
     )

     this.editor.connect(
      selectRandomNode.outputs.get('voronoi') as Output,
      mountainNode.inputs.get('voronoi') as Input
     )

     this.editor.connect(
      selectRandomNode.outputs.get('indices') as Output,
      mountainNode.inputs.get('indices') as Input
     )

     this.editor.on('previewnode', node => {
       if (this.previewNode instanceof ReteNode) {
         this.previewNode.data.preview = false
       }

       this.previewNode = node
       this.updatePreviewGeometry()
     })

     this.editor.on(
       [
         'process',
         'nodecreated',
         'noderemoved',
         'connectioncreated',
         'connectionremoved'
       ],
       async () => {
         await engine.abort()
         await engine.process(this.editor.toJSON())

         this.updatePreviewGeometry()
       }
     )

     this.editor.view.resize()
     this.editor.trigger('process')
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
       case 'mountains': {
         this.$emit('update:geometry', { voronoi: node.data.voronoi, colors: node.data.colors })
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

</style>
