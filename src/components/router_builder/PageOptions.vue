<template>
  <div class="widget">
    <q-toolbar class="bg-black text-white vue-draggable-handle">
      <q-toolbar-title>Page Options</q-toolbar-title>

    </q-toolbar>
    <div class="widget-content q-pa-md">
      <label>Page</label>
      <q-input v-model="name" label="Name" dark stack-label />

      <q-select
        dark
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
import axios from "axios";

import { Vue, Prop, Component } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { NewPage, UpdateNewPage } from '../../models/Page';

interface Page {
  pk_id: number;
  page_id: String;
  name: String;
  created_at: number;
  fk_layout_id: number;
}

interface ServerResponse {
  data: Array<Page>;
}

@Component({
  name: "PageOptions",
})
export default class PageOptions extends Vue {
  @Prop({ default: "uuid" }) uuid!: string;

  @Getter("newPageById")
  getNewPageModel!: (uuid: string) => NewPage;

  @Action("updateNewPage")
  updateNewPage!: (params: {page: NewPage, update: UpdateNewPage}) => void;

  get model() {
    return this.getNewPageModel(this.uuid);
  }

  // Pages saved on backend side
  private availablePages: Array<String> = [];

  private selectedPageName: String = "";

  get name() {
    return this.model.name;
  }

  set name(value: string) {
    const update = { name: value }
    this.updateNewPage({ page: this.model, update })
  }

  created() {
    /*
    axios
      .request<Array<Page>>({
        url: "http://localhost:8000/pages",
        transformResponse: (r: ServerResponse) => r.data,
      })
      .then((response) => {
        const model = JSON.parse(response.request.response).content as Array<Page>;

        const pageNames = new Array<String>();
        for(const page of model) {
          pageNames.push(page.name);
        }

        this.availablePages = pageNames;
      })
      .catch((reason) => {
        console.log(reason);
      });
      */
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
