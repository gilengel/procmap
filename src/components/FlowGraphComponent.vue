<template>
  <q-page>
    <div id="rete" ref="rete"></div>
    <div class="dock">Hello?</div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import '@babel/polyfill'
import Rete, { Node as ReteNode, NodeEditor } from 'rete'
import { Input, Output } from 'rete/types'

import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from './render'

import DockPlugin from './dock'
import { getRegisteredFlowComponents } from './flow'

import { Dimension, RandomMap } from './models'

@Component
export default class FlowGraphComponent extends Vue {
  @Prop(RandomMap) map: RandomMap | undefined;
  @Prop(Object) geometry: Record<string, unknown> | undefined;
  @Prop({ default: true }) showMinimap: boolean | undefined;

  editor!: NodeEditor;

  @Watch('showMinimap')
  onShowMinimap (val: boolean) {
    const minimapPlugin = this.editor.plugins.get('minimap')

    if (minimapPlugin instanceof Object && 'enable' in minimapPlugin) {
      (minimapPlugin as Record<string, unknown>).enable = val
    }
  }

  previewNode: Record<string, unknown> = {};

  async mounted () {
    const container = this.$refs.rete

    this.editor = new Rete.NodeEditor('demo@0.1.0', container as HTMLElement)

    this.editor.bind('previewnode')
    this.editor.use(ConnectionPlugin)
    this.editor.use(VueRenderPlugin)
    this.editor.use(DockPlugin)

    const engine = new Rete.Engine('demo@0.1.0')
    const components = getRegisteredFlowComponents()
    components.map(c => {
      this.editor.register(c.component)
      engine.register(c.component)
    })

    // Progress is used for longer task to display a progress bar
    components.forEach(c => {
      const data = c.defaultData as Record<string, unknown>

      Vue.set(data, 'progress', 1.0)
      Vue.set(data, 'invalid', false)

      // Convert all default values to vue reactive ones
      for (const i in data) {
        if (!(data[i] instanceof Object)) {
          Vue.set(data, i, data[i])
        }
      }
    })

    const mapNode = await components[0].component.createNode(
      components[0].defaultData
    )
    mapNode.position = [80, 200]
    this.editor.addNode(mapNode)

    const randNode = await components[1].component.createNode(
      components[1].defaultData
    )
    randNode.position = [80 + 375, 200]
    this.editor.addNode(randNode)

    const voroniNode = await components[2].component.createNode({
      iterations: 2
    })
    voroniNode.position = [80 + 800, 200]
    this.editor.addNode(voroniNode)

    const selectRandomNode = await components[3].component.createNode({
      amount: 2
    })
    selectRandomNode.position = [80 + 1210, 200]
    this.editor.addNode(selectRandomNode)

    /*
     const mountainNode = await components[4].createNode({ amount: 20, preview: false, progress: 1 })
     mountainNode.position = [80, 450]
     this.editor.addNode(mountainNode)
     */

    this.editor.connect(
      mapNode.outputs.get('dimension') as Output,
      randNode.inputs.get('dimension') as Input
    )

    this.editor.connect(
      randNode.outputs.get('dimension') as Output,
      voroniNode.inputs.get('dimension') as Input
    )

    this.editor.connect(
      randNode.outputs.get('points') as Output,
      voroniNode.inputs.get('points') as Input
    )

    this.editor.connect(
      voroniNode.outputs.get('voronoi') as Output,
      selectRandomNode.inputs.get('voronoi') as Input
    )

    /*
     this.editor.connect(
      selectRandomNode.outputs.get('voronoi') as Output,
      mountainNode.inputs.get('voronoi') as Input
     )

     this.editor.connect(
      selectRandomNode.outputs.get('indices') as Output,
      mountainNode.inputs.get('indices') as Input
     )
     */

    const listeners = new WeakMap()

    this.editor.on('previewnode', node => {
      if (this.previewNode instanceof ReteNode) {
        this.previewNode.data.preview = false
      }

      this.previewNode = node
      this.updatePreviewGeometry()
    })

    this.editor.on(
      ['process', 'nodecreated', 'connectioncreated'],
      async () => {
        await engine.abort()
        await engine.process(this.editor.toJSON())

        this.updatePreviewGeometry()
      }
    )

    /*
    this.editor.on(["connectioncreate"], async data => {});

    this.editor.on(["warn"], async message => {
      console.log(`warning = ${message}`);
    });

    this.editor.on(["error"], async (args: string | Error) => {
      console.log(args);
    });
*/
    /*
    this.editor.on(["connectionremoved"], async c => {
      // remove cached values in the node
      delete c.input.node.data["old_" + c.input.key];
      delete c.input.node.data[c.input.key];

      await engine.abort();
      await engine.process(this.editor.toJSON());

      this.updatePreviewGeometry();
    });

    this.editor.on(["noderemoved"], async () => {
      await engine.abort();
      await engine.process(this.editor.toJSON());

      this.updatePreviewGeometry();
    });
    */

    this.editor.on(['keyup'], async e => {
      // await engine.abort();

      this.keyUpEvent(e)

      await engine.process(this.editor.toJSON())
    })

    this.editor.view.resize()
    this.editor.trigger('process')
  }

  async keyUpEvent (e: KeyboardEvent) {
    if (
      e.code === 'Delete' &&
      (e.target as HTMLElement).tagName.toUpperCase() !== 'INPUT'
    ) {
      this.editor.selected.each(n => this.editor.removeNode(n))
    }
  }

  updatePreviewGeometry () {
    console.assert(
      this.editor.nodes[0] && this.editor.nodes[0].name === 'map',
      'Your flow has no map node, nothing to display here.'
    )

    const newDimension = this.editor.nodes[0].data.dimension as Dimension
    this.map.dimension.width = newDimension.width
    this.map?.dimension.height = newDimension.height
    this.$emit('update:map.dimension')

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
        this.$emit('update:geometry', {
          voronoi: node.data.voronoi,
          selected: node.data.indices
        })
        break
      }
      case 'grow': {
        this.$emit('update:geometry', {
          voronoi: node.data.voronoi,
          selected: node.data.indices
        })
        break
      }
      case 'mountains': {
        this.$emit('update:geometry', {
          voronoi: node.data.voronoi,
          colors: node.data.colors
        })
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
