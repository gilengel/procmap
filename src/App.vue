<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex'

import { Style } from 'src/models/Style'

export default defineComponent({
  name: 'App',

  methods: {
      ...mapActions(['Style/setStyle'])
  },

  created() {
    void this['Style/setStyle'](Style.Light)
  }




})
</script>

<style lang="scss">
#q-app {
    //background: green;
}
</style>
