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
import { buildParameterPin, Direction } from "../flow/models/Component";
import TypeControlVue from 'components/controls/TypeControl.vue'



@Component
export default class OutputControl extends VueFlowControl {
  variableName: string = "";

  addVariable() {
    const inputsCount = this.node.inputs.size
    const id = `variable${inputsCount}`
    const a =  {
      type: `variable`,
      id: id,
      label: id,
      mandatory: true,

      control: {
        identifier: id,
        component: TypeControlVue
      }
    }
    buildParameterPin(this.$props.emitter, this.node, a, Direction.In)
    this.node.update()
  }
}
</script>

<style lang="scss" scoped>
</style>
