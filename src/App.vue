<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

import { RandomMap } from 'components/models'

export default defineComponent({
  name: 'App',

data () {
    return {
      map: new RandomMap({
        width: 1024,
        height: 1024
      }, [])
    }
  }
})
</script>
