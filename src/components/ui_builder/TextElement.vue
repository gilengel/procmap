<template>
  <div>
    <q-input v-if="editable"
      dark
      placeholder="Label"
      v-model="label"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    />
    <label v-else>
      {{label}}
    </label>
    <q-input
      dark
      placeholder="Text"
      :type="type"
      :readonly="editable != false"
      v-model="valueInput"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    />
  </div>
</template>

<script lang="ts">
import BaseElement from './BaseElement.vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'TextElement'
})
export default class TextElement extends BaseElement {
  @Prop({default: false}) editable!: boolean;

  @Prop() value!: string;

  get valueInput() {
    return this.value;
  }

  set valueInput(val: string) {
    this.$emit('update:value', val)
  }

  get label(): string {
    return this.getValueOfAttribute('label')
  }

  get type(): String {
    return this.getValueOfAttribute('type')
  }

  get variable(): String {
    return this.getValueOfAttribute('variable')
  }

  hover = false
}
</script>

<style lang="scss">
</style>
