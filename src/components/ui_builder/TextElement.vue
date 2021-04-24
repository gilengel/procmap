<template>
  <div class="el-text" :class="classlist">
      <span style="color: white">{{isConnected}}</span>
      <span style="color: white">inputs = {{model.inputs.length}}</span>
      <span style="color: white">outputs = {{model.outputs.length}}</span>
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
import { LINKED } from '../../mixins/Linkage';

@Component({
  name: 'HeadingElement'
})
export default class HeadingElement extends BaseElement {
  @Prop({default: false}) editable!: boolean;

  @Prop() value!: string;

  get classlist() {
      let a = [];

      if(this.isConnected){
          a.push(LINKED)
      }

      return a.concat(this.model.classList)
  }

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

  get isConnected(): boolean { 
      return this.model.outputs.length > 0 || this.model.inputs.length > 0;
  }

  get classList(): Array<string> { 
    return this.getValueOfAttribute('classList')
  }

  hover = false
}
</script>

<style lang="scss">
.el-text {
    background: $dark-page;
    z-index: 2;

    user-select: none;
}
.el-text ::after {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    background: transparent;

    content: ' ';
}
</style>
