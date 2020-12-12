<template>
  <div>
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title>
        Image Preview
      </q-toolbar-title>
      <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
      <q-btn flat round dense icon="gamepad" />
    </q-toolbar>

    <img v-bind:src="image" alt="" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ImageRenderer',

  props: ['image']
})
</script>

<style>
    img {
        width: 100%;
    }
</style>
