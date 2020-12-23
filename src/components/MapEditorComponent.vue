<template>
  <div class="map-editor">
    <div class="content row">
      <div class="left">
        <q-toolbar class="bg-black text-white">
          <q-toolbar-title>
            Notes
          </q-toolbar-title>
          <div class="q-gutter-sm">

          </div>
        </q-toolbar>
        <q-list dark padding>
          <q-item v-for="component in availableComponents" :key="component.id" draggable="true" v-on:dragstart="dragstart(component.id, $event)" >
            <q-item-section avatar>
              <q-icon :name="component.icon" />
            </q-item-section>
            <q-item-section>{{component.label}}</q-item-section>
          </q-item>

          <q-item-label header>Elementary Nodes</q-item-label>
          <q-item>
            <q-item-section avatar>
              <q-icon name="las la-map-marked" />
            </q-item-section>
            <q-item-section>Random</q-item-section>
          </q-item>

          <q-separator spaced inset="item" />

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-map-marked" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Voronoi</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced inset="item" />

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-map-marked" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Select Random</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced inset="item" />

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-map-marked" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Grow</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-mountain" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Mountain</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-tree" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Forrests</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-route" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Road</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-frog" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Animals</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-apple-alt" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Farms</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-city" />
            </q-item-section>

            <q-item-section>
              <q-item-label>City</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-coins" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Economic</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-snowflake" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Biomes</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top avatar>
              <q-icon name="las la-water" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Ocean</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- ITEM LIST -->

      <div class="middle">
        <q-splitter v-model="horizontalSplitter" style="flex-grow: 2">
          <template v-slot:before>
            <q-toolbar class="bg-black text-white">
              <q-toolbar-title>
                Preview
              </q-toolbar-title>
              <ToggleButton icon="las la-map-marked" v-model="showMinimap" />
            </q-toolbar>

            <FlowGraphComponent
              :map.sync="map"
              :geometry.sync="geometry"
              :showMinimap="showMinimap"
            />
          </template>

          <template v-slot:after>
            <q-page>
              <Preview2D :geometry="geometry" :size.sync="map.dimension" />
              <!--
              <div class="layers">
                <div>Layer 1</div>
                <div>Layer 2</div>
                <div>Layer 3</div>
                <div>Layer 4</div>
                <div>Layer 5</div>z
              </div>
              -->
            </q-page>
          </template>
        </q-splitter>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ToggleButton from 'components/ToggleButton.vue'
import FlowGraphComponent from 'components/FlowGraphComponent.vue'
import Preview2D from 'components/Preview2D.vue'

import { RandomMap } from 'components/models'
import { Vue, Component } from 'vue-property-decorator'

import { getRegisteredFlowComponents, MetaFlowComponent } from './flow'

@Component({
  components: { ToggleButton, FlowGraphComponent, Preview2D }
})
export default class MapEditorComponent extends Vue {
  showMinimap = true;

  left = true;

  map: RandomMap = new RandomMap({ width: 1024, height: 1024 }, []);

  availableComponents: Array<MetaFlowComponent> = [];

  geometry: Record<string, unknown> = {};

  horizontalSplitter = 70;

  mounted () {
    this.availableComponents = getRegisteredFlowComponents()
  }

  dragstart (id: string, ev: DragEvent) {
    if (!ev.dataTransfer) return

    ev.dataTransfer.setData('componentId', id)
  }
}
</script>

<style lang="scss">
.left {
  min-width: 200px;
  width: 10%;
}

.middle {
  flex-grow: 1;
  max-width: 90%;
}

.right {

  min-width: 200px;
  width: 20%;
}

.map-editor {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
}

.layers:hover {
  @for $i from 1 through 10 {
    > div:nth-last-child(#{$i}) {
      // multiply by 10 for larger hue increments
      transform: rotateX(45deg) rotateY(0deg) rotateZ(25deg) translateX(50%) translateZ($i * 50px);
      width: 100px;
      height: 100px;
    }
  }
}
.layers {
  border: solid 1px orange;
  z-index: 999;

  min-height: 500px;

  position: relative;

  > div {
    position: absolute;
    bottom: 0;
    display: block;
    width: 100px;
    height: 100px;

    transition: all 0.3s ease-out;

  }

  > div:hover {
    border: solid 5px orange;
    background: orange !important;
    z-index: 999;
  }
  @for $i from 1 through 10 {
    > div:nth-child(#{$i}) {
      // multiply by 10 for larger hue increments
      background: lighten($primary, $i * 10);
      z-index: -$i;
    }
  }
}
</style>
