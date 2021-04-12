<template>
  <div class="layout-col">
    <div class="actions">
      <q-btn dark flat round color="white" icon="las la-plus">
      <q-menu dark>
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup @click="addElement('Text')">
            <q-item-section>Text</q-item-section>
          </q-item>
                    <q-separator />
          <q-item clickable v-close-popup @click="addElement('Button')">
            <q-item-section>Button</q-item-section>
          </q-item>

        </q-list>
      </q-menu>
      </q-btn>
      <q-btn dark flat round color="white" icon="las la-columns" @click="splitColumn(columnIndex)" />
      <q-btn dark flat round color="white" icon="las la-trash-alt" @click="deleteColumn(columnIndex)" />


    </div>

    <TextElement
      @click.native="click(model.element)"
      draggable
      dataKey="itemId"
      :model="model.element"
      :dataValue="model.element.type"
      editable="true"
      v-if="model && model.element && model.element.type === 'Text'"
    />

    <ButtonElement
      @click.native="click(model.element)"
      draggable
      dataKey="itemId"
      :model="model.element"
      :dataValue="model.element.type"
      editable="true"
      v-if="model && model.element && model.element.type === 'Button'"
      @keyup.native="removeElementFromColumn(model)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import ButtonElement from "./ButtonElement.vue";
import TextElement from "./TextElement.vue";
import { Column, ElementType, ElementAttribute, ElementAttributeType } from "../../models/Grid";

import { v4 as uuidv4 } from "uuid";

@Component({
  name: "LayoutColumn",

  components: {
    ButtonElement,
    TextElement,
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

  @Prop() splitColumn!: (colIndex: number) => void;

  @Prop() deleteColumn!: (colIndex: number) => void;

  @Prop() model!: Column;

  @Prop() click!: (element: Element) => void;

  private addElement(widgetType: ElementType): Element {
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
        value: "",
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
          value: true
      })
    }

    this.model.element = {
      uuid: uuid,
      type: widgetType,
      attributes: widgetAttributes,
    };
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
