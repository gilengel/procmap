<template>
  <div class="layout-row-divider">
    <div class="highlight" v-if="isHighlighted"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { Drop } from "../../mixins/Drop";

@Component({
  name: "LayoutRowDivider",
})
export default class LayoutRowDivider extends mixins(Drop) {
  /*
  @Prop({
    validator(x) {
      return typeof x === "number" && x >= 0;
    }
  })
  rowIndex!: number;
  */

  isHighlighted = false;

  dragEnter(evt: DragEvent) {
    this.isHighlighted = true;
  }

  dragLeave(evt: DragEvent) {
    this.isHighlighted = false;
  }
}
</script>

<style lang="scss" scoped>
$size: 6px;
.layout-row-divider {
  position: relative;
  height: $size * 5;

  outline: solid 2px transparent !important;
}

.highlight {
  position: absolute;
  z-index: -1;

  left: 0;
  right: 0;

  margin-left: $size * 2;
  margin-right: $size * 2;
  margin-top: $size * 2;
  margin-bottom: $size;
  height: $size;
  background: $secondary;
}

.highlight::before {
  position: absolute;

  content: " ";

  width: $size;
  height: $size;

  left: -$size / 2;

  border-radius: 50% 50%;

  background: $secondary;
}

.highlight::after {
  position: absolute;

  content: " ";

  width: $size;
  height: $size;
  right: -$size / 2;

  border-radius: 50% 50%;

  background: $secondary;
}
</style>
