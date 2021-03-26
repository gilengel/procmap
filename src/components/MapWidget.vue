<template>
  <Widget title="Map">
    <div>
      <l-map
        :zoom="zoom"
        :center="center"
        :bounds="bounds"
        :max-bounds="maxBounds"
        style="height: 500px; width: 100%"
      >
        <l-tile-layer :url="url" />
        <l-marker :lat-lng="marker" />
      </l-map>
    </div>
  </Widget>
</template>

<script lang="ts">
import Widget from "./Widget.vue";
import Vue from "vue";
import Component from "vue-class-component";

import { latLngBounds, latLng } from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

import "leaflet/dist/leaflet.css";

@Component({
  name: "MapWidget",

  components: {
    Widget,
    LMap,
    LTileLayer,
    LMarker
  }
})
export default class MapWidget extends Vue {
  zoom: number = 13;
  center: number[] = [0, 0];
  bounds: latLngBounds = latLngBounds([
    [40.70081290280357, -74.26963806152345],
    [40.82991732677597, -74.08716201782228]
  ]);
  maxBounds: latLngBounds = latLngBounds([
    [40.70081290280357, -74.26963806152345],
    [40.82991732677597, -74.08716201782228]
  ]);
  url: string = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  attribution: string =
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  marker: latLng = latLng(47.41322, -1.219482);
}
</script>

<style lang="scss">
.leaflet-control-attribution {
  visibility: hidden;
}
</style>
