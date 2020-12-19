<template>
  <q-layout view="hHh lpR fFf">

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
        <q-icon size='lg' name="las la-save" />
        <q-icon size='lg' name="las la-download" />
        <q-icon size='lg' name="las la-upload" />

        <q-toolbar-title>
        </q-toolbar-title>

        <q-icon size='lg' name="las la-heart" />
        <q-icon size='lg' name="las la-piggy-bank" />
      </q-toolbar>
    </q-header>

      <q-page-container>
        <q-page>
          <MapEditorComponent />
        </q-page>
      </q-page-container>
<!--
    <q-footer class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          Options
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
-->
  </q-layout>
</template>

<!--<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Nantu App
        </q-toolbar-title>

        <div>v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

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
-->
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
