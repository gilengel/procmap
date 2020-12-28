<template>
  <q-bar>
    <q-btn dense flat round icon="lens" size="8.5px" color="red" @click="close" />
    <q-btn dense flat round icon="lens" size="8.5px" color="yellow" @click="minimize" />
    <q-btn dense flat round icon="lens" size="8.5px" color="green" @click="maximize" />
    <div class="col text-center text-weight-bold q-electron-drag">
      <q-icon size="sm" name="las la-map-marked" />
      Procedural Map Generator
    </div>
  </q-bar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class MapEditorComponent extends Vue {
  minimize () {
    if (process.env.MODE === 'electron') {
      this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
    }
  }

  maximize () {
    if (process.env.MODE === 'electron') {
      const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()

      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    }
  }

  close () {
    if (process.env.MODE === 'electron') {
      this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
    }
  }
}
</script>

<style lang="scss"></style>
