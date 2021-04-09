<template>
  <div style="padding: 1em">
    <div class="row" ref="container">
      <div :class="colClass(i)" v-for="(n, i) in columns">
        <h1 style="color: salmon; font-size: 1em">{{colSizes[i]}}</h1>
        <q-btn flat round color="white" icon="las la-trash-alt" />
      </div>

      <div
        class="splitter"
        :style="splitterStyle(i)"
        v-for="(n, i) in columns - 1"
        @mousedown="dragMouseDown($event, i)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "LayoutColumn",
})
export default class LayoutColumn extends Vue {
  @Prop({ default: 2 }) minColSize!: number;
  @Prop({ default: 4 }) maxColSize!: number;

  columns = 4;
  colSizes = new Array<number>();

  flexColumns = 12;

  selectedSplitter: HTMLElement | null = null;
  selectedSplitterIndex: number = -1;

  factor = 100 / this.columns;

  positions = {
    clientX: 0,
    clientY: 0,
    movementX: 0,
    movementY: 0,
  };

  previosColSize(index: number): number {
    let result = 0;
    for (let i = 0; i < index; i++) {
      result += this.colSizes[i];
    }

    return result;
  }

  colClass(i: number): string {
    return `col col-${this.colSizes[i]}`;
  }

  splitterStyle(i: number): string {
    return `left: ${(i + 1) * this.factor}%`;
  }

  mounted() {
    for (let i = 0; i < this.columns; i++) {
      this.colSizes.push(this.flexColumns / this.columns);
    }
  }

  dragMouseDown(event: MouseEvent, index: number) {
    event.preventDefault();
    // get the mouse cursor position at startup:
    this.positions.clientX = event.clientX;
    this.positions.clientY = event.clientY;
    document.onmousemove = this.elementDrag;
    document.onmouseup = this.closeDragElement;

    this.selectedSplitter = event.target as HTMLElement;
    this.selectedSplitterIndex = index;
  }

  private containerWidth(): number {
    return (this.$refs.container as HTMLElement).getBoundingClientRect().width;
  }

  private updatePositions(event: MouseEvent) {
    this.positions.movementX = this.positions.clientX - event.clientX;
    this.positions.movementY = this.positions.clientY - event.clientY;
    this.positions.clientX = event.clientX;
    this.positions.clientY = event.clientY;
  }

  elementDrag(event: MouseEvent) {
    event.preventDefault();

    this.updatePositions(event);

    if (this.selectedSplitter) {
      const el = this.selectedSplitter;
      const relativeLeft = el.offsetLeft - this.positions.movementX;
      const containerWidth = this.containerWidth();

      let flexSize = Math.ceil(
        (relativeLeft / containerWidth) * this.flexColumns
      );

      const leftColSize = this.colSizes[this.selectedSplitterIndex];
      const rightColSize = this.colSizes[this.selectedSplitterIndex + 1];
      const completeSize = leftColSize + rightColSize;

      const previousColSizes = this.previosColSize(this.selectedSplitterIndex);
      flexSize -= previousColSizes;

      if (flexSize < this.minColSize) {
        flexSize = this.minColSize;
      }

      if (flexSize > completeSize - 1) {
        flexSize = completeSize - 1;
      }

    if (flexSize > this.maxColSize) {
        flexSize = this.maxColSize;
      }

      Vue.set(this.colSizes, this.selectedSplitterIndex, flexSize);
      let rightNextSize = completeSize - flexSize;

      Vue.set(this.colSizes, this.selectedSplitterIndex + 1, rightNextSize);

      el.style.left = `${relativeLeft}px`;
    }
  }

  closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    const previousColSizes =
      this.previosColSize(this.selectedSplitterIndex + 1) / this.flexColumns;
    const el = this.selectedSplitter;

    if (el) {
      el.style.left = `${previousColSizes * this.containerWidth()}px`;
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  height: 100%;
  position: relative;

  .col {
    border: solid 1px salmon;
    transition: background 0.3s;
    text-align: center;
  }

  .splitter {
    position: absolute;
    top: 0;
    width: 16px;
    height: 100%;

    //background: rgba(salmon, 0.4);
    cursor: ew-resize;
    transform: translateX(-50%);
  }

  .col:hover {
    background: rgba(salmon, 0.4);
  }
}
</style>
