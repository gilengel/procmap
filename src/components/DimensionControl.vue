<template>
  <div>
    <q-input
      dark
      dense
      filled
      v-model="value.width"
      @input="changeWidth"
    >
      <template v-slot:prepend>
        <q-icon name="las la-arrows-alt-h" />
      </template>
    </q-input>

    <q-input
      dark
      dense
      filled
      v-model="value.height"
      @input="changeHeight"
    >
      <template v-slot:prepend>
        <q-icon name="las la-arrows-alt-v" />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from '@vue/composition-api'

import { NodeEditor } from 'rete'
import { Dimension } from 'components/models'

export default defineComponent({
  name: 'DimensionControl',

  props: {
    value: {
      type: Object as () => Dimension,
      default: {
        width: 0,
        height: 0
      }
    },
    emitter: NodeEditor,
    ikey: String,
    getData: {
      type: Function as PropType<(key: string) => unknown>
    },
    putData: {
      type: Function as PropType<(key: string, data: unknown) => void>
    }
  },

  methods: {
    changeWidth (value: string) {
      try {
        // eslint-disable-next-line no-eval
        this.value.width = eval(value.replace(/[^-()\d/*+.]/g, '')) as number
      } catch (e) {
        console.log('Show error that value is not valid')
      }

      if (this.emitter) {
        this.emitter.trigger('process')
      }
    },
    changeHeight (value: string) {
      try {
        // eslint-disable-next-line no-eval
        this.value.height = eval(value.replace(/[^-()\d/*+.]/g, '')) as number
      } catch (e) {
        console.log('Show error that value is not valid')
      }

      if (this.emitter) {
        this.emitter.trigger('process')
      }
    }
  }
})
</script>

<style></style>
