<template>
  <div>
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input
        dark
        dense
        filled
        v-model="numPoints"
        max=400
        type="number"
        @input="change"
        :rules="[ val => isValid(val) || 'Use a number between 0 and 2000']"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { NodeEditor } from 'rete'

import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class NumberControl extends Vue {
  numPoints = 20;

  @Prop(NodeEditor) emitter: NodeEditor | undefined;
  @Prop(String) ikey: string | undefined;
  @Prop(Function) getData: unknown
  @Prop(Function) putData: unknown
  @Prop({ type: Function, default: () => { return true } }) isValid!: undefined

  change (e: string) {
    if (!(this.putData instanceof Function)) {
      return
    }

    this.putData('numPoints', e)
    this.update()
  }

  update () {
    // const numbers = this.getData('amount')
    // if (this.ikey) this.putData(this.ikey, amount);

    if (!this.emitter) {
      return
    }

    this.emitter.trigger('process')
  }

  mounted () {
    console.log(this.isValid)

    // this.putData('number', this.getData(this.ikey))
    this.update()
  }
}
</script>

<style></style>
