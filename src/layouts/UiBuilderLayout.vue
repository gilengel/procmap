<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>View Builder</q-toolbar-title>
          <q-btn
            flat
            round
            dense
          >
            <q-btn
              round
              color="primary"
              icon="las la-save"
              @click="saveForm"
            />
          </q-btn>
        </q-toolbar>
        <div class="row">
          <div class="col-2">
            <q-list padding>
              <q-item
                v-for="element in uiElements"
                :key="element"
                draggable="true"
                @dragstart="dragstart(element, $event)"
              >
                <q-item-section>{{ element }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-8">
            <div class="ui_preview">
              <div
                v-for="(row, row_index) in model.rows"
                class="row"
                :key="row_index"
              >
                <LayoutColumn
                  v-for="(column, column_index) in row.columns"
                  :key="column_index"
                  :class="columnClass(column)"
                  :drag="dragHandler"
                  :drop="drop"
                  :split-column="splitColumn"
                  :join-column-left="joinColumnLeft"
                  :join-column-right="joinColumnRight"
                  :row="row_index"
                  :column="column_index"
                  :max-column="row.columns.length"
                  :width="column.width"
                  :max-row="model.rows.length"
                  :add-row="addRow"
                  :add-column="addColumn"
                >

                  <TextElement
                    v-if="column.element !== null && column.element.type === 'Text'"
                    @click.native="showOptions('text')"
                  />

                  <ButtonElement
                    :uuid="column.element.uuid"
                    v-if="column.element !== null && column.element.type === 'Button'"
                    @click.native="showOptions(column.element)"
                  />

                  <h1
                    class="text-subtitle1"
                    v-if="column.element && column.element === 'caption'"
                  >
                    Caption
                  </h1>
                </LayoutColumn>
              </div>
            </div>
          </div>
          <div
            class="col-2 element_options"
            ref="options_container"
          >
            <ButtonOptions
              :uuid="selectedElement.uuid"
              v-if="selectedElement"
            />
          </div>
        </div>

        <q-btn
          flat
          round
          color="white"
          icon="las la-plus"
          @click="addRow"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import TextOptions from "../components/ui_builder/TextOptions.vue";
import TextElement from "../components/ui_builder/TextElement.vue";

import ButtonOptions, {
  Button 
} from "../components/ui_builder/ButtonOptions.vue";

import ButtonElement from "../components/ui_builder/ButtonElement.vue";
import LayoutColumn from "../components/ui_builder/LayoutColumn.vue";

import IModel from "../store/Model";
import { Getter, Action } from "vuex-class";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";

import copy from '../components/Copy'

enum ElementType {
  Button = "Button",
  Text = "Text"
}

interface Element {
  uuid: String;
  type: ElementType;
  attributes: Array<ElementAttribute>;
}

enum ElementAttributeType {
  Number = "Number",
  String = "String",
  Boolean = "Boolean"
}

interface ElementAttribute {
  name: string;
  type: ElementAttributeType;
  value: any;
}

interface Column {
  width?: number | string;
  element: Element | null;
}

interface Row {
  columns: Array<Column>;
}

interface Grid {
  rows: Array<Row>;
}

interface ServerResponse {
  data: Grid;
}

enum Direction {
  Left = 0,
  Right = 1
}

@Component({
  name: "MainLayout",

  components: {
    TextElement,
    TextOptions,
    ButtonElement,
    ButtonOptions,
    LayoutColumn
  }
})
export default class UiBuilderLayout extends Vue {
  @Action("updateModel")
  updateModel!: (params: IModel) => void;

  MAX_COLUMN_COUNT = 4;

  selectedElement: Element | null = null;

  model: Grid = {
    rows: [
      {
        columns: [
          { width: 3, element: null },
          { width: 3, element: null }
        ]
      }
    ]
  };

  hover = false;

  uiElements: Array<ElementType> = [
      ElementType.Button,
      ElementType.Text
    ];

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
        transformResponse: (r: ServerResponse) => r.data
      })
      .then(response => {
        this.model = Object.assign({}, JSON.parse(response.request.response));
        for (const row of this.model.rows) {
          for (const column of row.columns) {
            if (column.element !== null) {
                console.log(column.element.uuid);

              this.updateModel({
                uuid: column.element.uuid,
                model: column.element
              });
            }
          }
        }
      });
  }

  private saveForm() {
    const model = copy(this.model) as Grid;
    for (const row of model.rows) {
      for (const column of row.columns) {
        if (column.element !== null) {
            column.element = copy(this.getModel(column.element.uuid));

            for(const attribute of column.element.attributes) {
                attribute.value = ''+attribute.value
            }
        }
      }
    }

    
    axios
      .post("http://localhost:8000/form/save", model)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  private clearOptions() {
    const el = this.$refs.options_container as HTMLElement;

    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  private getOptionName(element: string) {
    return `${element.charAt(0).toUpperCase()}${element.slice(1)}Options`;
  }

  private showOptions(element: Element) {
    this.selectedElement = element;
  }

  columnClass(column: Column) {
    let colClass = "blueprint-column col";

    if (column.width) {
      colClass += `-${column.width}`;
    }

    return colClass;
  }

  addRow(index: number | undefined) {
    if (index === undefined) {
      index = this.model.rows.length;
    }

    this.model.rows.splice(index, 0, {
      columns: [
        { width: 3, element: null },
        { width: 3, element: null }
      ]
    });
  }

  addColumn() {
    for (const row of this.model.rows) {
      row.columns.push({ width: 1, element: null });
    }
  }

  splitColumn(rowIndex: number, columnIndex: number) {
    const columns = this.model.rows[rowIndex].columns;
    const column = columns[columnIndex];

    const width = column.width;
    const halfWidth = width / 2.0;

    let firstWidth: number | string = Math.ceil(halfWidth);
    let secondWidth: number | string = Math.floor(halfWidth);

    if (firstWidth === 0 || secondWidth === 0) {
      firstWidth = "auto";
      secondWidth = "auto";
    }

    column.width = firstWidth;
    this.model.rows[rowIndex].columns.splice(columnIndex, 0, {
      width: secondWidth,
      element: null
    });
  }

  joinColumns(rowIndex: number, columnIndex: number, direction: Direction) {
    const columns = this.model.rows[rowIndex].columns;
    const column = columns[columnIndex];
    const offset = direction === Direction.Left ? -1 : 1;

    console.log(direction);
    const otherColumn = columns[columnIndex + offset];

    let firstWidth: number | string | undefined = column.width;
    let secondWidth: number | string | undefined = otherColumn.width;

    let width: number | string = "auto";
    if (firstWidth === "auto" || secondWidth === "auto") {
      firstWidth = "auto";
      secondWidth = "auto";
    }

    if (
      firstWidth !== undefined &&
      secondWidth !== undefined &&
      (firstWidth >= 0 || secondWidth >= 0)
    ) {
      width = (firstWidth as number) + (secondWidth as number);
    }

    if (otherColumn.element) {
      column.element = otherColumn.element;
    }

    column.width = width;
    this.model.rows[rowIndex].columns.splice(columnIndex + offset, 1);
  }

  joinColumnLeft(rowIndex: number, columnIndex: number) {
    this.joinColumns(rowIndex, columnIndex, Direction.Left);
  }

  joinColumnRight(rowIndex: number, columnIndex: number) {
    this.joinColumns(rowIndex, columnIndex, Direction.Right);
  }

  dragstart(id: ElementType, ev: DragEvent) {
    if (!ev.dataTransfer) return;

    ev.dataTransfer.setData("widget", id);
  }

  drop(rowIndex: number, columnIndex: number, ev: DragEvent) {
    const row = this.model.rows[rowIndex];
    if (!row) {
      console.error("invalid row");
      return;
    }

    const column = row.columns[columnIndex];
    if (!column) {
      console.error("invalid column");
      return;
    }

    if (!ev.dataTransfer) {
      console.error("dataTransfer");
      return;
    }

    ev.preventDefault();
    const widgetType = ev.dataTransfer.getData("widget") as ElementType;
    const widgetAttributes = new Array<ElementAttribute>();


    if (rowIndex == this.model.rows.length - 1) {
      this.addRow(undefined);
    }

    if (
      columnIndex == this.model.rows[0].columns.length - 1 &&
      this.model.rows[0].columns.length < this.MAX_COLUMN_COUNT
    ) {
      this.addColumn();
    }

    const uuid = uuidv4();
    if (widgetType === ElementType.Button) {
        widgetAttributes.push({ name: "icon", type: ElementAttributeType.String, value: ''})
        widgetAttributes.push({ name: "hasIcon", type: ElementAttributeType.Boolean, value: true})
        widgetAttributes.push({ name: "isHighlighted", type: ElementAttributeType.Boolean, value: true})
        widgetAttributes.push({ name: "label", type: ElementAttributeType.String, value: "Button"})
    };

    column.element = {
        uuid: uuid,
        type: widgetType,
        attributes: widgetAttributes
    }


    this.updateModel({
        uuid: uuid,
        model: column.element
    });
  }

  public dropHandler(ev: Event) {
    if (ev) {
      console.log(ev.target);
    } else {
      console.log("no event");
    }
  }

  public dragHandler(ev: Event) {
    if (ev) {
      ev.preventDefault();
      console.log(`Dragging... ${JSON.stringify(ev)}`);
    } else {
      console.log("no event");
    }
  }
}
</script>

<style lang='scss'>
body {
  background: $dark-page;
  color: white;
}

html,
body {
  height: 100%;
}

.element_options {
}
.ui_preview {
}

.blueprint-column {
  position: relative;
  border: solid 1px;
  border-radius: 2px;
  margin: 0.25em;

  border: solid 2px $dark;
  display: flex;
  min-height: 4em;

  justify-content: center;
  align-items: center;
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

  //transform: translateX(-50%);
  //visibility: hidden;
  //opacity: 0;
  //transition: opacity 0.2s, visibility 0.2s;

  /*
  &.is-active {
    opacity: 1;
    visibility: visible;
  }
*/

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
