<template>
  <div class="linked-control column q-gutter-md">
      <div class="col">
        <q-input dark v-model="variableName" label="Name"  stack-label dense />
      </div>
      <div class="col">
        <q-select dark filled v-model="variableType" :options="options" label="Type" stack-label dense />

      </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'

import { ElementAttributeType } from 'src/models/Grid'

import VueFlowControl from './FlowControl'

@Component
export default class VariableControl extends VueFlowControl {
  variableName: string = '';

  variableType = null;

  get options() {
    const result: Array<string> = [];
    const keys = Object.keys(ElementAttributeType)
    for(const value in keys) {
      result.push(keys[value])
    }

    return result;
  }
}
</script>

<style lang="scss" scoped>

</style>
