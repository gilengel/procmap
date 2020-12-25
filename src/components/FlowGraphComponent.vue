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

import { RandomMap } from './models'

import { store } from '../store'

import { Action } from 'vuex-class'
import { getRegisteredComponentCategories } from './flow/Index'

@Component
export default class FlowGraphComponent extends Vue {
  @Prop(RandomMap) map: RandomMap | undefined;
  @Prop(Object) geometry: Record<string, unknown> | undefined;
  @Prop({ default: true }) showMinimap: boolean | undefined;

  @Action('render') updateRender!: (value: boolean) => void
  @Action('saveSystem') saveSystem!: (arg: { system: JSON }) => void
  @Action('resetSystemImported') resetSystemImported!: () => void

  editor!: NodeEditor;

  protected get systemImported (): boolean {
    return this.$store.getters.systemImported as boolean
  }

  @Watch('systemImported')
  onSystemChanged (imported: boolean) {
    if (imported) {
      this.editor.fromJSON(this.$store.getters.system).then(() => {
        this.resetSystemImported()
      }).catch((e) => {
        console.error(e)
      })
    }
    // this.editor.toJSON()
  }

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
    this.editor.use(VueRenderPlugin, { store } as unknown as void)
    this.editor.use(DockPlugin)
  }

  createCustomEditorEvents () {
    this.editor.bind('previewnode')
  }

  registerComponents (engine: Engine) {
    for (const category of getRegisteredComponentCategories()) {
      category.components.map(c => {
        this.editor.register(c.component)
        engine.register(c.component)
      })
    }
  }

  makeComponentDataReactive () {
    for (const category of getRegisteredComponentCategories()) {
      category.components.forEach(c => {
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
  }

  async createDefaultNodes () {
    const components = getRegisteredComponentCategories()[0].components

    const mapNode = await components[0].component.createNode(
      components[0].defaultData
    )
    mapNode.position = [0, 50]
    this.editor.addNode(mapNode)

    const randNode = await components[1].component.createNode(
      components[1].defaultData
    )
    randNode.position = [80 + 230, 50]
    this.editor.addNode(randNode)

    const voroniNode = await components[2].component.createNode({
      iterations: 2
    })
    voroniNode.position = [80 + 540, 50]
    this.editor.addNode(voroniNode)

    const selectRandomNode = await components[3].component.createNode({
      amount: 2
    })
    selectRandomNode.position = [80 + 830, 50]
    this.editor.addNode(selectRandomNode)

    const mountainNode = await components[4].component.createNode({ amount: 20, preview: false, progress: 1 })
    mountainNode.position = [1200, 50]
    this.editor.addNode(mountainNode)

    const functionNode = await components[5].component.createNode()
    functionNode.position = [300, 300]
    this.editor.addNode(functionNode)

    this.editor.connect(
      mapNode.outputs.get('dimension') as Output,
      randNode.inputs.get('dimension') as Input
    )

    this.editor.connect(
      randNode.outputs.get('dimension') as Output,
      voroniNode.inputs.get('dimension') as Input
    )

    this.editor.connect(
      randNode.outputs.get('point') as Output,
      voroniNode.inputs.get('point') as Input
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
        const data = this.editor.toJSON()
        this.saveSystem({ system: data as unknown as JSON })
        await engine.abort()
        await engine.process(data)

        this.updateRender(true)
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

      this.updateRender(true)
    })

    this.editor.on(['keyup'], async (e: KeyboardEvent) => {
      this.keyUpEvent(e)

      await engine.process(this.editor.toJSON())

      this.updateRender(true)
    })
  }

  mounted () {
    this.createEditor()
    this.createCustomEditorEvents()

    const engine = new Rete.Engine('demo@0.1.0')
    this.registerComponents(engine)

    // Progress is used for longer task to display a progress bar
    this.makeComponentDataReactive()

    this.registerEditorEvents(engine)

    // await this.createDefaultNodes()

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
