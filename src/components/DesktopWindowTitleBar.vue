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

import { QVueGlobals } from 'quasar'

import { BrowserWindow } from 'electron'

class QVueGlobalsWithElectron {
  electron = {
    remote: {
      BrowserWindow: BrowserWindow
    }
  }
}

@Component
export default class MapEditorComponent extends Vue {
  window: BrowserWindow|undefined

  mounted () {
    this.window = (this.$q as QVueGlobals & QVueGlobalsWithElectron).electron.remote.BrowserWindow.getFocusedWindow() as BrowserWindow
  }

  minimize () {
    if (process.env.MODE === 'electron' && this.window) {
      this.window.minimize()
    }
  }

  maximize () {
    if (process.env.MODE === 'electron' && this.window) {
      if (this.window.isMaximized()) {
        this.window.unmaximize()
      } else {
        this.window.maximize()
      }
    }
  }

  close () {
    if (process.env.MODE === 'electron' && this.window) {
      this.window.close()
    }
  }
}
</script>

<style lang="scss"></style>
