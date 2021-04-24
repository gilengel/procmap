<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'App'
})
</script>

<style lang="scss">
body {
  font-size: 0.8em;
}

.q-toolbar {
  font-size: 0.5em !important;
  background: $dark !important;

  min-height: 36px;

  .q-toolbar__title {
    padding: 0;
    margin: 0;
    font-size: 2.2em;
  }
}

body {
  background: $dark-page;
}

html,
body {
  height: 100%;
}


.q-banner {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
}

.selected {
  outline: solid $secondary 2px;
  transition: outline 0.3s;
}

.linked {
    outline: solid $accent 4px;
    transition: outline 0.3s;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;

  z-index: 0;
}
</style>
