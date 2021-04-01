<template>
  <Widget title="Form" @remove-widget="removeWidget">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div v-for="(row, row_index) in model.rows" class="row" :key="row_index">
        <div v-for="(column, column_index) in row.columns" :class="columnClass(column)">
          <div v-if="column.element !== null && column.element.type === 'Text'">
            <label>
              {{ getValueOfAttribute(column.element, "label") }}
            </label>
            <q-input
              dark
              placeholder="Text"
              :type="getValueOfAttribute(column.element, 'type')"
              v-model="column.element.value"
            />
          </div>

          <div
            v-if="column.element !== null && column.element.type === 'Button'"
          >
            <q-btn v-if="getValueOfAttribute(column.element, 'hasIcon') === 'true'"
              dark
              :flat="getValueOfAttribute(column.element, 'isHighlighted') !== 'true'"
              :label="getValueOfAttribute(column.element, 'label')"
              :icon="getValueOfAttribute(column.element, 'icon')"
              :type="getValueOfAttribute(column.element, 'type')"
            />
            <q-btn v-else
              :flat="getValueOfAttribute(column.element, 'isHighlighted') !== 'true'"
              :label="getValueOfAttribute(column.element, 'label')"
              :type="getValueOfAttribute(column.element, 'type')"
            />
          </div>
        </div>
      </div>
    </q-form>
  </Widget>
</template>

<script lang="ts">
import Widget from "./Widget.vue";
import { Component } from "vue-property-decorator";

import IModel from "../store/Model";
import { Getter, Action } from "vuex-class";

import axios from "axios";

import {
  Element,
  ElementType,
  Column,
  Grid,
  ServerResponse,
} from "../layouts/FormModel";

@Component({
  name: "FormWidget",
})
export default class FormWidget extends Widget {
  @Action("updateModel")
  updateModel!: (params: IModel) => void;

  model: Grid = { rows: [{ columns: [] }] };

  accept: boolean = false;

  @Getter("model")
  getModel!: (uuid: string) => IModel;

  mounted() {
    this.loadForm();
  }

  /** Calls the server backend to receive the layout json file */
  private loadForm() {
    axios
      .request<Grid>({
        url: "http://localhost:8000/form/load/123",
        transformResponse: (r: ServerResponse) => r.data,
      })
      .then((response) => {
        this.model = Object.assign({}, JSON.parse(response.request.response));
      });
  }

  private getValueOfAttribute(element: Element, name: String): any {
    const attribute = element.attributes.find(
      (attribute) => attribute.name === name
    );

    return attribute === undefined ? undefined : attribute.value;
  }

  onSubmit() {
    const formVariables = new Map<String, String>();
    for (const row of this.model.rows) {
      for (const column of row.columns) {
        if (column.element !== null) {
          const attribute = column.element.attributes.find(
            (attribute) => attribute.name === "variable"
          );

          if (attribute) {
            formVariables.set(attribute.value, column.element.value as String);
          }
        }
      }
    }
    console.log(formVariables);
  }

  onReset() {
    for (const row of this.model.rows) {
      for (const column of row.columns) {
        if (column.element !== null) {
          column.element.value = undefined;
        }
      }
    }
  }

  columnClass(column: Column) {
    let colClass = "blueprint-column col";

    if (column.width) {
      colClass += `-${column.width}`;
    }

    return colClass;
  }
}
</script>

<style lang="scss" scoped>
  .q-btn {
    color: salmon;
  }

  label {
    color: white;
  }

  form {
    padding: 1em;
  }

  .blueprint-column {
    padding-left: 1em;
    padding-right: 1em;
  }
</style>
