<template>
  <div>
  <q-toolbar class="bg-black text-white">
    <q-toolbar-title> {{title}} </q-toolbar-title>
  </q-toolbar>
  <slot>
  
  </slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

const WidgetProps = Vue.extend({
  props: {
    title: String
  }
})

@Component({
    name: "Widget"
})
export default class Widget extends WidgetProps {}
</script>

<style lang="scss">
</style>