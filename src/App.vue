<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "App"
});
</script>

<style lang="scss">
body {
  font-size: 0.8em;
}

.q-toolbar {
  font-size: 0.5em !important;

  min-height: 36px;

  .q-toolbar__title {
    padding: 0;
    margin: 0;
    font-size: 2.2em;
  }
}
</style>
