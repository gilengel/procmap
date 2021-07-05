<template>
  <div class="column full-height">
    <q-toolbar>
      <q-toolbar-title shrink style="margin-right: 2em"
        >Widget Builder</q-toolbar-title
      >

      <q-btn-toggle
        v-model="model"
        push
        flat
        toggle-color="primary"
        :options="[
          { value: 'one', slot: 'one' },
          { value: 'two', slot: 'two' },
        ]"
      >
        <template v-slot:one>
          <div>
            <q-icon name="las la-link" />
          </div>
        </template>

        <template v-slot:two>
          <div>
            <q-icon name="las la-project-diagram" />
          </div>
        </template>
      </q-btn-toggle>

      <q-space />
      <StyleSelector />
    </q-toolbar>
    <WidgetLayout v-show="model == 'one'" />

    <div style="flex-grow: 1">
      <ElementDataFlowGraph
        :graph="graph"
        :categories="categories"
        v-show="model == 'two'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import StyleSelector from 'components/StyleSelector.vue';
import WidgetLayout from 'components/ui_builder/WidgetLayout.vue';
import ElementDataFlowGraph from 'components/ui_builder/ElementDataFlowGraph.vue'
import getEmitter from 'src/components/EmitterComponent';

import { ElementType } from '../models/Grid';

import { getRegisteredComponentCategories } from 'src/models/flow/ui_builder/Index';

import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'MainLayout',

  components: {
    StyleSelector,
    WidgetLayout,
    ElementDataFlowGraph,

    //draggable,
    /*
    LayoutRow,
    ButtonOptions,
    TextOptions,
    HeadingOptions,
    ToggleButton,
    ConnectionOptions,
    ElementList,
    OutputOptions,
    FlowEditorComponent,
    WidgetLayout,
    */
  },

  methods: {
    ...mapGetters(['selectedModels', 'grid', 'connections']),
    ...mapActions([
      'addRow',
      'deleteRow',
      'removeAllSelectedElementsAndModels',
      'addSelectedElementAndModel',
      'addElementToColumn',
      'linkTwoElements',
      'unlinkTwoElements',
    ]),
  },

  data() {
    return {
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
      model: 'one',

      linkModeActive: false,
    };
  },

  setup() {
    const emitter = getEmitter();

    const categories = computed(() => {
      return getRegisteredComponentCategories();
    });

    return { categories, emitter };
  },
});
</script>

<style lang="scss" scoped>
$size: 24px;
.ghost {
  //border: solid 2px salmon;
  border-radius: 4px;

  color: $primary;
  //height: $size;

  overflow: collapse;
}

.options-container {
  //border: solid 2px $primary;
  border: 1px solid rgb(100, 100, 100);
}

svg {
  position: absolute;
  height: 100%;
  width: 80%;
}

line {
  stroke: $accent;
  stroke-width: 4px;
}

.q-btn-group {
  > button {
    border-radius: 50% !important;
    width: 42px;
    height: 42px;
  }
}
</style>
