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
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component';
import { Drag } from '../../mixins/Drag'
import { Drop } from '../../mixins/Drop'

@Component({
  name: 'TextElement'
})
export default class TextElement extends mixins(Drag, Drop) {
  @Prop({default: false}) editable!: boolean;

  @Prop() value!: string;

  @Prop({default: false}) withLabel!: boolean;

  get valueInput() {
    return this.value;
  }

  set valueInput(val: string) {
    this.$emit('update:value', val)
  }

  get label(): string {
    return "LABEL"
    //return this.getValueOfAttribute('label')
  }

  get type(): String {
    return "text";
    //return this.getValueOfAttribute('type')
  }

  get variable(): String {
    //return this.getValueOfAttribute('variable')
  }

  hover = false
}
</script>

<style lang="scss">
.el-text {
}
</style>
