<template>
  <q-page>
    <div id="rete" ref="rete"></div>
    <div class="dock">Hello?</div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import '@babel/polyfill'
import Rete, { Engine, NodeEditor } from 'rete'
import { Input, Output } from 'rete/types'

import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from './render'

import DockPlugin from './dock'
import { getRegisteredFlowComponents } from './flow'

import { RandomMap } from './models'

import { store } from '../store'

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

  createEditor () {
    const container = this.$refs.rete
    this.editor = new Rete.NodeEditor('demo@0.1.0', container as HTMLElement)

    this.editor.use(ConnectionPlugin)
    this.editor.use(VueRenderPlugin, { options: { store } })
    this.editor.use(DockPlugin)
  }

  createCustomEditorEvents () {
    this.editor.bind('previewnode')
  }

  registerComponents (engine: Engine) {
    const components = getRegisteredFlowComponents()
    components.map(c => {
      this.editor.register(c.component)
      engine.register(c.component)
    })
  }

  makeComponentDataReactive () {
    const components = getRegisteredFlowComponents()

    components.forEach(c => {
      const data = c.defaultData
      Vue.set(data, 'progress', 1.0)
      Vue.set(data, 'invalid', false)

      // Convert all default values to vue reactive ones
      for (const i in data) {
        if (!(data[i] instanceof Object)) {
          Vue.set(data, i, data[i])
        }
      }
    })
  }

  async createDefaultNodes () {
    const components = getRegisteredFlowComponents()

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
  }

  registerEditorEvents (engine: Engine) {
    /*
    const listeners = new WeakMap()
    this.editor.on('previewnode', node => {
      if (this.previewNode instanceof ReteNode) {
        this.previewNode.data.preview = false
      }

      this.previewNode = node
      this.updatePreviewGeometry()
    })
    */

    this.editor.on(
      ['process', 'nodecreated', 'connectioncreated'],
      async () => {
        await engine.abort()
        await engine.process(this.editor.toJSON())
      }
    )

    /*
    this.editor.on(['connectionremoved'], async c => {
      // remove cached values in the node
      delete c.input.node.data['old_' + c.input.key]
      delete c.input.node.data[c.input.key]

      await engine.abort()
      await engine.process(this.editor.toJSON())

      this.updatePreviewGeometry()
    })
*/

    this.editor.on(['noderemoved'], async () => {
      await engine.abort()
      await engine.process(this.editor.toJSON())
    })

    this.editor.on(['keyup'], async (e: KeyboardEvent) => {
      this.keyUpEvent(e)

      await engine.process(this.editor.toJSON())
    })
  }

  async mounted () {
    this.createEditor()
    this.createCustomEditorEvents()

    const engine = new Rete.Engine('demo@0.1.0')
    this.registerComponents(engine)

    // Progress is used for longer task to display a progress bar
    this.makeComponentDataReactive()

    this.registerEditorEvents(engine)

    await this.createDefaultNodes()

    this.editor.view.resize()
    this.editor.trigger('process')
  }

  keyUpEvent (e: KeyboardEvent) {
    if (
      e.code === 'Delete' &&
      (e.target as HTMLElement).tagName.toUpperCase() !== 'INPUT'
    ) {
      this.editor.selected.each(n => this.editor.removeNode(n))
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
