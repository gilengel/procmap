<template>
  <div class="vp_renderer">
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title>
        SVG Preview
      </q-toolbar-title>
      <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
      <q-btn flat round dense icon="gamepad" />
    </q-toolbar>

    <canvas ref="renderer" :width="width" :height="height"> </canvas>
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
      }

      if (this.$props.geometry.points !== undefined) {
        this.$props.geometry.points.forEach((point: Array<number>) => {
          // console.log(point[0])
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
</style>
