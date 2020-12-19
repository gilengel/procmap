<template>
  <q-input style="max-width: 120px"
    dark
    dense
    filled
    v-model="value"

    type="number"
    @input="change"
    :rules="[ val => isValid(val) || 'Use a number between 0 and 2000']"
  />
</template>

<script lang="ts">
import { NodeEditor } from 'rete'

import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class NumberControl extends Vue {
  value = 20;

  @Prop(NodeEditor) emitter: NodeEditor | undefined;
  @Prop(String) ikey: string | undefined;
  @Prop(Function) getData: unknown
  @Prop(Function) putData: unknown
  @Prop({ type: Function, default: () => { return true } }) isValid!: undefined

  change (e: string) {
    if (!(this.putData instanceof Function)) {
      return
    }

    if (!this.emitter) {
      return
    }

    this.putData(this.ikey, { value: parseInt(e), processed: false })
    this.emitter.trigger('process')
  }

  mounted () {
    const property = (this.getData as (v: string) => unknown)(this.ikey as string)
    if (property !== undefined && (property as Record<string, unknown>).value !== undefined) {
      this.value = (property as Record<string, unknown>).value as number
    }
  }
}
</script>

<style></style>
