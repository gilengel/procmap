<template>
  <q-page style="display: flex;">
    <q-splitter v-model="horizontalSplitter" style="flex-grow: 2">
      <template v-slot:before>
        <q-page>
          <q-toolbar class="bg-black text-white">
            <q-toolbar-title>
              Control Flow
            </q-toolbar-title>
            <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
            <q-btn flat round dense icon="gamepad" />
          </q-toolbar>
          <q-page>
            <FlowGraphComponent :map="map" :geometry.sync="geometry" />
            {{ map.dimension }}

            <q-input dark filled v-model="map.dimension.width">
              <template v-slot:prepend>
                <q-icon name="las la-arrows-alt-h" />
              </template>
            </q-input>

            <q-input dark filled v-model="map.dimension.height">
              <template v-slot:prepend>
                <q-icon name="las la-arrows-alt-v" />
              </template>
            </q-input>
          </q-page>
        </q-page>
      </template>

      <template v-slot:after>
        <q-page>
          <SVGRenderer :geometry="geometry" />
        </q-page>
      </template>
    </q-splitter>
  </q-page>
</template>

<script lang="ts">
import FlowGraphComponent from 'components/FlowGraphComponent.vue'
import SVGRenderer from 'components/SVGRenderer.vue'

export default {
  components: { FlowGraphComponent, SVGRenderer },

  data () {
    return {
      horizontalSplitter: 70,
      map: {
        dimension: {
          width: 512,
          height: 512
        },

        points: []
      },
      geometry: [[100, 100], [200, 200]]
    }
  }
}
</script>

<style></style>
