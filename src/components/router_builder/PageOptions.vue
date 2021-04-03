<template>
  <div class="widget">
    <q-toolbar class="bg-black text-white vue-draggable-handle">
      <q-toolbar-title>Page Options</q-toolbar-title>
    </q-toolbar>
    <div class="widget-content q-pa-md">
      <label>Page</label>
      <q-select
        dark
        filled
        :value="model"
        use-input
        hide-selected
        hide-bottom-space
        dense
        fill-input
        input-debounce="0"
        :options="options"
        @filter="filterFn"
        @input-value="setModel"
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
import { Vue, Component } from "vue-property-decorator";

const stringOptions = [
  "Google",
  "Facebook",
  "Twitter",
  "Apple",
  "Oracle",
].reduce((acc, opt) => {
  for (let i = 1; i <= 5; i++) {
    acc.push(opt + " " + i);
  }
  return acc;
}, []);

@Component({
  name: "PageOptions",
})
export default class PageOptions extends Vue {
  options = stringOptions;
  model = null;

  filterFn(val, update, abort) {
    update(() => {
      const needle = val.toLocaleLowerCase();
      this.options = stringOptions.filter(
        (v) => v.toLocaleLowerCase().indexOf(needle) > -1
      );
    });
  }

  setModel(val) {
    this.model = val;
  }
}
</script>

<style lang="scss">
.widget {
  border-left: 1px solid white;
  height: 100%;
}
.widget-content {
  color: white;
}
.option-column {
  padding-left: 1em;
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
