<template>
  <div class="flow-graph-container column">
    <q-toolbar>
      <q-toolbar-title>
        {{title}}
      </q-toolbar-title>
    </q-toolbar>
    <div class="flow" >
      <div id="rete" ref="rete"></div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import 'regenerator-runtime/runtime';

import Rete, { NodeEditor } from 'rete'
import { Data } from 'rete/types/core/data'
import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from 'src/plugins/rete-vue/Index'
import DockPlugin from 'src/plugins/rete-dock/Index'
import { MetaFlowCategory } from 'src/components/flow/components/Index'
//import resize from 'vue-resize-directive'

const EDITOR_ID = 'demo@0.1.0';

export default defineComponent({
  props: {
    nodes: {
        type: Array as PropType<Array<MetaFlowCategory>>,
        default: () => []
        //required: true,
        //readonly: true
    },

    title: {
      default: 'Editor',
      //validator: (x) => { return typeof x === 'string' && x.length > 0
    }
  },

  data() {
    return {
      width: 0,
      height: 0,
      editor: undefined as undefined | NodeEditor,
      engine: new Rete.Engine(EDITOR_ID)
    }
  },

  mounted() {

    this.createEditor()
    this.createCustomEditorEvents()
    this.registerComponents()
    this.registerEditorEvents()

    if(this.editor) {
      this.editor.view.resize()
      this.editor.trigger('process');
    }

  },

  methods: {

    createEditor () {
      const container = this.$refs.rete
      this.editor = new Rete.NodeEditor('demo@0.1.0', container as HTMLElement)
      this.editor.use(ConnectionPlugin)
      this.editor.use(VueRenderPlugin)
      this.editor.use(DockPlugin)
    },

    createCustomEditorEvents () {
      if(!this.editor) {
        return;
      }

      this.editor.bind('previewnode')
    },

    registerComponents () {
      for (const category of this.nodes) {
        category.components.map((c) => {
          this.editor?.register(c.component)
          this.engine.register(c.component)
        })
      }
    },

    registerEditorEvents () {
      this.editor?.on(['process', 'nodecreated', 'noderemoved', 'connectioncreated', 'connectionremoved'], async () => {
        await this.engine.abort()
        await this.engine.process(this.editor?.toJSON() as Data)
      })
      this.editor?.on(['import'], async () => {
        await this.engine.abort()
        await this.engine.process(this.editor?.toJSON() as Data)
      })
      this.editor?.on(['keyup'], async (e: KeyboardEvent) => {
        this.keyUpEvent(e)
        await this.engine.process(this.editor?.toJSON() as Data)
      })
    },

    keyUpEvent (e: KeyboardEvent) {
      if (
        e.code === 'Delete' &&
        (e.target as HTMLElement).tagName.toUpperCase() !== 'INPUT'
      ) {
        this.editor?.selected.each((n) => this.editor?.removeNode(n))
      }
    },

    onResize (e : HTMLElement) {
      this.width = e.scrollWidth // - (e.scrollWidth % 50)
      this.height = e.scrollHeight // - (e.scrollHeight % 50)
      if (this.width !== e.scrollWidth || this.height !== e.scrollHeight) {
        this.editor?.view.resize()
      }
    }

  }
})
</script>

<style lang="scss" scoped>

.flow-graph-container {
  min-height: 880x;
}
.flow {
  //position: absolute;
  min-height: 800px !important;
}

</style>

