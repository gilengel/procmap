<template>
  <div class="row">
    <div class="col-2">
      <ElementList
        @startDragging="widgetDraggingStarted"
        @stopDragging="widgetDraggingStopped"
      />
      <!--
      <OutputOptions :uuid="selectedElement.uuid" :model="selectedElement" />
      -->
    </div>
    <div class="col-8">
      <draggable
        v-model="rows"
        item-key="id"
        class="list-group"
        ghost-class="ghost"
        @start="drag = true"
        @end="drag = false"
        :component-data="{
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
        }"
      >
        <template #item="{ element: row, index: row_index }">
          <LayoutRow
            dataKey="itemId"
            dataValue="Row"
            :linkModeActive="linkModeActive"
            :deleteRow="this['Grid/deleteRow']"
            :model="row"
            :rowIndex="row_index"
            :key="row_index"
          />
        </template>
      </draggable>
    </div>
    <div class="col-2 options-container" ref="options_container">
      <ButtonOptions
        :uuid="selectedElement.uuid"
        :model="selectedElement"
        v-if="selectedElement && selectedElement.type === 'Button'"
      />

      <TextOptions
        :uuid="selectedElement?.uuid"
        :model="selectedElement"
        v-else-if="selectedElement && selectedElement.type === 'Text'"
      />
      <!--
      <HeadingOptions
        :uuid="selectedElement.uuid"
        :model="selectedElement"
        v-else-if="selectedElement && selectedElement.type === 'Heading'"
      />

      <ConnectionOptions
        :uuid="selectedElement.uuid"
        :model="selectedElement"
        v-else-if="selectedElement.uuid"
      />

      <OutputOptions
        :uuid="selectedElement.uuid"
        :model="selectedElement"
        v-else
      />
      -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { mapGetters, mapActions } from 'vuex';

import LayoutRow from 'components/ui_builder/LayoutRow.vue';
import TextOptions from 'components/ui_builder/TextOptions.vue';
import ButtonOptions from 'components/ui_builder/ButtonOptions.vue';
/*
import OutputOptions from 'components/ui_builder/OutputOptions.vue';

import HeadingOptions from 'components/ui_builder/HeadingOptions.vue';
import ConnectionOptions from 'components/ui_builder/ConnectionOptions.vue';
import ToggleButton from 'components/ToggleButton.vue';
*/
import ElementList from 'components/ui_builder/ElementList.vue';

import { Row, Grid, Element, ElementType } from 'src/models/Grid';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
import draggable from 'vuedraggable';

import getEmitter from 'src/components/EmitterComponent';
import { UI_ELEMENT_REMOVED } from 'src/boot/mitt';
export default defineComponent({
  components: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    draggable,
    ElementList,

    LayoutRow,
    TextOptions,

    ButtonOptions,
    /*
    HeadingOptions,
    ToggleButton,
    ConnectionOptions,

    OutputOptions,
    */
  },

  computed: {
    ...mapGetters(['Grid/grid']),

    rows: {
      get(): Row[] {
        return this.grid.rows;
      },

      set(rows: Row[]) {
        void this.$store.dispatch('Grid/setRows', rows);
      },
    },

    selectedElement(): Element | undefined {
      const elements = this['SelectedElements/selectedModels']() as Element[];

      if (elements.length !== 1) {
        return;
      }

      let element = undefined;
      for (let item of elements) {
        element = item;
      }

      return element;
    },

    grid(): Grid {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return this['Grid/grid'] as Grid;
    },
  },

  /*
  get
  */

  data() {
    return {
      model: 'one',

      linkModeActive: false,
      pageElements: [
        {
          id: 'row',
          label: 'Row',
          icon: 'las la-table',
          type: ElementType.Row,
          defaultData: {},
        },

        {
          id: 'text',
          label: 'Text',
          icon: 'las la-keyboard',
          type: ElementType.Text,
          defaultData: {},
        },

        {
          id: 'button',
          label: 'Button',
          icon: 'las la-paper-plane',
          type: ElementType.Button,
          defaultData: {},
        },
      ],

      drag: false,
      rowDraggingDisabled: false,
    };
  },

  methods: {
    ...mapGetters(['SelectedElements/selectedModels', 'Grid/connections']),
    ...mapActions([
      'Grid/addRow',
      'Grid/deleteRow',
      'Grid/removeAllSelectedElementsAndModels',
      'Grid/removeElementFromColumn',
      'addSelectedElementAndModel',
    ]),

    dragOptions(): Record<string, unknown> {
      return {
        animation: 200,
        group: 'description',
        disabled: this.rowDraggingDisabled,
        ghostClass: 'ghost',
      };
    },

    widgetDraggingStarted() {
      this.rowDraggingDisabled = true;
    },

    widgetDraggingStopped() {
      this.rowDraggingDisabled = false;
    },
  },

  mounted() {
    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Delete' || !this.selectedElement) {
        return;
      }

      this['Grid/removeElementFromColumn'](this.selectedElement?.column)
      .then(() => this.emitter?.emit(UI_ELEMENT_REMOVED, this.selectedElement as Element))
      .catch((e) => console.error(e))
    });
  },

  setup() {
    const emitter = getEmitter();

    return {
      emitter,
    };
  },
});
</script>

<style lang="scss">
$size: 24px;

.options-container {
  //border: solid 2px $primary;
  border: 1px solid rgb(100, 100, 100);
}

line {
  stroke: $accent;
  stroke-width: 4px;
}

.linkage-triangle-preview {
  position: absolute;
  //fill: $accent;
  fill: $accent;
  stroke: $accent;
  stroke-width: 6px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.q-btn-group {
  > button {
    border-radius: 50% !important;
    width: 42px;
    height: 42px;
  }
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: rgba($primary, 0.1);
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
