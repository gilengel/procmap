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

import { NodeEditor } from 'rete'
import ToggleButton from './ToggleButton.vue'

import { Vue, Component, Prop } from 'vue-property-decorator'
import { evaluate } from 'mathjs'

@Component({
  components: { ToggleButton }
})
export default class DimensionControl extends Vue {
  @Prop(NodeEditor) emitter: NodeEditor | undefined;
  @Prop(String) ikey: string | undefined;
  @Prop(Function) getData: unknown
  @Prop(Function) putData: unknown
  @Prop({ type: Function, default: () => { return true } }) isValid!: undefined

  width = 512;
  height = 512;

  linked = false;

  mounted () {
    const property = (this.getData as (v: string) => unknown)(this.ikey as string) as Record<string, unknown>
    if (property !== undefined && property.value !== undefined) {
      this.width = (property.value as Record<string, unknown>).width as number
      this.height = (property.value as Record<string, unknown>).height as number
    }
  }

  change (value: string, property: string) {
    let numValue: string | number = value
    try {
      numValue = parseInt(evaluate(value.replace(/[^-()\d/*+.]/g, '')))
    } catch {
      // empty catch is necessary to omit the thrown error by mathjs if the expression
      // is invalid, invalid arguments are handled by input validation
    } finally {
      if (this.linked) {
        this.width = numValue as number
        this.height = numValue as number
      }

      if (property !== 'width' && property !== 'height') {
        console.error('dimension control value changed without property specification. Do not know what to do :(')
      }

      if (property === 'width') {
        this.width = numValue as number
      }

      if (property === 'height') {
        this.height = numValue as number
      }

      if (typeof this.width === 'number' && typeof this.height === 'number' && this.putData instanceof Function && this.emitter) {
        this.putData(this.ikey, { value: { width: this.width, height: this.height }, processed: false })

        this.emitter.trigger('process')
      }
    }
  }
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
