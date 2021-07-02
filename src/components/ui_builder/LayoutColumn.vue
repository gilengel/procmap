<template>
  <div class="layout-col" v-bind:class="{ active: !linkModeActive }">
    <div class="actions" v-if="!linkModeActive">
      <q-btn
        :disable="splitDisabled"
        flat
        round
        color="white"
        icon="las la-columns"
        @click="$emit('splitColumn', columnIndex)"
      />
      <q-btn
        flat
        round
        color="white"
        icon="las la-trash-alt"
        @click="$emit('deleteColumn', columnIndex)"
      />
    </div>
    <draggable
      :list="list"
      item-key="id"
      group="widget"
      @start="dragging = true"
      @end="dragging = false"
      @change="elementAdded"
    >
      <template #item="{ element }">
        <div>
          <!--
          <TextElement
            data-key="itemId"
            :model="model.element"
            :dataValue="model.element.type"
            :active="linkModeActive"
            editable="true"
            v-if="model && model.element && model.element.type === 'Text'"
          />
          -->

          <ButtonElement
            data-key="itemId"
            :model="model.element"
            :dataValue="model.element.type"
            :active="linkModeActive"
            editable="true"
            v-if="model && model.element && model.element.type === 'Button'"
            @keyup="removeElementFromColumn(model)"
          />

          <TextElement
            data-key="itemId"
            :model="model.element"
            :dataValue="model.element.type"
            :active="linkModeActive"
            :editable="true"
            v-if="model && model.element && model.element.type === 'Text'"
          />

          <HeadingElement
            data-key="itemId"
            :model="model.element"
            :dataValue="model.element.type"
            :active="linkModeActive"
            :editable="true"
            v-if="model && model.element && model.element.type === 'Heading'"
          />
<!--
          <MapElement
            data-key="itemId"
            :model="model.element"
            :dataValue="model.element.type"
            :active="linkModeActive"
            editable="true"
            v-if="model && model.element && model.element.type === 'Map'"
          />
          -->
        </div>
      </template>
    </draggable>
    <!--
    <draggable
      @change="elementAdded"
      :list="list"
      group="widget"
      ghost-class="ghost"
      :disabled="linkModeActive"
    >




    <HeadingElement
      data-key="itemId"
      :model="model.element"
      :dataValue="model.element.type"
      :active="linkModeActive"
      editable="true"
      v-if="model && model.element && model.element.type === 'Heading'"
    />

    <MapElement
      data-key="itemId"
      :model="model.element"
      :dataValue="model.element.type"
      :active="linkModeActive"
      editable="true"
      v-if="model && model.element && model.element.type === 'Map'"
    />

    </draggable>
    -->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';


import ButtonElement from './Button.vue';
import TextElement from './Text.vue';

import HeadingElement from './Heading.vue';
/*
import MapElement from "./MapElement.vue";
*/
import { mapActions } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import { ListItem } from 'src/components/ui_builder/ElementList.vue'

import draggable, { ChangeEvent } from 'vuedraggable';
import {
  Column,
  ElementType,
  ElementAttribute,
  ElementAttributeType,
} from 'src/models/Grid';

function string2ElementType(value: string) : ElementType | undefined {
  switch(value) {
    case 'Button': return ElementType.Button;
    case 'Text' : return ElementType.Text;
    case 'Row' : return ElementType.Row;
    case 'Heading' : return ElementType.Heading;
    case 'Map' : return ElementType.Map;
  }

  return undefined
}

export default defineComponent({
  name: 'LayoutColumn',

  components: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    draggable,
    ButtonElement,
    TextElement,
    HeadingElement

    /*
    ButtonElement,
    TextElement,
    HeadingElement,
    MapElement,
    */
  },

  props: {

    // Minimal size for one column
    columnIndex: {
      required: true,
      type: Number,
      /*
      validator(x) {
        return typeof x === 'number' && x >= 0 && x < 12;
      },
      */
    },

    linkModeActive: {
      required: true,
      type: Boolean,
      /*
      validator(x) {
        return typeof x === 'boolean';
      },
      */
    },

    model: {
      required: true,
      type: Object as PropType<Column>,
    },

    splitDisabled: {
      required: true,
      type: Boolean,
    }
  },

  data() {
    return {
      list: [
      ],

      allowedElements: ['Button', 'Text', 'Heading'] as ElementType[],
    };
  },

  methods: {
    ...mapActions(['Grid/addElementToColumn', 'Grid/removeElementFromColumn']),

    elementAdded(evt: ChangeEvent<ListItem>) {
      // To Enum / number


      if (evt.added) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.addElement(string2ElementType(evt.added.element.name) as ElementType);
      }

      if (evt.removed) {
        //void this['Grid/removeElementFromColumn'](this.model);
      }

      return false;
    },

    addElement(widgetType: ElementType) {
      const widgetAttributes = new Array<ElementAttribute>();
      if (widgetType === ElementType.Button) {
        widgetAttributes.push({
          name: 'type',
          type: ElementAttributeType.String,
          value: 'button',
        });
        widgetAttributes.push({
          name: 'icon',
          type: ElementAttributeType.String,
          value: 'lab la-accessible-icon',
        });
        widgetAttributes.push({
          name: 'hasIcon',
          type: ElementAttributeType.Boolean,
          value: true,
        });
        widgetAttributes.push({
          name: 'isHighlighted',
          type: ElementAttributeType.Boolean,
          value: true,
        });
        widgetAttributes.push({
          name: 'label',
          type: ElementAttributeType.String,
          value: 'Button',
        });
      }

      if (widgetType === ElementType.Text) {
        widgetAttributes.push({
          name: 'variable',
          type: ElementAttributeType.String,
          value: 'Some_text',
        });
        widgetAttributes.push({
          name: 'label',
          type: ElementAttributeType.String,
          value: 'Some text',
        });
        widgetAttributes.push({
          name: 'type',
          type: ElementAttributeType.String,
          value: 'date',
        });
        widgetAttributes.push({
          name: 'withLabel',
          type: ElementAttributeType.Boolean,
          value: true,
        });
      }

      if (widgetType === ElementType.Heading) {
      }


      void this['Grid/addElementToColumn']({
        column: this.model,
        element: {
          uuid: uuidv4(),
          type: widgetType,
          attributes: widgetAttributes,
        }
      });
    }
  }
});
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
    z-index: 3;
    width: auto;

    transform: translate(-50%, -2px);

    padding: 0;
    background: $primary;
    visibility: collapse;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

.active:hover {
  outline: solid 2px $primary;
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
