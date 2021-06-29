<template>
<h1>LayoutColumn</h1>
<!--
  <div class="layout-col" v-bind:class="{ active: !linkModeActive }">
    <div class="actions" v-if="!linkModeActive">
      <q-btn dark flat round color="white" icon="las la-plus">
        <q-menu dark>
          <q-list style="min-width: 100px">
            <template v-for="element in allowedElements" :key="element">
              <q-item
                clickable
                v-close-popup
                @click="addElement(element)"

              >
                <q-item-section>{{ element }}</q-item-section>
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

    <draggable
      @change="elementAdded"
      :list="list"
      group="widget"
      ghost-class="ghost"
      :disabled="linkModeActive"
    >
    <TextElement
      data-key="itemId"
      :model="model.element"
      :dataValue="model.element.type"
      :active="linkModeActive"
      editable="true"
      v-if="model && model.element && model.element.type === 'Text'"
    />

    <ButtonElement
      data-key="itemId"
      :model="model.element"
      :dataValue="model.element.type"
      :active="linkModeActive"
      editable="true"
      v-if="model && model.element && model.element.type === 'Button'"
      @keyup.native="removeElementFromColumn(model)"
    />

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
  </div>
  -->
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

/*
import ButtonElement from "./ButtonElement.vue";
import TextElement from "./TextElement.vue";
import HeadingElement from "./HeadingElement.vue";
import MapElement from "./MapElement.vue";
*/
import { mapActions } from 'vuex';

import draggable, { ChangeEvent } from 'vuedraggable';
import {
  Column,
  Element,
  ElementType,
  ElementAttribute,
  ElementAttributeType,
} from 'src/models/Grid';

import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  name: 'LayoutColumn',

  components: {
    draggable
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
      validator(x) {
        return typeof x === 'number' && x >= 0 && x < 12;
      },
    },

    linkModeActive: {
      required: true,
      type: Boolean,
      validator(x) {
        return typeof x === 'boolean';
      },
    },

    model: {
      required: true,
      type: Object as PropType<Column>,
    },

    splitDisable: {
      required: true,
      type: Function as PropType<(colIndex: number) => void>
    },

    splitColumn: {
      required: true,
      type: Function as PropType<(colIndex: number) => void>
    },

    deleteColumn: {
      required: true,
      type: Function as PropType<(colIndex: number) => void>
    },

    click: {
      required: true,
      type: Function as PropType<(element: Element) => void>
    }
  },

  data() {
    return {
      list: [
        { name: 'John', id: 0 },
        { name: 'Joao', id: 1 },
        { name: 'Jean', id: 2 },
      ],

      allowedElements: ['Button', 'Text', 'Heading'] as ElementType[],
    };
  },

  /*
  @Action("addElementToColumn")
  addElementToColumn!: (param: { column: Column; element: Element }) => void;

  @Action("removeElementFromColumn")
  removeElementFromColumn!: (column: Column) => void;
*/

  methods: {
    ...mapActions(['Grid/addElementToColumn', 'Grid/removeElementFromColumn']),

    elementAdded(evt: ChangeEvent<unknown>) {
      // TODO reenable it
      /*
      if (evt.added) {
        this.addElement(
          ElementType[evt.added.element.name as keyof typeof ElementType]
        );
      }

      if (evt.removed) {
        void this['Grid/removeElementFromColumn'](this.model);
      }
      */
    },

    addElement(widgetType: ElementType) {
      const widgetAttributes = new Array<ElementAttribute>();
      const uuid = uuidv4();
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

      // TODO
      /*
      void this['Grid/addElementToColumn']({
        column: this.model,
        element: {
          uuid: uuid,
          type: widgetType,
          attributes: widgetAttributes,
        },
      });
      */
    },
  },
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
