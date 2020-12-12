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
      <FlowGraphComponent/>    
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
import { defineComponent, ref } from '@vue/composition-api'
import EssentialLink from 'components/EssentialLink.vue'
import FlowGraphComponent from 'components/FlowGraphComponent.vue'

export default defineComponent({
  name: 'MainLayout',
  components: { FlowGraphComponent },

  setup () {
  }
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
