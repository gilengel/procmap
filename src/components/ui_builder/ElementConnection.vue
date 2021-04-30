<template>
  <g fill="none">
    <line :x1="model.start.x" :y1="model.start.y" :x2="model.end.x" :y2="model.end.y" v-if="model.start && model.end"/>
    <polygon :points="trianglePoints" />
  </g>
</template>

<script lang="ts">
import { createTrianglePoints } from 'src/helpers/svg';
import { ElementConnection } from 'src/models/Grid';
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'Connection'
})
export default class Connection extends Vue {
  @Prop() readonly model!: ElementConnection;

  get trianglePoints(): string {
    const model = this.model;
    if(!model) {
      return ''
    }

    return createTrianglePoints(model.start?.x, model.start.y, model.end.x, model.end.y)
  }
}
</script>

<style lang="scss" scoped>
h1 {
    color: white;
    font-size: 2em;
    padding: 0;
    margin: 0;
}

polygon {
  fill: $accent;
  stroke: $accent;
  stroke-width: 6px;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
