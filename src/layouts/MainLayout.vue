<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page>
        <MapEditorComponent />
      </q-page>
    </q-page-container>
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
