<template>
  <div class="flex">
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title>
        Preview
      </q-toolbar-title>
    </q-toolbar>
    <div class="canvas">
      <canvas ref="renderer" v-show="geometry" :width="width" :height="height">
      </canvas>

      <div v-show="!geometry" class="warning">
        <h1 class="text-warning">Node is invalid.</h1>
        <h2 class="text-warning">
          Check that all inputs are connected and values are set
        </h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { color } from 'd3'
import { Voronoi } from 'd3-delaunay'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import { Color } from './models'

@Component
export default class Preview2D extends Vue {
  @Prop(Object) geometry: Record<string, unknown> | undefined;
  @Prop() colors: Map<number, Color> | undefined;

  mounted () {
    const canvasElement = this.$refs.renderer as HTMLCanvasElement
    this.$data.context = canvasElement.getContext('2d') as CanvasRenderingContext2D

    this.repaint()
  }

  async repaint () {
    const geometry: unknown = this.$props.geometry
    if (!geometry) {
      return
    }

    const ctx = this.$data.context as CanvasRenderingContext2D

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.clearRect(0, 0, 8000, 8000)

    if (this.$props.geometry instanceof Voronoi) {
      const voronoi = this.$props.geometry
      ctx.beginPath()
      voronoi.render(ctx)
      ctx.stroke()

      // ctx.beginPath()
      // voronoi.delaunay.renderPoints(ctx)
      // ctx.fill()

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

    if ((geometry as Record<string, unknown>)?.voronoi !== undefined && (geometry as Record<string, unknown>)?.colors != undefined) {
      const voronoi = (geometry as Record<string, unknown>).voronoi as Voronoi<number>
      const colors = (geometry as Record<string, unknown>).colors as Map<number, Color>

      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, 512, 512)

      const t0 = performance.now()
      for (const cell of voronoi.cellPolygons()) {
        if (!colors.has(cell.index)) continue

        ctx.fillStyle = colors.get(cell.index)?.toCanvasString() as string
        ctx.beginPath()
        voronoi.renderCell(cell.index, ctx)
        ctx.fill()
      }

      const t1 = performance.now()
      console.log(`Call to doSomething took ${t1 - t0} milliseconds.`)
    }

    if ((geometry as Record<string, unknown>)?.points !== undefined) {
      ((geometry as Record<string, unknown>).points as Array<Array<number>>).forEach((point: Array<number>) => {
        ctx.beginPath()
        ctx.arc(point[0], point[1], 2, 0, 2 * Math.PI)
        ctx.fill()
      })
    }
  }

  @Watch('geometry')
  onGeometryChanged (/* newValue, oldValue */) {
    this.repaint()
  }

  context: CanvasRenderingContext2D | undefined;
  width = 512;
  height = 512;
}
</script>

<style>
@import "../css/quasar.variables.scss";
.vp_renderer {
  height: 100%;
  /*
  display: flex;
  flex-direction: column;
*/
}

.viewport {
  flex-grow: 2;
}

h1 {
  font-size: 2em;
  padding: 0;
  margin: 0;
}

h2 {
  font-size: 1.5em;
  padding: 0;
  margin: 0;
}

.warning {
  margin-top: 20em;
}

.canvas {
  display: flex;
  flex-grow: 4;
  justify-content: center;
  align-content: center;
}

.flex {
  display: flex;
}
</style>
