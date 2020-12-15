<template>
  <div>
    <div class="q-gutter-md">
        Summer of love
    </div>
    <div class="q-gutter-md">
      <q-input
        dark
        dense
        filled
        v-model="numIterations"
        type="number"
        @input="change($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as d3 from 'd3'
import { Voronoi } from 'd3-delaunay'

export default Vue.extend({
  name: 'VoronoiRelaxationControl',

  props: ['emitter', 'ikey', 'getData', 'putData'],

  data () {
    return {
      numIterations: 2
    }
  },

  methods: {
    change (e: string) {
      this.putData('numIterations', e)
      this.update()
    },
    update () {
      // const numbers = this.getData('amount')
      // if (this.ikey) this.putData(this.ikey, amount);
      this.emitter.trigger('process')
    }
  },
  mounted () {
    // this.putData('number', this.getData(this.ikey))
    this.update()
  }
})
</script>

<style></style>
