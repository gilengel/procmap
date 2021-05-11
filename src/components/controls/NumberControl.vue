<template>
  <h1 style="color: white">Beautiful</h1>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueFlowControl from './FlowControl'

@Component
export default class NumberControl extends VueFlowControl {

}
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
