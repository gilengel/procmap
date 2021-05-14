<template>
  <div class="linked-control column q-gutter-md">
    <div class="col">
      <q-btn
        flat
        dark
        icon="las la-plus-circle"
        label="Add Input"
        color="white"
        @click="addVariable"
      />
      <q-input dark v-model="variableName" label="Name" stack-label dense />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import VueFlowControl from "./FlowControl";
import registeredSockets from "components/flow/models/Sockets";

import Rete from "rete";

@Component
export default class OutputControl extends VueFlowControl {
  variableName: string = "";

  addVariable() {
    const firstInput = this.node.inputs.values().next();

    const socket = registeredSockets.get("variable");
    if (!socket) {
      throw new Error("Socket <variable> is not registered");
    }

    console.log(this.node.inputs.size)
    const pin = new Rete.Input(
      `variable_${this.node.inputs.size}`,
      `variable_${this.node.inputs.size}`,
      socket
    );

    this.node.addInput(pin);
    this.node.update()
  }
}
</script>

<style lang="scss" scoped>
</style>
