<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar>
          <q-toolbar-title>procmap</q-toolbar-title>
          <StyleSelector />
          -->
        </q-toolbar>

        <div class="row max-height">
          <div class="col">
            <h1 class="text-h1">Workflows</h1>
            <q-select

              v-model="selectedPage"
              :options="pages"
              label="Standard"
              option-value="page_id"
              option-label="name"
            />

            <q-btn
              label="New Flow"
              color="primary"
              style="
                background: salmon !important;
                color: rgb(30, 30, 30) !important;
                margin-top: 8px;
                margin-bottom: 8px;
              "
              @click="createNewFlow = true"
            />
            <span class="text-subtitle1 text-white">Change</span>
            <q-list bordered separator>
              <q-item
                clickable
                v-ripple
                v-for="flow in flows"
                :key="flow.flow_pk"
                @click="rerouteToFlowBuilder(flow.flow_id)"
              >
                <q-item-section>
                  <q-item-label>{{ flow.name }}</q-item-label>
                  <q-item-label caption>{{ flow.created_at }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col">
            <h1 class="text-h1">Pages</h1>
            <q-btn
              label="New Page"
              color="primary"
              style="
                background: salmon !important;
                color: rgb(30, 30, 30) !important;
                margin-top: 8px;
                margin-bottom: 8px;
              "
              @click="createNewPage = true"
            />
          </div>
          <div class="col">
            <h1 class="text-h1">Pages</h1>
            <q-list bordered separator>
              <q-item
                clickable
                v-ripple
                v-for="page in pages"
                :key="page.page_pk"
              >
                <q-item-section @click="rerouteToPageBuilder(page.page_id)">
                  <q-item-label>{{ page.name }}</q-item-label>
                  <q-item-label caption>{{ page.created_at }}</q-item-label>
                </q-item-section>
                <q-item-section top side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn
                      class="gt-xs"
                      flat
                      dense
                      round
                      icon="delete"
                      @click="toggleDeletePage(page)"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <q-dialog v-model="deletePage">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Delete Page?</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <p>
                Do you really want to delete the page <b></b>? Be aware that is
                cannot be undone.
              </p>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <!--
              <q-btn
                flat
                label="Permanently Delete"
                v-close-popup
                v-if="selectedPage"
                @click="confirmDeletePage(selectedPage)"
              />
              -->
            </q-card-actions>
          </q-card>
        </q-dialog>

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

        <q-dialog v-model="createNewPage">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Create New Page</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                dense
                v-model="newPageName"
                autofocus
                @keyup.enter="prompt = false"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                flat
                label="Create Page"
                v-close-popup
                @click="createPage"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import axios from 'axios';

import { NewPage, Page } from 'src/models/Page';

import StyleSelector from 'components/StyleSelector.vue';

import { TempFlow } from '../models/TempFlow';
import {
  GetMultiple,
  DeleteOne,
  TEMP_FLOW_URL,
  PAGES_URL,
} from 'src/models/Backend';
import { CreateNowTimestamp } from 'src/models/Date';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'MainLayout',

  components: {
    StyleSelector,
  },

  data() {
    return {
      createNewFlow: false,
      createNewPage: false,
      deletePage: false,
      newFlowName: '',
      newPageName: '',

      selectedPage: null,

      pages: [] as Array<Page>,
      flows: [] as Array<TempFlow>,
    };
  },

  computed: {
    availablePageNames(): string[] {
      return this.$data.pages.map((page) => page.name);
    },
  },

  methods: {
    ...mapGetters(['Page/persistedPages']),

    getTempFlows() {
      GetMultiple<TempFlow>(TEMP_FLOW_URL)
        .then((flows) => this.flows = flows)
        .catch(() => {
          this.$q.notify({
            type: 'error',
            message: 'Could not reach backend',
          });
        });
    },



    createFlow() {
      const hasName = this.newFlowName !== '';

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

      axios
        .post<TempFlow>('http://localhost:8000/temp_flow', tempFlow)
        .then((response) => {
          const { data } = response;

          this.rerouteToFlowBuilder(data.flow_id);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    createPage() {
      const hasName = this.newPageName !== '';

      if (!hasName) {
        return;
      }

      const newPage: NewPage = {
        page_id: uuidv4(),
        name: this.newPageName,
        created_at: CreateNowTimestamp(),
      };

      axios
        .post<Page[]>('http://localhost:8000/pages', [newPage])
        .then((response) => {
          const { data } = response;

          this.rerouteToFlowBuilder(data[0].page_id);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    toggleDeletePage(page: Page) {
      this.deletePage = true;
      this.selectedPage = Object.assign({}, this.selectedPage, page);
    },

    confirmDeletePage(page: Page) {
      DeleteOne(PAGES_URL, page.page_pk)
        .then(() => { this.pages = this['Page/persistedPages']() as Array<Page> })
        .catch(() => {
          this.$q.notify({
            type: 'error',
            message: 'Could not reach backend',
          });
        });
    },

    rerouteToFlowBuilder(flowUuid: string) {
      void this.$router.push(`/page_flow_builder/${flowUuid}`);
    },

    rerouteToPageBuilder(pageUuid: string) {
      void this.$router.push(`page_builder/${pageUuid}`);
    },
  },

  mounted() {
    this.getTempFlows();

    this.pages = this['Page/persistedPages']() as Array<Page>
  }
});
</script>

<style lang="scss">
h1 {
  font-size: 2em !important;
  color: black;
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
