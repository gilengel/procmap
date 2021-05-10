<template>
    <div class="column full-height">
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title shrink style="margin-right: 2em">Widget Builder</q-toolbar-title>

          <q-btn-toggle
            v-model="model"
            push
            flat
            toggle-color="secondary"
            :options="[
                {value: 'one', slot: 'one'},
                {value: 'two', slot: 'two'},
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

          <ToggleButton
            color="white"
            selected-color="secondary"
            icon="las la-link"
            label="Link to elements together"
            v-model="linkModeActive"
          />

          <q-space />
          <q-btn
            style="
              background: salmon;
              color: white;
              margin-top: 8px;
              margin-bottom: 8px;
            "
            label="Save Layout"
          />
        </q-toolbar>
        <WidgetLayout v-if="model == 'one'" />
        <WidgetFlow v-if="model == 'two'" />
    </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import LayoutRow from "components/ui_builder/LayoutRow.vue";
import ButtonOptions from "components/ui_builder/ButtonOptions.vue";
import OutputOptions from "components/ui_builder/OutputOptions.vue";
import TextOptions from "components/ui_builder/TextOptions.vue";
import HeadingOptions from "components/ui_builder/HeadingOptions.vue";
import Connection from "components/ui_builder/ElementConnection.vue";
import ConnectionOptions from "components/ui_builder/ConnectionOptions.vue";
import ToggleButton from "components/ToggleButton.vue";
import ElementList from "components/ui_builder/ElementList.vue";
import WidgetFlow from "components/ui_builder/WidgetFlow.vue";
import WidgetLayout from "components/ui_builder/WidgetLayout.vue";
import { Action, Getter } from "vuex-class";

import {
  Grid,
  Element,
  ElementType,
  Row,
  ElementConnection,
} from "../models/Grid";

import draggable from "vuedraggable";

@Component({
  name: "MainLayout",

  components: {
    draggable,
    LayoutRow,
    ButtonOptions,
    TextOptions,
    HeadingOptions,
    ToggleButton,
    Connection,
    ConnectionOptions,
    ElementList,
    OutputOptions,
    WidgetFlow,
    WidgetLayout,
  },
})
export default class UiBuilderLayout extends Vue {
  @Getter("selectedModels")
  getSelectedElements!: () => Array<any>;

  @Getter("grid")
  grid!: () => Grid;

  @Getter("connections")
  connections!: () => Array<ElementConnection>;

  @Action("addRow")
  addRow!: (row: Row) => void;

  @Action("deleteRow")
  deleteRow!: (rowIndex: number) => void;

  @Action("removeAllSelectedElementsAndModels")
  clearSelectedElements!: () => void;

  @Action("addSelectedElementAndModel")
  addSelectedElement!: (param: {
    element: string;
    model: any;
    clearPreviousSelected: boolean;
  }) => void;

  model = "two";

  linkModeActive: boolean = false;

  get selectedElement(): Element | {} {
    const elements = this.getSelectedElements;

    if (elements.length !== 1) {
      return {};
    }

    let element = null;
    for (let item of elements) {
      element = item;
    }

    return element;
  }

  pageElements = [
    {
      id: "row",
      label: "Row",
      icon: "las la-table",
      type: ElementType.Row,
      defaultData: {},
    },

    {
      id: "text",
      label: "Text",
      icon: "las la-keyboard",
      type: ElementType.Text,
      defaultData: {},
    },

    {
      id: "button",
      label: "Button",
      icon: "las la-paper-plane",
      type: ElementType.Button,
      defaultData: {},
    },
  ];

  drag = false;
  rowDraggingDisabled = false;

  get dragOptions() {
    return {
      animation: 200,
      group: "description",
      disabled: this.rowDraggingDisabled,
      ghostClass: "ghost",
    };
  }

  widgetDraggingStarted() {
    this.rowDraggingDisabled = true;
  }

  widgetDraggingStopped() {
    this.rowDraggingDisabled = false;
  }
  /*
  dragOptions = {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost",
  };
  */

  mounted() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Delete") {
        ((this.getSelectedElements as unknown) as Set<Element>).forEach(
          (element: Element) => {
            //element.column.element = null;
          }
        );
      }
    });
  }
}
</script>

<style lang='scss' scoped>

$size: 24px;
.ghost {
  //border: solid 2px salmon;
  border-radius: 4px;

  color: $secondary;
  //height: $size;

  overflow: collapse;
}

.options-container {
  //border: solid 2px $secondary;
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

  > button:not(:last-of-type) {
    //margin-right: 0.5em;
  }
}
</style>
