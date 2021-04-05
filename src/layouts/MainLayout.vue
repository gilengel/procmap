<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>Wuhu</q-toolbar-title>
        </q-toolbar>

        <q-btn label="New Flow" color="primary" @click="createNewFlow = true" />

        <span style="color: white">{{selectedPage}}</span>
        <q-select
          dark
          v-model="selectedPage"
          :options="pages"
          label="Standard"
          option-value="page_id"
          option-label="name"
        />

        <q-dialog v-model="createNewFlow">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Create New Flow</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                dense
                v-model="newFlowName"
                autofocus
                @keyup.enter="prompt = false"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                flat
                label="Create Flow"
                v-close-popup
                @click="createFlow"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";

import { v4 as uuidv4 } from "uuid";

import axios from "axios";

import { GetAllPages, Page } from "../models/Page";

@Component({
  name: "MainLayout",

  components: {},
})
export default class MainLayout extends Vue {
  createNewFlow: boolean = false;
  newFlowName: String = "";

  selectedPage = null;

  pages: Array<Page> = [];
  get availablePageNames() {
    return this.pages.map((page) => page.name);
  }

  created() {
    GetAllPages()
      .then((pages) => {
        this.pages = pages;
        console.log(pages);
        const pageNames = new Array<String>();
        for (const page of pages) {
          pageNames.push(page.name);
        }

        this.availablePages = pageNames;
      })
      .catch((reason) => {
        console.log(reason);
      });
  }
  createFlow() {
    const hasName = this.newFlowName !== "";

    if (!hasName) {
      return;
    }

    const date = new Date().toJSON().slice(0, -1);
    const tempFlow = {
      flow_id: uuidv4(),
      name: this.newFlowName,
      created_at: date,
      data: {},
    };

    const self = this;
    axios
      .post("http://localhost:8000/temp_flow", tempFlow)
      .then(function (response) {
        const result = JSON.parse(response.request.response);

        self.$router.push(`page_flow_builder/${result.flow_id}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>

<style lang='scss'>
body {
  background: $dark-page;
}

html,
body {
  height: 100%;
}

.q-banner {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
}

.vue-grid-item .resizing {
  opacity: 0.9;
}
</style>
