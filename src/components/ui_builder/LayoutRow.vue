<template>
  <div class="layout-row">
    <div class="actions">
      <q-btn
        dark
        flat
        round
        color="white"
        icon="las la-arrows-alt"
      />
      <q-btn
        dark
        flat
        round
        color="white"
        icon="las la-trash-alt"
        @click="deleteRow(rowIndex)"
      />
    </div>
    <div class="row" ref="container">
      <LayoutColumn
        dataKey="itemId"
        :columnIndex="col_index"
        :rowIndex="rowIndex"
        :model="column"
        :class="colClass(col_index)"
        :splitColumn="splitColumn"
        :splitDisabled="splitDisabled"
        :deleteColumn="deleteColumn"
        v-for="(column, col_index) in model.columns"
      >
      </LayoutColumn>

      <div
        class="splitter"
        :style="splitterStyleFn(i)"
        v-for="(n, i) in model.columns.length - 1"
        @mousedown="dragMouseDown($event, i)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { Drag } from "../../mixins/Drag";

import LayoutColumn from "./LayoutColumn.vue";

import { Row } from "../../models/Grid";

@Component({
  name: "LayoutRow",

  components: {
    LayoutColumn,
  },
})
export default class LayoutRow extends Vue {
  // Minimal size for one column
  @Prop({
    default: 2,
    validator(x) {
      return x > 0 && x <= 12;
    },
  })
  minColSize!: number;

  // Maximal size for one column
  @Prop({
    default: 11,
    validator(x) {
      return x > 0 && x <= 12;
    },
  })
  maxColSize!: number;

  @Prop({
    validator(x) {
      return typeof x === "number" && x >= 0;
    },
  })
  rowIndex!: number;

  @Prop() model!: Row;

  @Prop() deleteRow!: (i: number) => void

  // Individual column sized
  colSizes = new Array<number>();

  // Individual splitter positions
  splitterPositions = new Array<number>();

  flexColumns = 12;

  selectedSplitter: HTMLElement | null = null;
  selectedSplitterIndex: number = -1;

  positions = {
    clientX: 0,
    clientY: 0,
    movementX: 0,
    movementY: 0,
  };

  private splitDisabled(columnIndex: number) {
    return this.colSizes[columnIndex] < this.minColSize * 2;
  }

  private splitColumn(columnIndex: number) {
    const colSize = this.model.columns[columnIndex].width / 2;
    const leftSize = Math.floor(colSize);
    const rightSize = Math.ceil(colSize);

    this.model.columns[columnIndex].width = leftSize;

    this.model.columns.splice(columnIndex, 0, {
      width: rightSize,
      element: null,
    });

    const splitterPosLeft = this.previosColSize(columnIndex) + leftSize;
    this.splitterPositions.splice(
      columnIndex,
      0,
      (splitterPosLeft / this.flexColumns) * 100
    );
  }

  private deleteColumn(columnIndex: number) {
    const colSize = this.model.columns[columnIndex].width;

    const isLastColumn = columnIndex == this.model.columns.length - 1;

    this.model.columns.splice(columnIndex, 1);
    this.model.columns[
      isLastColumn ? columnIndex - 1 : columnIndex
    ].width += colSize;

    this.splitterPositions.splice(columnIndex, 1);
  }

  previosColSize(index: number): number {
    let result = 0;
    for (let i = 0; i < index; i++) {
      //console.log(`${i} === ${this.model.columns[i].width}`)
      result += this.model.columns[i].width;
    }

    //console.log("-->")
    //console.log(result)

    return result;
  }

  colClass(i: number): string {
    const width = this.model.columns[i].width;
    return `col col-${width}`;
  }

  splitterStyleFn(i: number): string {
    const left = (this.previosColSize(i + 1) / this.flexColumns) * 100;

    return `left: ${left}%`;
  }

  mounted() {
    for (let column of this.model.columns) {
      column;
    }

    const numColumns = this.model.columns.length;
    for (let i = 0; i < numColumns - 1; i++) {
      this.splitterPositions.push(((i + 1) / numColumns) * 100);
    }
    /*
    for (let i = 0; i < this.model; i++) {
      this.colSizes.push(this.flexColumns / this.columns);
    }

    for (let i = 0; i < this.columns - 1; i++) {
      this.splitterPositions.push(((i + 1) / this.columns) * 100);
    }
    */
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

  private calculateExpectedFlexSize(relativeLeft: number): number {
    const containerWidth = this.containerWidth();

    console.log(relativeLeft / containerWidth);
    return Math.ceil((relativeLeft / containerWidth) * this.flexColumns);
  }

  private get affectedColumnSizes(): { [key: string]: number } {
    const left = this.model.columns[this.selectedSplitterIndex].width;
    const right = this.model.columns[this.selectedSplitterIndex + 1].width;
    return {
      left: left,
      right: right,
      complete: left + right,
    };
  }

  private restrictNewColumnSizes(
    newColumnSize: number
  ): { [key: string]: number } {
    const completeColumnSize = this.affectedColumnSizes.complete;

    if (newColumnSize < this.minColSize) {
      newColumnSize = this.minColSize;
    }

    if (newColumnSize > completeColumnSize - 1) {
      newColumnSize = completeColumnSize - 1;
    }

    if (newColumnSize > this.maxColSize) {
      newColumnSize = this.maxColSize;
    }

    let rightColumnSize = completeColumnSize - newColumnSize;
    //console.log(this.affectedColumnSizes);

    if (rightColumnSize < this.minColSize) {
      const difference = this.minColSize - rightColumnSize;
      rightColumnSize = this.minColSize;
      newColumnSize -= difference;
    }

    if (rightColumnSize > this.maxColSize) {
      const difference = this.maxColSize - rightColumnSize;
      rightColumnSize = this.maxColSize;
      newColumnSize -= difference;
    }

    return {
      left: newColumnSize,
      right: rightColumnSize,
    };
  }

  elementDrag(event: MouseEvent) {
    event.preventDefault();

    this.updatePositions(event);
    const positionLeft =
      this.positions.clientX - this.$refs.container.offsetLeft;

    if (this.selectedSplitter) {
      const previousColSizes = this.previosColSize(this.selectedSplitterIndex);
      const flexSize =
        Math.ceil((positionLeft / this.containerWidth()) * this.flexColumns) -
        previousColSizes;

      const newColumnSizes = this.restrictNewColumnSizes(flexSize);

      this.model.columns[this.selectedSplitterIndex].width =
        newColumnSizes.left;
      this.model.columns[this.selectedSplitterIndex + 1].width =
        newColumnSizes.right;
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
.layout-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-left: 2em;
  padding-right: 2em;

  padding-top: 1em;
  padding-bottom: 1em;

  .actions {
    display: flex;
    flex-direction: column;
    visibility: hidden;
  }

  > .row {
    flex-grow: 2;
    border: solid 2px transparent;
  }
}
.layout-row:hover {
  > .actions {
    background: $secondary;
    visibility: visible;
  }
  > .row {
    border: solid 2px $secondary;
  }
}
.row {
  height: 100%;
  position: relative;



  .splitter {
    position: absolute;
    top: 0;
    width: 16px;
    height: 100%;

    //background: rgba(salmon, 0.4);
    cursor: ew-resize;
    transform: translateX(-50%);
  }
}
</style>
