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
        :model-value="selectedPageName"
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
import { NewPage } from 'src/models/Page';
import { defineComponent, ref } from 'vue';

import { Page } from 'src/models/Page'

import { mapGetters, mapActions } from 'vuex';
export default defineComponent({
  props: {
    uuid: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      selectedPageName: ''
    }
  },

  computed: {
    availablePages(): Array<string> {
      return (this['Page/persistedPages']() as Array<Page>).map(a => a.name)
    },

    model(): NewPage {
      const getter = this['Page/persistedPage'] as () => (id: string) => NewPage;
      const page = getter()(this.uuid);

      return page;
    },

    name: {
      get() : string {
        if(!this.model) {
          return ''
        }

        return this.model.name;
      },

      set(newname: string) {
        const update = { name: newname };
        this['Page/updateNewPage']({ page: this.model, update })
          .then(() => {
            console.log(':)');
          })
          .catch(() => console.log(':('));
      },
    },
  },

  // TODO: Workaround, we need to make the store periodically fetch the models
  async created() {
    await this['Page/fetchAllFromBackend']()
  },

  methods: {
    ...mapGetters(['Page/newPageById', 'Page/persistedPage', 'Page/persistedPages']),
    ...mapActions(['Page/updateNewPage', 'Page/fetchAllFromBackend']),
  },
});
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
