<template>
  <div class="el-text">
    <template v-if="withLabel">
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
    </template>
    <q-input
      dark
      placeholder="Heading"
      :type="type"
      :readonly="editable != false"
      v-model="valueInput"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import BaseElement from './BaseElement.vue';

@Component({
  name: 'HeadingElement'
})
export default class HeadingElement extends BaseElement {
  @Prop({default: false}) editable!: boolean;

  @Prop() value!: string;

  get valueInput() {
    return this.value;
  }

  set valueInput(val: string) {
    this.$emit('update:value', val)
  }

  get withLabel(): boolean {
      return this.getValueOfAttribute('withLabel')
  }

  set withLabel(value: boolean) {
      this.setValueOfAttribute('withLabel', value)
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
