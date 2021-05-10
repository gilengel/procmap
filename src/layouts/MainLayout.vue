<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page>
        <FlowEditorComponent dockPosition="left" :dockWidth="20" style="height: 100vh" flowTitle="Flow Graph" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import FlowEditorComponent from 'src/components/flow/FlowEditorComponent.vue'

export default defineComponent({
  name: 'MainLayout',
  components: { FlowEditorComponent }
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
