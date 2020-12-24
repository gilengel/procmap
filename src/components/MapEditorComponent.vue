<template>
  <div class="map-editor">

    <q-header class="bg-primary text-white">

    <q-bar>
      <q-btn dense flat round icon="lens" size="8.5px" color="red" />
      <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
      <q-btn dense flat round icon="lens" size="8.5px" color="green" />
      <div class="col text-center text-weight-bold">
              <q-icon
        size='sm'
        name="las la-map-marked"
      />
        Procedural Map Generator
      </div>
    </q-bar>

      <q-toolbar>
        <q-btn dark round flat icon="las la-download" @click="saveSystem" />
        <q-btn dark round flat icon="las la-upload" @click="loadSystem"/>

        <q-file ref="file" clearable filled color="purple-12" label="Label" v-model="file"  style="visibility: collapse" ></q-file>


        <q-toolbar-title>
        </q-toolbar-title>

        <q-icon size='lg' name="las la-heart" />
        <q-icon size='lg' name="las la-piggy-bank" />
      </q-toolbar>
    </q-header>


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
          <template v-for="category in availableComponentCategories">
            <q-item-label header v-bind:key="category.label">{{category.label}}</q-item-label>

              <q-item v-for="component in category.components" :key="component.id" draggable="true" v-on:dragstart="dragstart(component.id, $event)" >
                <q-item-section avatar>
                  <q-icon :name="component.icon" />
                </q-item-section>
                <q-item-section>{{component.label}}</q-item-section>
              </q-item>

          </template>
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

            <FlowGraphComponent />
          </template>

          <template v-slot:after>
            <q-page>
              <q-splitter horizontal v-model="verticalSplitter" class="right-splitter">
                <template v-slot:before>
                  <Preview2D/>
                </template>

                <template v-slot:after>
                  <div class="q-pa-md bg-grey-10 text-white">
                    <q-list dark bordered separator style="max-width: 318px">
                      <q-item tag="label">
                        <q-item-section>
                          <q-item-label>Notifications</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                          <q-checkbox value="true" />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </template>
              </q-splitter>
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
import { Vue, Component, Prop, PropSync, Watch } from 'vue-property-decorator'

import { getRegisteredFlowComponents, MetaFlowComponent } from './flow'
import { getRegisteredComponentCategories, MetaFlowCategory } from './flow/Index'

import * as fs from 'fs'

import {
  Getter, Action
} from 'vuex-class'
import { QFile } from 'quasar'



@Component({
  components: { ToggleButton, FlowGraphComponent, Preview2D }
})
export default class MapEditorComponent extends Vue {
  showMinimap = true;

  left = true;

  map: RandomMap = new RandomMap({ width: 1024, height: 1024 }, []);

  availableComponentCategories: Array<MetaFlowCategory> = [];

  geometry: Record<string, unknown> = {};

  horizontalSplitter = 70;

  verticalSplitter = 50;

  file = []

   @Getter('system') getterSystem

   @Action('saveSystem') storeLoadedSystem!: ({system: JSON, imported: boolean}) => void

  @Watch('file')
  onSelectedMapFileChanged (newValue: File) {
    const file = newValue

    fs.readFile(file.path, 'utf-8', (err, data) => {
      if(err){
        alert("An error ocurred reading the file :" + err.message);
        return;
      }

      this.storeLoadedSystem({system: JSON.parse(data), imported: true})
    });
  }


  mounted () {
    this.availableComponentCategories = getRegisteredComponentCategories()

    this.$store.commit('increment')
  }

  saveSystem() {
    let payload = JSON.stringify(this.getterSystem);
    var a = document.createElement("a");
    var file = new Blob([payload], {type: "text/plain"});
    a.href = URL.createObjectURL(file);
    a.download = 'json.txt';
    a.click();
    
  }

  loadSystem() {
    (this.$refs.file as QFile).pickFiles();
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
