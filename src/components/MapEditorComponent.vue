<template>
  <div class="map-editor">
    <q-header class="bg-primary text-white">
      <template v-if="$q.platform.is.electron">
        <DekstopWindowTitleBar />
      </template>

      <q-toolbar>
        <q-btn dark round flat icon="las la-download" @click="saveSystem" />
        <q-btn dark round flat icon="las la-upload" @click="loadSystem" />

        <q-file
          ref="file"
          clearable
          filled
          color="purple-12"
          label="Label"
          v-model="file"
          style="visibility: collapse"
        ></q-file>

        <q-toolbar-title> </q-toolbar-title>

        <q-icon size="lg" name="las la-heart" />
        <q-icon size="lg" name="las la-piggy-bank" />
      </q-toolbar>
    </q-header>

    <q-splitter v-model="leftToolbar" style="height: 100%">
      <template v-slot:before>
        <q-page-container style="padding: 0">
          <q-page class="row no-wrap">
            <div class="col">
              <div class="column full-height">
                <q-scroll-area class="col" visible>
                  <MapNodesList />
                </q-scroll-area>
              </div>
            </div>
          </q-page>
        </q-page-container>
      </template>

      <template v-slot:after>
        <q-splitter horizontal v-model="rightToolbar" style="height: 100%">
          <template v-slot:before>
            <div class="column full-height">
              <Preview2D />
            </div>
          </template>

          <template v-slot:after>
            <div class="column full-height">
              <!--
              <q-scroll-area class="col q-pa-sm" visible>

              </q-scroll-area>
              -->
               <FlowGraphComponent />
            </div>
          </template>
        </q-splitter>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import ToggleButton from './ToggleButton.vue'
import FlowGraphComponent from './FlowGraphComponent.vue'
import Preview2D from './Preview2D.vue'
import MessageLog from './MessageLog.vue'
import DekstopWindowTitleBar from './DesktopWindowTitleBar.vue'

import { RandomMap } from 'components/models'
import { Vue, Component, Watch } from 'vue-property-decorator'

import { getRegisteredComponentCategories, MetaFlowCategory } from './flow/Index'

import { Platform, QFile } from 'quasar'

import MapNodesList from './MapNodesList.vue'

import * as fs from 'fs'

import { Getter, Action } from 'vuex-class'

@Component({
  components: {
    DekstopWindowTitleBar,
    MapNodesList,
    ToggleButton,
    FlowGraphComponent,
    Preview2D,
    MessageLog
  }
})
export default class MapEditorComponent extends Vue {
  left = true;

  map: RandomMap = new RandomMap({ width: 1024, height: 1024 }, []);

  availableComponentCategories: Array<MetaFlowCategory> = [];

  geometry: Record<string, unknown> = {};

  horizontalSplitter = 70;

  verticalSplitter = 50;

  file = [];

  // width of left toolbar
  leftToolbar = 10;

  // width of right toolbar
  rightToolbar = 50;

  @Getter('system') getterSystem;

  @Action('saveSystem') storeLoadedSystem!: ({
    system,
    imported
  }: {
    system: Map<string, unknown>;
    imported: boolean;
  }) => void;

  @Watch('file')
  onSelectedMapFileChanged (newValue: File) {
    const file = newValue

    fs.readFile(file.path, 'utf-8', (err, data) => {
      if (err) {
        alert('An error ocurred reading the file :' + err.message)
        return
      }

      // Save new map system into the vuex store
      this.storeLoadedSystem({
        system: JSON.parse(data) as Map<string, unknown>,
        imported: true
      })
    })
  }

  mounted () {
    this.availableComponentCategories = getRegisteredComponentCategories()
  }

  saveSystem () {
    const payload = JSON.stringify(this.getterSystem)
    var a = document.createElement('a')
    var file = new Blob([payload], { type: 'text/plain' })
    a.href = URL.createObjectURL(file)
    a.download = 'json.txt'
    a.click()
  }

  loadSystem () {
    (this.$refs.file as QFile).pickFiles()
  }
}
</script>

<style lang="scss" scoped>
.left {
  min-width: 200px;
  width: 10%;
}

.content {
  border: solid 4px orange;

  .left-toolbar {
    border: solid 4px limegreen;
    width: 100%;
  }

  .main-content {
    border: solid 5px red;
    //height: 100%;
    overflow: hidden;
  }

  .bottom-toolbar {
    border: solid 5px blue;
    height: 100%;
  }
}

.main-content {
  height: 100%;
}

.middle {
  flex-grow: 1;
  max-width: 90%;

  .right-splitter {
    .q-splitter__before {
      overflow: hidden;
    }

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
  }
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
      transform: rotateX(45deg)
        rotateY(0deg)
        rotateZ(25deg)
        translateX(50%)
        translateZ($i * 50px);
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

<!--
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
          -->
