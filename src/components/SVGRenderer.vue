<template>
  <div class="flex">
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title>
        SVG Preview
      </q-toolbar-title>
      <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
      <q-btn flat round dense icon="gamepad" />
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
import Vue from 'vue'
import * as d3 from 'd3'
import { Voronoi } from 'd3-delaunay'

export default Vue.extend({
  name: 'SVGRenderer',

  props: ['geometry'],

  watch: {
    geometry: function (newValue, oldValue) {
      this.repaint()
    }
  },

  data () {
    return {
      context: CanvasRenderingContext2D,
      width: 512,
      height: 512
    }
  },

  mounted () {
    const canvasElement = this.$refs.renderer as HTMLCanvasElement
    this.$data.context = canvasElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D

    this.repaint()
  },

  methods: {
    repaint (): void {
      if (!this.$props.geometry) {
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

        /*
        ctx.beginPath()
        voronoi.delaunay.renderPoints(ctx)
        ctx.fill()
        */

        return
      }

      if (this.$props.geometry instanceof Object && this.$props.geometry.voronoi) {
        console.log(this.$props.geometry)

        const voronoi = this.$props.geometry.voronoi
        ctx.beginPath()
        voronoi.render(ctx)
        ctx.stroke()

        ctx.strokeStyle = 'rgba(0, 255, 80, 0.8)'
        this.$props.geometry.selected.forEach((index : number) => {
          ctx.beginPath()
          voronoi.renderCell(index, ctx)
          ctx.stroke()
        })
      }

      if (this.$props.geometry.points !== undefined) {
        this.$props.geometry.points.forEach((point: Array<number>) => {
          ctx.beginPath()
          ctx.arc(point[0], point[1], 2, 0, 2 * Math.PI)
          ctx.fill()
        })
      }
    }
  }
})
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
