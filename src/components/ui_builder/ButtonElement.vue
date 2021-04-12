<template>
  <div>
    <q-btn
      dark
      text-color="white"
      :flat="!isHighlighted"
      :label="label"
      :icon="previewIcon"
      :type="type"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component';
import { Drag } from '../../mixins/Drag'
import { Drop } from '../../mixins/Drop'

@Component({
  name: 'ButtonElement'
})
export default class ButtonElement extends mixins(Drag, Drop) {

  get type(): String {
    return "button"
    //return this.getValueOfAttribute('type')
  }

  get label(): String {
    return "LABEL"
    //return this.getValueOfAttribute('label')
  }

  get isHighlighted(): boolean {
    return true
    //return this.getValueOfAttribute('isHighlighted')
  }

  get icon(){
    return 'las la-paperclip';
    //return this.getValueOfAttribute('icon')
  }

  get hasIcon(){
    return true;
    //return this.getValueOfAttribute('hasIcon')
  }

  hover = false;

  get previewIcon () {
    let icon

    if (this.hasIcon && this.icon !== '') {
      icon = this.icon
    }

    return icon
  }
}
</script>

<style lang="scss">
</style>
