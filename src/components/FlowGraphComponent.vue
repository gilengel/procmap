<template>
  <div class="preview">
    <q-toolbar class="bg-grey-9 text-white">
      <q-toolbar-title>
        Flow
      </q-toolbar-title>
    </q-toolbar>

    <div class="flow" v-resize="onResize">
      <div id="rete" ref="rete"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import '@babel/polyfill'
import Rete, { Engine, NodeEditor } from 'rete'

import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from './render'

import DockPlugin from './dock'

import { RandomMap } from './models'

import { store } from '../store'

import { Action, Getter } from 'vuex-class'
import { getRegisteredComponentCategories } from './flow/Index'

import resize from 'vue-resize-directive'

@Component({
  directives: {
    resize
  }
})
export default class FlowGraphComponent extends Vue {
  @Prop(RandomMap) map: RandomMap | undefined;
  @Prop(Object) geometry: Record<string, unknown> | undefined;

  @Action('render') updateRender!: (value: boolean) => void;
  @Action('saveSystem') saveSystem!: (arg: { system: JSON }) => void;
  @Action('resetSystemImported') resetSystemImported!: () => void;

  @Getter('systemImported') systemImported!: boolean

  editor!: NodeEditor;
  engine!: Engine;

  /*
  protected get systemImported (): boolean {
    return this.$store.getters.systemImported as boolean
  }
  */

  @Watch('systemImported')
  onSystemChanged (imported: boolean) {
    if (imported) {
      this.editor.fromJSON(this.$store.getters.system)
        .then(() => this.resetSystemImported())
        .catch((e) => console.error(e))
    }
  }

  createEditor () {
    const container = this.$refs.rete
    this.editor = new Rete.NodeEditor('demo@0.1.0', container as HTMLElement)

    this.editor.use(ConnectionPlugin)
    this.editor.use(VueRenderPlugin, { store })
    this.editor.use(DockPlugin)
  }

  createCustomEditorEvents () {
    this.editor.bind('previewnode')
  }

  registerComponents () {
    for (const category of getRegisteredComponentCategories()) {
      category.components.map((c) => {
        this.editor.register(c.component)
        this.engine.register(c.component)
      })
    }
  }

  makeComponentDataReactive () {
    for (const category of getRegisteredComponentCategories()) {
      category.components.forEach((c) => {
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

  registerEditorEvents () {
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

    this.editor.on(['process', 'nodecreated', 'connectioncreated'], async () => {
      const data = this.editor.toJSON()
      this.saveSystem({ system: (data as unknown) as JSON })
      await this.engine.abort()
      await this.engine.process(data)

      this.updateRender(true)
    })

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
    this.editor.on(['import'], async () => {
      await this.engine.abort()
      await this.engine.process(this.editor.toJSON())

      this.updateRender(true)
    })

    this.editor.on(['noderemoved'], async () => {
      await this.engine.abort()
      await this.engine.process(this.editor.toJSON())

      this.updateRender(true)
    })

    this.editor.on(['keyup'], async (e: KeyboardEvent) => {
      this.keyUpEvent(e)

      await this.engine.process(this.editor.toJSON())

      this.updateRender(true)
    })
  }

  mounted () {
    this.createEditor()
    this.createCustomEditorEvents()

    this.engine = new Rete.Engine('demo@0.1.0')
    this.registerComponents()

    // Progress is used for longer task to display a progress bar
    this.makeComponentDataReactive()

    this.registerEditorEvents()

    // await this.createDefaultNodes()

    this.editor.view.resize()
    this.editor.trigger('process')
  }

  keyUpEvent (e: KeyboardEvent) {
    if (
      e.code === 'Delete' &&
      (e.target as HTMLElement).tagName.toUpperCase() !== 'INPUT'
    ) {
      this.editor.selected.each((n) => this.editor.removeNode(n))
    }
  }

  width = 512;
  height = 512;

  onResize (e : HTMLElement) {
    this.width = e.scrollWidth // - (e.scrollWidth % 50)
    this.height = e.scrollHeight // - (e.scrollHeight % 50)

    if (this.width !== e.scrollWidth || this.height !== e.scrollHeight) {
      this.editor.view.resize()
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
