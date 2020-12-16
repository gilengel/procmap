<template>
  <div>
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input
        dark
        dense
        filled
        v-model="numPoints"
        type="number"
        @input="change"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { NodeEditor } from 'rete'
import { defineComponent, PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PointsControl',

  props: {
    emitter: NodeEditor,
    ikey: String,
    getData: {
      type: Function as PropType<(key: string) => unknown>
    },
    putData: {
      type: Function as PropType<(key: string, data: unknown) => void>
    }
  },

  data () {
    return {
      numPoints: 20
    }
  },

  methods: {
    change (e: string) {
      if (!this.putData) {
        return
      }

      this.putData('numPoints', e)
      this.update()
    },
    update () {
      // const numbers = this.getData('amount')
      // if (this.ikey) this.putData(this.ikey, amount);

      if (!this.emitter) {
        return
      }

      this.emitter.trigger('process')
    }
  },
  mounted () {
    // this.putData('number', this.getData(this.ikey))
    this.update()
  }
})
</script>

<style></style>
