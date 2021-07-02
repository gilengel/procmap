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
import { defineComponent, computed } from 'vue'
import BaseElement, { getValueOfAttribute, setValueOfAttribute } from './BaseElement'
import { useStore } from 'vuex'
import { storeKey } from 'src/store'

export default defineComponent({
  extends: BaseElement,

  props: {
    editable: {
      required: true,
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      // Used if the text element is not connected to a parent element
      tempValue: '',
      hover: false
    }
  },

  comnputed: {

    variable(): string {
      return this.getValue('variable', this.model) as string
    },

    isConnected(): boolean {
      const element = this.model
      const connectedOutputPin = element.outputs?.find(pin => pin.connection)
      const connectedInputPin = element.inputs?.find(pin => pin.connection)

      return connectedOutputPin !== undefined || connectedInputPin !== undefined;
    },

    classList(): Array<string> {
      return this.getValue('classList', this.model) as string[]
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
    const getValue = getValueOfAttribute;
    const setValue = setValueOfAttribute;

    const withLabel = computed({
      get(): boolean {
        return getValue('withLabel', props.model) as boolean
      },

      set(value: boolean) {
        setValue('withLabel', value, props.model, store)
      }
    })

    const label = computed(() =>
      getValue('label', props.model) as string
    );

    const type = computed(() =>
      getValue('type', props.model) as string
    );



    return {
      store,
      getValue,
      setValue,
      withLabel,
      label,
      type
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
