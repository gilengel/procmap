<template>
  <div class="layout-row">
    <span style="color: white">{{model}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import LayoutColumn from './LayoutColumn.vue';

import { Row } from '../../models/Grid';

import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'LayoutRow',

  props: {
    minColSize: {
      required: true,
      type: Number,
      default: 2,
      validator: (x: number) => x > 0 && x <= 12,
    },

    // Maximal size for one column
    maxColSize: {
      required: true,
      type: Number,
      default: 11,
      validator: (x: number) => x > 0 && x <= 12,
    },

    rowIndex: {
      required: true,
      type: Number,
      default: 11,
      validator: (x: number) => typeof x === 'number' && x >= 0,
    },

    linkModeActive: {
      required: true,
      type: Boolean,
      default: false,
      validator: (x: number) => typeof x === 'number' && x >= 0,
    },

    model: {
      required: true,
      type: Object as PropType<Row>,
    },
  },

  data() {
    return {
      // Individual column sized
      colSizes: new Array<number>(),

      // Individual splitter positions
      splitterPositions: new Array<number>(),

      flexColumns: 12,

      selectedSplitter: null as HTMLElement | null,
      selectedSplitterIndex: -1,

      positions: {
        clientX: 0,
        clientY: 0,
        movementX: 0,
        movementY: 0,
      },
    };
  },

  computed: {
    affectedColumnSizes(): { left: number, right: number, complete: number } {
      const left = this.model.columns[this.selectedSplitterIndex].width;
      const right = this.model.columns[this.selectedSplitterIndex + 1].width;
      return {
        left: left,
        right: right,
        complete: left + right,
      };
    }
  },

  mounted() {
    /*
    for (let column of this.model.columns) {
      column;
    }

    const numColumns = this.model.columns.length;
    for (let i = 0; i < numColumns - 1; i++) {
      this.splitterPositions.push(((i + 1) / numColumns) * 100);
    }
    */
  },

  methods: {
    ...mapActions([
      'deleteRow',
      'Grid/splitColumn',
      'Grid/deleteColumn',
      'updateColumnWidth',
    ]),
    ...mapGetters([]),

    splitDisabled(columnIndex: number) : boolean {

      return this.colSizes[columnIndex] < this.minColSize * 2;
    },

    previosColSize(index: number): number {
      let result = 0;
      for (let i = 0; i < index; i++) {
        result += this.model.columns[i].width;
      }

      return result;
    },

    colClass(i: number): string {
      const width = this.model.columns[i].width;
      return `col col-${width}`;
    },

    splitterStyleFn(i: number): string {
      const left = (this.previosColSize(i + 1) / this.flexColumns) * 100;

      return `left: ${left}%`;
    },

    dragMouseDown(event: MouseEvent, index: number) {
      event.preventDefault();
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      document.onmousemove = (e) => { this.elementDrag(e) };
      document.onmouseup = () => { this.closeDragElement() };

      this.selectedSplitter = event.target as HTMLElement;
      this.selectedSplitterIndex = index;
    },

    containerWidth(): number {
      return (this.$refs.container as HTMLElement).getBoundingClientRect()
        .width;
    },

    updatePositions(event: MouseEvent) {
      this.positions.movementX = this.positions.clientX - event.clientX;
      this.positions.movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
    },

    calculateExpectedFlexSize(relativeLeft: number): number {
      const containerWidth = this.containerWidth();

      return Math.ceil((relativeLeft / containerWidth) * this.flexColumns);
    },



    restrictNewColumnSizes(newColumnSize: number): { [key: string]: number } {
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
    },

    elementDrag(event: MouseEvent) {
      event.preventDefault();

      this.updatePositions(event);
      const positionLeft =
        this.positions.clientX - (this.$refs.container as HTMLElement).offsetLeft;

      if (this.selectedSplitter) {
        const previousColSizes = this.previosColSize(
          this.selectedSplitterIndex
        );
        const flexSize =
          Math.ceil((positionLeft / this.containerWidth()) * this.flexColumns) -
          previousColSizes;

        const newColumnSizes = this.restrictNewColumnSizes(flexSize);
        void this.updateColumnWidth({
          column: this.model.columns[this.selectedSplitterIndex],
          newWidth: newColumnSizes.left,
        });
        void this.updateColumnWidth({
          column: this.model.columns[this.selectedSplitterIndex + 1],
          newWidth: newColumnSizes.right,
        });
      }
    },

    closeDragElement() {
      console.log('=)=');
      document.onmouseup = null;
      document.onmousemove = null;

      const previousColSizes =
        this.previosColSize(this.selectedSplitterIndex + 1) / this.flexColumns;
      const el = this.selectedSplitter;

      if (el) {
        el.style.left = `${previousColSizes * this.containerWidth()}px`;
      }
    },

    _splitColumn(columnIndex: number) {
      void this['Grid/splitColumn']({ row: this.model, columnIndex: columnIndex })
    },

    _deleteColumn(columnIndex: number) {
      void this['Grid/deleteColumn']({ row: this.model, columnIndex: columnIndex })
    }
  },

  /*
  @Action("deleteRow")
  deleteRow!: (rowIndex: number) => void;

  @Action("splitColumn")
  splitColumn!: (param: { row: Row, columnIndex: number }) => void;

  private

  @Action("deleteColumn")
  deleteColumn!: (param: { row: Row, columnIndex: number }) => void;

  private

  @Action("updateColumnWidth")
  updateColumnWidth!: (params: { column: Column, newWidth: number }) => void;
  */
  /*
  private _updateColumnWidth(width: number) {
    this.updateColumnWidth({ column: this.model, newWidth: width })
  }
*/

  // Minimal size for one column
});
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

.active:hover {
  > .actions {
    background: $primary;
    visibility: visible;
  }
  > .row {
    border: solid 2px $primary;
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
