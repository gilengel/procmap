<template>
  <div class="vp_renderer">
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title>
        SVG Preview
      </q-toolbar-title>
      <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
      <q-btn flat round dense icon="gamepad" />
    </q-toolbar>

    <canvas ref="viewport" class="viewport" resize></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as paper from '';
export default Vue.extend({
  name: "SVGRenderer",

  mounted() {
    //this.scope = new paper.PaperScope();
    //this.scope.setup(this.$refs.viewport as HTMLElement);
  }
});
</script>



<style>
.vp_renderer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.viewport {
  flex-grow: 2;
}
</style>
