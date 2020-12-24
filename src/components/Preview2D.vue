<template>
  <div class="preview" v-resize="onResize">
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title>
        Preview
      </q-toolbar-title>
    </q-toolbar>
    <div class="canvas">
      <canvas ref="renderer" v-show="geometry" :width="width" :height="height">
      </canvas>

      <div v-show="!geometry && previewNode" class="warning">
        <q-icon name="las la-skull-crossbones" color="warning" style="font-size: 8em;" />
        <h1 class="text-warning">This is awkward</h1>
        <h2 class="text-warning">
          Check that all inputs are connected and values are set
        </h2>
      </div>

      <div v-show="!previewNode" class="warning">
        <q-icon name="las la-seedling" color="primary" style="font-size: 4em;" />
        <div class="text">
          <h1 class="text-white">At the beginning was a seed</h1>
          <h2 class="text-white">
            Currently is nothing to see here. Click on a <q-icon color="primary"style="font-size: 1.5em;" name="las la-video-slash" /> icon on a node on the left side to view its output.
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Voronoi } from 'd3-delaunay'
import { Vue, Component, Prop, PropSync, Watch } from 'vue-property-decorator'

import { Action } from 'vuex-class'

import { Color, Dimension } from './models'

import { Node as ReteNode } from 'rete'

import * as d3 from 'd3'
import { zoom, ZoomTransform } from 'd3-zoom'
import resize from 'vue-resize-directive'

@Component({
  directives: {
    resize
  }
})
export default class Preview2D extends Vue {
  geometry: Record<string, unknown> | null = null;

  @Prop() colors: Map<number, Color> | undefined;
  @Prop() size!: Dimension;

  protected get previewNode (): ReteNode {
    return this.$store.getters.previewNode as ReteNode
  }

  protected get rerender (): ReteNode {
    return this.$store.getters.render as boolean
  }

  width = 512;
  height = 512;

  updateElementSize () {
    const canvasElement = this.$refs.renderer as HTMLCanvasElement
    this.width = canvasElement.parentElement?.scrollWidth as number
    this.height = canvasElement.parentElement?.scrollHeight as number
  }

  enablePanAndZoom () {
    const canvasElement = this.$refs.renderer as HTMLCanvasElement
    d3.select(canvasElement).call(zoom<HTMLCanvasElement, unknown>()
      .extent([[0, 0], [this.width, this.height]])
      .translateExtent([[0, 0], [this.width, this.height]])

      .on('zoom', ({ transform }) => this.zoomed(transform)))
  }

  mounted () {
    const canvasElement = this.$refs.renderer as HTMLCanvasElement
    this.context = canvasElement.getContext('2d') as CanvasRenderingContext2D

    this.width = canvasElement.parentElement?.scrollWidth as number
    this.height = canvasElement.parentElement?.scrollHeight as number

    this.repaint()
  }

  zoomed (transform : ZoomTransform) {
    const ctx = this.context as CanvasRenderingContext2D

    ctx.save()
    ctx.clearRect(0, 0, this.size.width, this.size?.height)
    ctx.translate(transform.x, transform.y)
    ctx.scale(transform.k, transform.k)

    this.repaint()

    ctx.fill()
    ctx.restore()
  }

  onResize (e : HTMLElement) {
    this.width = e.scrollWidth - (e.scrollWidth % 50)
    // this.height = e.scrollHeight - (e.scrollHeight % 50)

    this.repaint()

    // this.width = canvasElement.parentElement.scrollWidth
    // this.height = canvasElement.parentElement?.scrollHeight
  }

  getGeometryOfSelectedNode () {
    if (!(this.previewNode instanceof ReteNode)) {
      return
    }

    const node = this.previewNode

    if (node === undefined) {
      return
    }

    switch (node.name) {
      case 'random': {
        this.geometry = { points: node.data.points }
        break
      }
      case 'voronoi': {
        this.geometry = node.data.voronoi
        break
      }
      case 'select random': {
        this.geometry = {
          voronoi: node.data.voronoi,
          selected: node.data.indices
        }
        break
      }
      case 'grow': {
        this.geometry = {
          voronoi: node.data.voronoi,
          selected: node.data.indices
        }

        break
      }
      case 'mountains': {
        this.geometry = {
          voronoi: node.data.voronoi,
          colors: node.data.colors
        }

        break
      }
      default: {
        break
      }
    }
  }

  repaint () {
    const ctx = this.context as CanvasRenderingContext2D

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.clearRect(0, 0, 8000, 8000)

    const geometry: unknown = this.geometry

    if (this.previewNode === undefined) {
      return
    }

    if (geometry instanceof Voronoi) {
      const voronoi = geometry
      ctx.beginPath()
      voronoi.render(ctx)
      ctx.stroke()

      return
    }

    if ((geometry as Record<string, unknown>)?.voronoi !== undefined && (geometry as Record<string, unknown>)?.selected !== undefined) {
      const voronoi: Voronoi<number> = (geometry as Record<string, unknown>).voronoi as Voronoi<number>
      const selected: Array<number> = (geometry as Record<string, unknown>).selected as Array<number>
      ctx.beginPath()
      voronoi.render(ctx)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(0, 255, 80, 0.8)'
      selected.forEach((index : number) => {
        ctx.beginPath()
        voronoi.renderCell(index, ctx)
        ctx.stroke()
      })
    }

    if ((geometry as Record<string, unknown>)?.voronoi !== undefined && (geometry as Record<string, unknown>)?.colors !== undefined) {
      const voronoi = (geometry as Record<string, unknown>).voronoi as Voronoi<number>
      const colors = (geometry as Record<string, unknown>).colors as Map<number, Color>

      const t0 = performance.now()
      for (const cell of voronoi.cellPolygons()) {
        if (!colors.has(cell.index)) continue

        ctx.fillStyle = colors.get(cell.index)?.toCanvasString() as string
        ctx.beginPath()
        voronoi.renderCell(cell.index, ctx)
        ctx.fill()
      }

      const t1 = performance.now()
    }

    if ((geometry as Record<string, unknown>)?.points !== undefined) {
      ((geometry as Record<string, unknown>).points as Array<Array<number>>).forEach((point: Array<number>) => {
        ctx.beginPath()
        ctx.arc(point[0], point[1], 2, 0, 2 * Math.PI)
        ctx.fill()
      })
    }
  }

  @Watch('previewNode')
  onPreviewNodeChanged (/* newValue, oldValue */) {
    this.getGeometryOfSelectedNode()

    this.repaint()
  }

  @Action('render') updateRender!: (value: boolean) => void

  @Watch('rerender')
  onRerender (newValue:boolean) {
    if (newValue) {
      this.getGeometryOfSelectedNode()

      this.repaint()

      this.updateRender(false)
    }
  }

  context: CanvasRenderingContext2D | undefined;
}
</script>

<style lang="scss">
@import "../css/quasar.variables.scss";

.preview {
  display: flex;
  flex-direction: column;

  overflow: hidden;
}

.viewport {
  flex-grow: 2;
}

h1 {
  font-size: 1.5em;
  padding: 0;
  margin: 0;

  padding: 0;
  margin: 0;
  line-height: 2em;
}

h2 {
  font-size: 1.0em;
  padding: 0;
  margin: 0;

  padding: 0;
  margin: 0;
  line-height: 2em;
}

.warning {

  display: flex;
  align-items: center;

  margin-left: 4em;
  margin-right: 4em;

  div {
    padding-left: 2em;
    padding-right: 2em;
  }

  h1 {
  }
}

  h1 {
    font-size: 2em;
    flex-grow: 2;
  }

.canvas {
  flex-grow: 2;
  display: flex;
}

.flex {
  display: flex;
}
</style>
