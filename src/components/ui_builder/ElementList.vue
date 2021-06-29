<template>
  <div class="q-pa-md">
    <q-input dark outlined bottom-slots v-model="text" dense>
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <draggable
      class="q-list q-list--bordered q-list--separator q-list--dark"
      tag="transition-group"
      v-model="list"
      :group="{ name: 'widget', pull: 'clone', put: false }"
      v-bind="dragOptions"
      @start="onStart"
      @end="onEnd"
      :move="onMoveCallback"
      item-key="id"
    >
      <template #item="{ element }">
        <q-item

          clickable
          v-ripple
          class="list-group-item"
        >
          <q-item-section>
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              @click="element.fixed = !element.fixed"
              aria-hidden="true"
            ></i>
            {{ element.name }}
          </q-item-section>
        </q-item>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import draggable from 'vuedraggable';

interface ListItem {
  name: string;
  order: number;
  fixed: boolean;
}

export default defineComponent({
  name: 'ElementList',

  components: {
    draggable,
  },

  data() {
    return {
      text: '',
      elements: ['Heading', 'Text', 'Button', 'Map'],

      drag: false,
      dragOptions: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      },
    };
  },

  computed: {
    list: {
      get(): { name: string; order: number; fixed: boolean }[] {
        return this.elements.map((transform, index) => {
          return { name: transform, order: index, fixed: false };
        });
      },

      set(items: ListItem[]) {
        const list = items.map((item) => {
          return item.name;
        });

        this.elements = list;
      },
    },
  },

  methods: {
    onStart() {
      this.$emit('startDragging');
    },

    onEnd() {
      this.$emit('stopDragging');
    },

    onMoveCallback(evt: unknown, originalEvent: unknown): boolean {
      /*
      const targetClassList = evt.related.classList as DOMTokenList;

      if (targetClassList.contains('layout-row')) {
        //return false;
      }
      */

      //console.log(evt.related)

      return true;
      // return false; — for cancel
    },
  },
});
</script>

<style lang="scss" scoped></style>
