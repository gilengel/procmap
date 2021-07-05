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
      v-model="list"
      item-key="id"
      group="widget"
      class="drop-zone"
      v-bind="dragOptions"
      @start="dragging = true"
      @end="dragging = false"
      @change="elementAdded"
    >
      <template #item="{}">
        <div>
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
        </div>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, computed, ref } from 'vue';

import ButtonElement from './Button.vue';
import TextElement from './Text.vue';

import HeadingElement from './Heading.vue';
/*
import MapElement from "./MapElement.vue";
*/
import { mapActions } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import { Element } from 'src/models/Grid';
import { ListItem } from 'src/components/ui_builder/ElementList.vue';

import draggable, { ChangeEvent } from 'vuedraggable';
import {
  Column,
  ElementType,
  ElementAttribute,
  ElementAttributeType,
} from 'src/models/Grid';

import { UI_ELEMENT_ADDED } from 'src/boot/mitt'

import getEmitter from 'src/components/EmitterComponent';

function string2ElementType(value: string): ElementType | undefined {
  switch (value) {
    case 'Button':
      return ElementType.Button;
    case 'Text':
      return ElementType.Text;
    case 'Row':
      return ElementType.Row;
    case 'Heading':
      return ElementType.Heading;
    case 'Map':
      return ElementType.Map;
  }

  return undefined;
}

export default defineComponent({
  name: 'LayoutColumn',

  components: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    draggable,
    ButtonElement,
    TextElement,
    HeadingElement,
  },

  props: {
    // Minimal size for one column
    columnIndex: {
      required: true,
      type: Number,
    },

    linkModeActive: {
      required: true,
      type: Boolean,
    },

    model: {
      required: true,
      type: Object as PropType<Column>,
    },

    splitDisabled: {
      required: true,
      type: Boolean,
    },
  },

  data() {
    return {
      allowedElements: ['Button', 'Text', 'Heading'] as ElementType[],
    };
  },

  methods: {
    ...mapActions(['Grid/addElementToColumn', 'Grid/removeElementFromColumn']),

    foo() {
      //this.dragging = true
      console.log('addded');
    },

    elementAdded(evt: ChangeEvent<ListItem | Element>) {
      // To Enum / number

      const isListItem = (p: unknown): p is ListItem =>
        (p as Record<string, unknown>).name !== undefined;
      const isElementItem = (p: unknown): p is Element =>
        (p as Record<string, unknown>).uuid !== undefined;

      if (evt.added) {
        const element = evt.added?.element as unknown;
        if (isListItem(element)) {
          this.addElement(string2ElementType(element.name) as ElementType);
        }

        if (isElementItem(element)) {
          void this['Grid/addElementToColumn']({
            column: this.model,
            element: element
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      }

      if (evt.removed) {
        void this['Grid/removeElementFromColumn'](this.model);
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

      const element : Element = reactive({
          uuid: uuidv4(),
          type: widgetType,
          attributes: widgetAttributes,
          classList: [],
        });



      this['Grid/addElementToColumn']({
        column: this.model,
        element: element
      }).then(() => {

        this.emitter?.emit(UI_ELEMENT_ADDED, element)
      }).catch((e) => {
        console.error(e)
      })
    },
  },

  setup(props) {
    const emitter = getEmitter();

    const tempList = ref([] as Element[]);
    const list = computed({
      get(): Element[] {
        const a = new Array<Element>();

        if (props.model.element) {
          a.push(props.model.element);
        }

        return a;
      },

      set(value: Element[]) {
        tempList.value = value;
      },
    });

    const dragOptions = {
      animation: 200,
      disabled: false,
    };

    return {
      list,
      dragOptions,
      emitter
    };
  },
});
</script>

<style lang="scss">
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

.layout-col:hover > .actions {
  visibility: visible;
}

.layout-col:first-of-type {
  border-left: 1px solid rgb(100, 100, 100);
}

.drop-zone {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  .sortable-ghost,
  .sortable-choosen {
    position: absolute !important;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border: solid 2px $primary;
    background: rgba(255, 255, 255, 0.6);
  }
}

</style>
