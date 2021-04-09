<template>
    <div v-if="editable == true"
      @dragover="drag"
      @drop="drop(row, column, $event)"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
  <h1 style="color: salmon">Lobster</h1>
      <div
        :class="{ 'is-active': hover }"
        class="menububble shadow-3 rounded-borders"
      >
        <q-btn
          flat
          stack
          color="white"
          label="Split"
          icon="las la-trash"
          @click="deleteColumn(row, column)"
        />
        <q-btn
          flat
          stack
          color="white"
          label="Split"
          icon="las la-columns"
          @click="splitColumn(row, column)"
          :disable="width < 2 && width != 'auto'"
        />
        <q-btn
          flat
          stack
          color="white"
          label="Join Left"
          icon="las la-object-group"
          @click="joinColumnLeft(row, column)"
          :disable="column == 0"
        />
        <q-btn
          flat
          stack
          color="white"
          label="Join Right"
          icon="las la-object-group"
          @click="joinColumnRight(row, column)"
          :disable="column == maxColumn - 1"
        />
        <q-btn
          flat
          stack
          color="white"
          label="Add Right Column"
          icon="las la-plus-square"
          @click="addColumn(row, column)"
          :disable="column == maxColumn - 1"
        />
        <q-btn
          flat
          stack
          color="white"
          label="Add Bottom Row"
          icon="las la-plus-square"
          @click="addRow(row + 1)"
        />
      </div>

      <slot />
    </div>

    <!-- Static slot -->
    <div v-else>
        <h1 style="color: salmon">Chicken</h1>
      <slot />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'LayoutColumn'
})
export default class LayoutColumn extends Vue {
  @Prop() editable!: boolean;
  @Prop() row!: number;
  @Prop() column!: number;
  @Prop() width!: number | string;

  @Prop() maxColumn!: number
  @Prop() maxRow!: number

  @Prop() drag?: (ev: Event) => void;
  @Prop() drop?: (rowIndex: number, columIndex: number, ev: DragEvent) => void;

  @Prop() splitColumn?: (row: number, column: number) => void;
  @Prop() joinColumnRight?: (row:number, column: number) => void;
  @Prop() joinColumnLeft?: (row:number, column: number) => void;

  @Prop() addColumn?: (column: number) => void;
  @Prop() addRow?: (row:number) => void;

  @Prop() deleteColumn?: (row:number, column: number) => void;

  hover = false;
}
</script>

<style lang="scss" scoped>
  div {
    position: relative;
  }


.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  background: $dark;
  border-radius: 5px;
  top: 0;
  left: 0;
  transform: translateY(-100%);

  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;

  &.is-active {
    opacity: 1;
    visibility: visible;
  }

  > button {
    display: inline-flex;
    background: transparent;
    border: 0;
    color: white;

    border-radius: 3px;
    cursor: pointer;

    &:hover {
      color: rgba(white, 0.1);
    }

    &.is-active {
      color: $primary;
    }
  }

  &__form {
    display: flex;
    align-items: center;
  }

  &__input {
    font: inherit;
    border: none;
    background: transparent;
    color: white;
  }

  .block {
    font-size: 0.8em;
  }
}

$indicator: 16px;
.menububble::after {
  content: "";
  width: $indicator;
  height: $indicator;
  background: $dark;
  left: 50%;
  bottom: -$indicator / 2;
  position: absolute;
  transform: translate(-$indicator / 2, 0em) rotate(45deg);
}
</style>
