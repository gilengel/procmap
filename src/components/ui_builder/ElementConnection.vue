<template>
    <div class="line" :style="style">
        <div class="triangle-wrapper">
            <div class="triangle"></div>
        </div>

        <q-btn outline dark round color="accent" icon="las la-tools" :style="clear_style" />
    </div>
</template>

<script lang="ts">
import { createTrianglePoints } from 'src/helpers/svg';
import { ElementConnection } from 'src/models/Grid';
import { mixins } from "vue-class-component";
import { Component, Prop } from 'vue-property-decorator'

import { colors, extend } from 'quasar'
import { Selectable } from 'src/mixins/Selectable';

@Component({
  name: 'Connection'
})
export default class Connection extends mixins(Selectable) {
  @Prop() readonly model!: ElementConnection;

  get styleTriangle(): string {
      if(!this.model.start || !this.model.end) {
          return '';
      }

      const deg = Math.atan2(this.model.end.y - this.model.start.y, this.model.end.x - this.model.start.x) * 180 / Math.PI;
      return `transform: rotate(${deg}deg) translate(${this.model.start.x}px, ${this.model.start.y}px`;
  }

  private get rotation(): number {  
      if(!this.model.start || !this.model.end) {
          return 0;
      }

    return Math.atan2(this.model.end.y - this.model.start.y, this.model.end.x - this.model.start.x) * 180 / Math.PI;
  }

  get style(): string {
      if(!this.model.start || !this.model.end) {
          return '';
      }

      const a = document.getElementsByTagName("svg")[0];
      const top = a.getBoundingClientRect().top

      
      const result = `left: ${this.model.start.x}px; top: ${this.model.start.y + top * 2}px; width: ${this.model.end.x - this.model.start.x}px;` +
             `transform: rotate(${this.rotation}deg)`;

    return result
  }

  get clear_style(): string {
      console.log(colors.getBrand('dark'))
      return `z-index: 999; left: calc(50% - 16px); top: -16px; background: ${colors.getBrand('dark')} !important; transform: rotate(${-this.rotation}deg)`
  }

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
.line {
    position: absolute;
    left: 0;
    top: 0;

    height: 16px;

    z-index: 9;
}
.line::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 4px;

    border-radius: 2px;

    background: $accent;
    transform: translateY(-2px);
}

.line:hover .triangle-wrapper {
  //animation-name: example;
  //animation-duration: 4s;   
  //animation-iteration-count: infinite; 
}

.triangle-wrapper {
    position: absolute;
    transform: rotate(90deg);
    z-index: 999;
    right: 0;
}

@keyframes example {
  from {
      left: 0%;
  }
  to {
      left: calc(100% - 1em);
  }
}

.triangle {
	position: relative;
	background-color: $accent;
	text-align: left;
}
.triangle:before,
.triangle:after {
	content: '';
	position: absolute;
	background-color: inherit;
}
.triangle,
.triangle:before,
.triangle:after {
	width:  1em;
	height: 1em;
	border-top-right-radius: 30%;
}

.triangle {
	transform: rotate(-60deg) skewX(-30deg) scale(1,.866);
}
.triangle:before {
	transform: rotate(-135deg) skewX(-45deg) scale(1.414,.707) translate(0,-50%);
}
.triangle:after {
	transform: rotate(135deg) skewY(-45deg) scale(.707,1.414) translate(50%);
}
</style>
