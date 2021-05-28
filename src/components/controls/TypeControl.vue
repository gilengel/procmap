<template>
  <div class="linked-control column q-gutter-md">
    <div class="col">
      <q-select  
        filled 
        v-model="newFilter"
        :options="filterOptions" 
        dense 
        color="secondary"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import VueFlowControl from "./FlowControl";

import { ElementAttributeType } from "src/models/Grid"

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

@Component
export default class TypeControl extends VueFlowControl {
  variableName: string = "";

  newFilter: string = "String";

  model: string = "";
  
  get filterOptions() {
    let a = [];
    for (const value of enumKeys(ElementAttributeType)) {
      a.push(ElementAttributeType[value]);
    }

    return a;
  }

  get options() {
    let result = [];
    for (const transform in ElementAttributeType) {
      result.push(transform);
    }

    return result;
  }
}
</script>

<style lang="scss" scoped>
</style>
