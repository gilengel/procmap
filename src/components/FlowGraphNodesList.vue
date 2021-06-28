<template>
  <div>
    <q-toolbar>
      <q-toolbar-title>Notes</q-toolbar-title>
      <div class="q-gutter-sm" />
    </q-toolbar>
    <q-list padding>
      <template v-for="category in categories" :key="category.label">
        <q-item-label header>
          {{ category.label }}
        </q-item-label>

        <q-item
          v-for="component in category.components"
          :key="component.id"
          draggable="true"
          @dragstart="dragstart(component.id, $event)"
        >
          <q-item-section avatar>
            <q-icon :name="component.icon" />
          </q-item-section>
          <q-item-section>{{ component.label }}</q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType
} from 'vue';
import { MetaFlowCategory } from 'src/models/flow/Meta';

export default defineComponent({
  // name: 'ComponentName'

  props: {
    categories: {
        type: Array as PropType<Array<MetaFlowCategory>>,
        required: true
    }
  },

  methods: {
    dragstart(id: string, ev: DragEvent) {
        if (!ev.dataTransfer) return;
        ev.dataTransfer.setData('componentId', id);
    }
  }
})
</script>
<style lang="scss" scoped>
  .q-item__section, .q-item {
    color: black;
  }
</style>
