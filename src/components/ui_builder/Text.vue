<template>
  <div class="el-text">
    <template v-if="withLabel">
    <q-input v-if="editable"
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
      placeholder="Heading"
      :type="type"
      :readonly="!editable"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseElement from './BaseElement'
import { useStore } from 'vuex'
import { storeKey } from 'src/store'

import textElement from 'src/componsables/TextElement'

export default defineComponent({
  extends: BaseElement,

  data() {
    return {
      // Used if the text element is not connected to a parent element
      tempValue: '',
      hover: false
    }
  },

  comnputed: {

    variable(): string {
      //return this.getValue('variable', this.model) as string
      return 'variable'
    },

    isConnected(): boolean {
      const element = this.model
      const connectedOutputPin = element.outputs?.find(pin => pin.connection)
      const connectedInputPin = element.inputs?.find(pin => pin.connection)

      return connectedOutputPin !== undefined || connectedInputPin !== undefined;
    },

    classList(): Array<string> {
      //return this.getValue('classList', this.model) as string[]

      return []
    }
  },




/*
  @Watch('valueInput')
  onValueInputChanged(val: string, oldVal: string) {
    this.setOutputConnectionValue(val);
    this.tempValue = val;
  }
  */



  setOutputConnectionValue(/*value: string*/) {
    // next inform all connected elements via reactive connection value
    const element = this.model ;
    if(!element.outputs) {
      return
    }

    for(const output of element.outputs) {
      if(output.connection) {
        // TODO
        //this.setConnectionValue({ connection : output.connection, value: value })
      }
    }
  },

  setup(props) {
    const store = useStore(storeKey)

    return {
        ...textElement(props.model, store),
        store
    }
  }




})
</script>

<style lang="scss">
.el-text {
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
