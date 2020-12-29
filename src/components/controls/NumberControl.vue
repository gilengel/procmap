<template>
  <q-input style="max-width: 120px"
    dark
    dense
    filled
    v-model="value"
    hide-bottom-space
    type="number"
    @input="change"
    :rules="[ val => isValid(val) || 'Use a number between 0 and 2000']"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'

import VueFlowControl from '../FlowControl'

@Component
export default class NumberControl extends VueFlowControl {
  // @Prop() value!: number;
 value = 20;

 change (e: string) {
   if (!(this.putData instanceof Function)) {
     throw new Error('NumberControls putData was not specified. Make sure you pass it along as an argument while creating a new instance of it')
   }

   if (!this.emitter) {
     throw new Error('NumberControls emitter was not specified. Make sure you pass it along as an argument while creating a new instance of it')
   }

   if (!this.propertyKey) {
     throw new Error('NumberControls propertyKey was not specified. Make sure you pass it along as an argument while creating a new instance of it')
   }

   const newPropertyValue = parseInt(e)
   if (this.isValid !== undefined && (this.isValid as unknown as ((e: unknown) => boolean))(newPropertyValue)) {
     this.putData(this.propertyKey, newPropertyValue)
     // this.emitter.trigger('process')
   }
 }

 mounted () {
   const property = this.getValue<number>()
   this.value = property
 }
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
