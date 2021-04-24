<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title shrink style="margin-right: 2em">Page Builder</q-toolbar-title>
          <ToggleButton color="white" selected-color="secondary" icon="las la-link" label="Link to elements together" v-model="linkModeActive" />
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
        <div class="row">
          <div class="col-10">
            <draggable
              handle=".drag-handle"
              class="dragArea list-group"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
            >
              <transition-group
                type="transition"
                :name="!drag ? 'flip-list' : null"
              >
                <LayoutRow
                  dataKey="itemId"
                  dataValue="Row"
                  :linkModeActive="linkModeActive"
                  :deleteRow="deleteRow"
                  :model="row"
                  :rowIndex="row_index"
                  :key="row_index"
                  v-for="(row, row_index) in grid.rows"
                />
              </transition-group>
            </draggable>
          </div>
          <div class="col-2 options-container" ref="options_container">
            <ButtonOptions
              :uuid="selectedElement.uuid"
              :model="selectedElement"
              v-if="selectedElement && selectedElement.type === 'Button'"
            />

            <TextOptions
              :uuid="selectedElement.uuid"
              :model="selectedElement"
              v-if="selectedElement && selectedElement.type === 'Text'"
            />

            <HeadingOptions
            :uuid="selectedElement.uuid"
            :model="selectedElement"
            v-if="selectedElement && selectedElement.type === 'Heading'"
            />
          </div>
        </div>
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn fab icon="add" color="secondary" @click="addRow({
            columns: [
              { width: 12, element: null },
            ]})"
          />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import LayoutRow from "components/ui_builder/LayoutRow.vue";
import ButtonOptions from "components/ui_builder/ButtonOptions.vue";
import TextOptions from "components/ui_builder/TextOptions.vue";
import HeadingOptions from "components/ui_builder/HeadingOptions.vue";
import ToggleButton from "components/ToggleButton.vue";
import { Action, Getter } from "vuex-class";

import { Grid, Element, ElementType, Row } from "../models/Grid";

import draggable from "vuedraggable";

@Component({
  name: "MainLayout",

  components: {
    draggable,
    LayoutRow,
    ButtonOptions,
    TextOptions,
    HeadingOptions,
    ToggleButton
  },
})
export default class UiBuilderLayout extends Vue {
  @Getter("selectedModels")
  getSelectedElements!: () => Array<any>;

  @Getter("grid")
  grid!: () => Grid;

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

  dragOptions = {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost",
  };

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

<style lang='scss'>
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
</style>
