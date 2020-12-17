<template>
  <q-page style="display: flex;">
    <q-splitter v-model="horizontalSplitter" style="flex-grow: 2">
      <template v-slot:before>
        <q-page>
          <q-toolbar class="bg-black text-white">
            <q-toolbar-title>
              Control Flow
            </q-toolbar-title>
            
            <q-btn flat round dense icon="las la-map" />
          </q-toolbar>
          <q-page>
            <FlowGraphComponent :map="map" :geometry.sync="geometry" />
          </q-page>
        </q-page>
      </template>

      <template v-slot:after>
        <q-page>
          <Preview2D :geometry="geometry" />
        </q-page>
      </template>
    </q-splitter>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import FlowGraphComponent from 'components/FlowGraphComponent.vue'
import Preview2D from 'components/Preview2D.vue'

import Component from 'vue-class-component'
import { RandomMap } from 'components/models'

@Component({
  components: { FlowGraphComponent, Preview2D }
})
export default class MapEditorComponent extends Vue {
  map: RandomMap = new RandomMap({ width: 512, height: 512 }, []);

  geometry: Record<string, unknown> = {};

  horizontalSplitter = 70;
}
</script>

<style></style>
