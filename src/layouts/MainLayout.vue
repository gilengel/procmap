<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Nantu App
        </q-toolbar-title>

        <div>v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <MapEditorComponent />
      <router-view />
    </q-page-container>

     <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import MapEditorComponent from 'components/MapEditorComponent.vue'

export default defineComponent({
  name: 'MainLayout',
  components: { MapEditorComponent }
})
</script>
<style lang="scss">
  body {
    background: rgb(30, 30, 30);

  }

  html,body {
      height:100%;
  }
</style>
