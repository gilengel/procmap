<template>
  <div class="widget">
    <q-toolbar class="bg-black text-white vue-draggable-handle">
      <q-toolbar-title>Page Options</q-toolbar-title>

    </q-toolbar>
    <div class="widget-content q-pa-md">
      <label>Page</label>
      <q-input v-model="name" label="Name" stack-label />

      <q-select
        filled
        :value="selectedPageName"
        :model="selectedPageName"
        use-input
        hide-selected
        hide-bottom-space
        dense
        fill-input
        input-debounce="0"
        :options="availablePages"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';


export default defineComponent({

})
</script>

<style lang="scss">
.widget {
  height: 100%;
}
.widget-content {
  color: white;
}
.option-column {
  padding-left: 1em;
  padding-right: 1em;
  height: 100%;

  .preview {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 1em;
  }
}

.selected {
  color: $accent;
}
</style>
