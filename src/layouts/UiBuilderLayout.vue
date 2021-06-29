<template>
  <div class="column full-height">
    <q-toolbar>
      <q-toolbar-title shrink style="margin-right: 2em"
        >Widget Builder</q-toolbar-title
      >
      <q-space />
      <StyleSelector />
    </q-toolbar>
    <WidgetLayout />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StyleSelector from 'components/StyleSelector.vue';
import WidgetLayout from 'components/ui_builder/WidgetLayout.vue';

import {
  Grid,
  Element,
  ElementType,
  Row,
  Column,
  ElementConnection,
} from '../models/Grid';

//import { createTextElement } from 'src/store/GridModule';

import draggable from 'vuedraggable';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'MainLayout',

  components: {
    StyleSelector,
    WidgetLayout,

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
      model: 'two',

      linkModeActive: false,
    };
  }
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
