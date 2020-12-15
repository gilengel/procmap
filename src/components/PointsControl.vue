<template>
  <div>
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input
        dark
        dense
        filled
        v-model="numPoints"
        type="number"
        @input="change($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as d3 from "d3";

export default Vue.extend({
  name: "PointsControl",

  props: ["readonly", "emitter", "ikey", "getData", "putData"],

  data() {
    return {
      numPoints: 200,
    };
  },

  methods: {
    change(e: string) {
      this.putData('numPoints', e);
      this.update();
    },
    update() {

      //const numbers = this.getData('amount')
      //if (this.ikey) this.putData(this.ikey, amount);
      this.emitter.trigger("process");
    }
  },
  mounted() {
    //this.putData('number', this.getData(this.ikey))
    this.update()
  }
});
</script>

<style></style>
