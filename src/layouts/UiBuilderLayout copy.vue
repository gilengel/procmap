<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>Page Builder</q-toolbar-title>
        </q-toolbar>
        <div class="row">
          <div class="col-2">
            <q-list dark bordered separator>
              <DraggableListItem
                dataKey="itemId"
                :dataValue="element.label"
                :dropTargetClass="element.type === 'Row' ? ['drop-zone'] : ['col']"
                :element="element"
                v-for="element in pageElements"
                :key="element.id"
              />
            </q-list>
          </div>
          <Layout :model="model" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { GridLayout, GridItem } from "vue-grid-layout";
import Layout from "components/ui_builder/Layout.vue";
import LayoutRow from "components/ui_builder/LayoutRow.vue";
import LayoutRowDivider from "components/ui_builder/LayoutRowDivider.vue";
import LayoutColumn from "components/ui_builder/LayoutColumn.vue";
import DraggableListItem from "components/ui_builder/DraggableListItem.vue";
import { Action } from "vuex-class";
import {
  Grid,
  Element,
  ElementType,
  ElementAttributeType,
} from "../models/Grid";

import IModel from "../store/Model";

import { Drop } from "../mixins/Drop";

@Component({
  name: "MainLayout",

  components: {
    GridLayout,
    GridItem,
    Layout,
    LayoutRow,
    LayoutRowDivider,
    LayoutColumn,
    DraggableListItem,
  },
})
export default class UiBuilderLayout extends mixins(Drop) {
  @Action("updateModel")
  updateModel!: (params: IModel) => void;

  rows: number = 0;
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

  model: Grid = {
    rows: [
      {
        columns: [
          { width: 4, element: null },
          { width: 8, element: null },
        ],
      },

      {
        columns: [
          { width: 4, element: null },
          { width: 4, element: null },
          { width: 4, element: null },
        ],
      },

      {
        columns: [
          { width: 6, element: null },
          { width: 6, element: null },
        ],
      },
    ],
  };

  parseElementAttributes(element: Element) {
    for (const attribute of element.attributes) {
      if (attribute.type === ElementAttributeType.Boolean) {
        attribute.value = attribute.value === "true";
      }

      if (attribute.type === ElementAttributeType.Number) {
        attribute.value = attribute.value.includes(".")
          ? parseFloat(attribute.value)
          : parseInt(attribute.value);
      }
    }
  }

  startDrag(evt: DragEvent, item: MetaFlowComponent) {
    if (evt.dataTransfer === null) {
      return;
    }

    evt.dataTransfer.dropEffect = "move";
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("itemId", item.id);
  }


}
</script>

<style lang='scss'>
.drop-zone {
  height: 800px !important;
}
.drop-allowed {
  outline: solid 2px salmon;

}
</style>
