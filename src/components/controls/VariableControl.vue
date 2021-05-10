<template>
  <div class="linked-control">
    <h1>FOoooooooooooooooo</h1>

  </div>
</template>

<script lang="ts">
import { NodeEditor } from 'rete'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { evaluate } from 'mathjs'

import VueFlowControl from 'components/flow/FlowControl'

@Component
export default class VariableControl extends VueFlowControl {

  /*
  @Prop(NodeEditor) emitter: NodeEditor | undefined;
  @Prop(String) ikey: string | undefined;

  @Prop({ type: Function, default: () => { return true } }) isValid!: undefined
  x = 512;
  y = 512;
  linked = false;
  mounted () {
    const property = (this.getData as (v: string) => unknown)(this.ikey as string) as [number, number]
    if (property === undefined) {
      throw new Error(`could not set value for number control since the property with key ${this.ikey as string} is not specified as data on the node`)
    }
    this.x = property[0]
    this.y = property[0]
  }
  change (value: string, property: string) {
    let numValue: string | number = value
    try {
      numValue = parseInt(evaluate(value.replace(/[^-()\d/*+.]/g, '')))
    } catch {
      // empty catch is necessary to omit the thrown error by mathjs if the expression
      // is invalid, invalid arguments are handled by input validation
    } finally {
      if (property !== 'x' && property !== 'y') {
        console.error('dimension control value changed without property specification. Do not know what to do :(')
      }
      if (property === 'x') {
        this.x = numValue as number
      }
      if (property === 'y') {
        this.y = numValue as number
      }
      if (typeof this.x === 'number' && typeof this.y === 'number' && this.putData instanceof Function && this.emitter) {
        this.putData(this.ikey, [this.x, this.y])
        this.emitter.trigger('process')
      }
    }
  }
  */
}
</script>

<style lang="scss">
.linked-control {
  display: flex;
  flex-direction: row;
  > .inputs {
  }
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
