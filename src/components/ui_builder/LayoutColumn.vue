<template>
  <div class="layout-col">
    <div class="actions">
      <q-btn dark flat round color="white" icon="las la-plus">
        <q-menu dark>
          <q-list style="min-width: 100px">
            <template v-for="element in allowedElements">
              <q-item clickable v-close-popup @click="addElement(element)" :key="element">
                <q-item-section>{{element}}</q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn
        :disable="splitDisabled"
        dark
        flat
        round
        color="white"
        icon="las la-columns"
        @click="splitColumn(columnIndex)"
      />
      <q-btn
        dark
        flat
        round
        color="white"
        icon="las la-trash-alt"
        @click="deleteColumn(columnIndex)"
      />
    </div>

    <TextElement
      data-key="itemId"
      :model="model.element"
      :dataValue="model.element.type"
      editable="true"
      v-if="model && model.element && model.element.type === 'Text'"
    />

    <ButtonElement
      data-key="itemId"
      :model="model.element"
      :dataValue="model.element.type"
      editable="true"
      v-if="model && model.element && model.element.type === 'Button'"
      @keyup.native="removeElementFromColumn(model)"
    />

    <HeadingElement
      data-key="itemId"
      :model="model.element"
      :dataValue="model.element.type"
      editable="true"
      v-if="model && model.element && model.element.type === 'Heading'"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import ButtonElement from "./ButtonElement.vue";
import TextElement from "./TextElement.vue";
import HeadingElement from "./HeadingElement.vue";
import {
  Row,
  Column,
  Element,
  ElementType,
  ElementAttribute,
  ElementAttributeType,
} from "../../models/Grid";
import { Action } from "vuex-class";

import { v4 as uuidv4 } from "uuid";

@Component({
  name: "LayoutColumn",

  components: {
    ButtonElement,
    TextElement,
    HeadingElement,
  },
})
export default class LayoutColumn extends Vue {
  // Minimal size for one column
  @Prop({
    validator(x) {
      return typeof x === "number" && x >= 0 && x < 12;
    },
  })
  columnIndex!: number;

  @Prop() splitDisabled!: (colIndex: number) => void;

  @Prop() splitColumn!: (columnIndex: number) => void;

  @Prop() deleteColumn!: (colIndex: number) => void;

  @Prop() model!: Column;

  @Prop() click!: (element: Element) => void;

  @Action("addElementToColumn")
  addElementToColumn!: (param: { column: Column; element: Element }) => void;

  @Action("removeElementFromColumn")
  removeElementFromColumn!: (column: Column) => void;

  allowedElements = ["Button", "Text", "Heading"];

  private addElement(widgetType: ElementType) {
    const widgetAttributes = new Array<ElementAttribute>();
    const uuid = uuidv4();
    if (widgetType === ElementType.Button) {
      widgetAttributes.push({
        name: "type",
        type: ElementAttributeType.String,
        value: "button",
      });
      widgetAttributes.push({
        name: "icon",
        type: ElementAttributeType.String,
        value: "lab la-accessible-icon",
      });
      widgetAttributes.push({
        name: "hasIcon",
        type: ElementAttributeType.Boolean,
        value: true,
      });
      widgetAttributes.push({
        name: "isHighlighted",
        type: ElementAttributeType.Boolean,
        value: true,
      });
      widgetAttributes.push({
        name: "label",
        type: ElementAttributeType.String,
        value: "Button",
      });
    }

    if (widgetType === ElementType.Text) {
      widgetAttributes.push({
        name: "variable",
        type: ElementAttributeType.String,
        value: "Some_text",
      });
      widgetAttributes.push({
        name: "label",
        type: ElementAttributeType.String,
        value: "Some text",
      });
      widgetAttributes.push({
        name: "type",
        type: ElementAttributeType.String,
        value: "date",
      });
      widgetAttributes.push({
        name: "withLabel",
        type: ElementAttributeType.Boolean,
        value: true,
      });
    }

    if (widgetType === ElementType.Heading) {
    }

    this.addElementToColumn({
      column: this.model,
      element: {
        uuid: uuid,
        type: widgetType,
        attributes: widgetAttributes,
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.layout-col {
  position: relative;
  border: 1px solid rgb(100, 100, 100);
  border-left: none;
  text-align: center;
  min-height: 128px;

  padding: 1em;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  align-content: stretch;
  justify-content: center;

  > div {
    width: 100%;
    padding: 1em;
  }

  > .actions {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 1;
    width: auto;

    transform: translate(-50%, -2px);

    padding: 0;
    background: $secondary;
    visibility: collapse;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

.layout-col:hover {
  outline: solid 2px $secondary;
}
/*
.layout-col:hover::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    content: ' ';
    filter: blur(4px);
    background: salmon;
}
*/
.layout-col:hover > .actions {
  visibility: visible;
}

.layout-col:first-of-type {
  border-left: 1px solid rgb(100, 100, 100);
}
</style>
