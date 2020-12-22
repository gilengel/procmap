<template>
  <div class="linked-control">
    <div class="inputs">
      <q-input style="max-width: 120px"
        dark
        dense
        filled
        v-model="width"
        @input="e => change(e, 'width')"
      >
        <template v-slot:prepend>
          <q-icon name="las la-arrows-alt-h" />
        </template>
      </q-input>

      <q-input style="max-width: 120px"
        dark
        dense
        filled
        v-model="height"
        @input="e => change(e, 'height')"
      >
        <template v-slot:prepend>
          <q-icon name="las la-arrows-alt-v" />
        </template>
      </q-input>
    </div>

    <div :class="linked ? 'link highlight' : 'link'">
       <ToggleButton v-model="linked" icon="las la-link" disableIcon="las la-unlink"/>
    </div>
  </div>
</template>

<script lang="ts">

import VueFlowControl from '../FlowControl'
import ToggleButton from '../ToggleButton.vue'

import { Component } from 'vue-property-decorator'
import { evaluate } from 'mathjs'

import { Dimension } from '../models'

@Component({
  components: { ToggleButton }
})
export default class DimensionControl extends VueFlowControl {
  width = 0;
  height = 0

  linked = false;

  mounted () {
    const property = this.getValue<Dimension>()

    this.width = property.width
    this.height = property.height
  }

  change (value: string, property: string) {
    let numValue: string | number = value
    try {
      numValue = parseInt(evaluate(value.replace(/[^-()\d/*+.]/g, '')))

      if (isNaN(numValue)) {
        return
      }
      if (this.linked) {
        this.width = numValue
        this.height = numValue
      }

      if (property !== 'width' && property !== 'height') {
        console.error('dimension control value changed without property specification. Do not know what to do :(')
      }

      if (property === 'width' || property === 'height') {
        this[property] = numValue
      }

      if (typeof this.width === 'number' && typeof this.height === 'number' && this.putData instanceof Function && this.emitter) {
        this.putData(this.propertyKey, { width: this.width, height: this.height })

        this.emitter.trigger('process')
      }
    } catch {
      // empty catch is necessary to omit the thrown error by mathjs if the expression
      // is invalid, invalid arguments are handled by input validation
    }
  }
}
</script>

<style lang="scss">
.linked-control {
  display: flex;
  flex-direction: row;

  > .link {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  $width: 8px;
  > .link:before {
    left: 50%;
    transform: translateX(-$width);
    top: $width;
    bottom:  calc(50% + #{$width * 1.5});
    width: $width;

    border-right: 1px solid white;
    border-top: 1px solid white;
    position: absolute;
    content: "";
  }
  > .link:after {
    left: 50%;
    transform: translateX(-$width);
    bottom: $width;
    top:  calc(50% + #{$width * 1.5});
    width: $width;

    border-right: 1px solid white;
    border-bottom: 1px solid white;
    position: absolute;
    content: "";
  }

  > .highlight:before {
    border-right: 1px solid $primary;
    border-top: 1px solid $primary;
  }

  > .highlight:after {
    border-right: 1px solid $primary;
    border-bottom: 1px solid $primary;
  }

}

</style>
