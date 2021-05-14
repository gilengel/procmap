<template>
  <div class="linked-control column q-gutter-md">
    <div class="col">
      <q-input dark v-model="variableName" label="Name" stack-label dense />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import VueFlowControl from "./FlowControl";

@Component
export default class TypeControl extends VueFlowControl {
  variableName: string = "";
}
</script>

<style lang="scss" scoped>
</style>
