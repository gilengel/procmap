<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>procmap</q-toolbar-title>
        </q-toolbar>

        <div class="row">
          <div class="col">
            <h1 class="text-h1">Create & Modify</h1>

            <span class="text-subtitle1 text-white">{{ selectedPage }}</span>
            <q-select
              dark
              v-model="selectedPage"
              :options="pages"
              label="Standard"
              option-value="page_id"
              option-label="name"
            />

            <span class="text-subtitle1 text-white">Change</span>
            <q-list dark bordered separator>
              <q-item clickable v-ripple v-for="flow in flows" :key="flow.flow_pk" @click="rerouteToFlowBuilder(flow.flow_id)">
                <q-item-section>
                  <q-item-label>{{flow.name}}</q-item-label>
                  <q-item-label caption>{{flow.created_at}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-btn
              label="New Flow"
              color="primary"
              @click="createNewFlow = true"
            />
          </div>
          <div class="col">
            <h1 class="text-h1">Exection</h1>
          </div>
          <div class="col">
            <h1 class="text-h1">Options</h1>
          </div>
        </div>

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

import { TempFlow } from "../models/TempFlow";
import { GetMultiple, TEMP_FLOW } from "../models/Backend";

@Component({
  name: "MainLayout",

  components: {},
})
export default class MainLayout extends Vue {
  createNewFlow: boolean = false;
  newFlowName: String = "";

  selectedPage = null;

  pages: Array<Page> = [];
  flows: Array<TempFlow> = [];

  get availablePageNames() {
    return this.pages.map((page) => page.name);
  }

  private getTempFlows() {
    GetMultiple<TempFlow>(TEMP_FLOW)
      .then((flows) => {
        console.log(flows)
        this.flows = flows
      })
      .catch((err) => {
        this.$q.notify({
          type: "error",
          message: "Could not reach backend",
        });
      });
  }

  created() {
    this.getTempFlows()

    GetAllPages()
      .then((pages) => {
        this.pages = pages;
        const pageNames = new Array<String>();
        for (const page of pages) {
          pageNames.push(page.name);
        }

        this.availablePages = pageNames;
      })
      .catch((reason) => {
        this.$q.notify({
          type: "error",
          message: "Could not reach backend",
        });
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

        self.rerouteToFlowBuilder(result.flow_id);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  private rerouteToFlowBuilder(flowUuid: string) {
    this.$router.push(`page_flow_builder/${flowUuid}`);
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

h1 {
  font-size: 2em !important;
  color: white;
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
