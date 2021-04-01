<template>
  <div>
    <q-btn
      dark
      :flat="!isHighlighted"
      :label="label"
      :icon="previewIcon"
      :type="type"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import BaseElement from './BaseElement.vue'

@Component({
  name: 'ButtonElement'
})
export default class ButtonElement extends BaseElement {

  get type(): String {
    return this.getValueOfAttribute('type')
  }

  get label(): String {
    return this.getValueOfAttribute('label')
  }

  get isHighlighted(): String {
    return this.getValueOfAttribute('isHighlighted')
  }

  get icon(){
    return this.getValueOfAttribute('icon')
  }

  get hasIcon(){
    return this.getValueOfAttribute('hasIcon')
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
