<template>
  <div>
    <q-input
      dark
      dense
      filled
      v-model="value.width"
      @input="changeWidth()"
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
      @input="changeHeight()"
    >
      <template v-slot:prepend>
        <q-icon name="las la-arrows-alt-v" />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DimensionControl',

  props: ['value', 'emitter', 'ikey', 'getData', 'putData'],

  methods: {
    changeWidth () {
      this.updateWidth()
    },
    changeHeight () {
      this.updateHeight()
    },

    updateWidth () {
      try {
        this.value.width = eval(this.value.width.replace(/[^-()\d/*+.]/g, ''))
      } catch (e) {
        console.log('Show error that value is not valid')
      }
      this.emitter.trigger('process')
    },

    updateHeight () {
      try {
        this.value.height = eval(
          this.value.height.replace(/[^-()\d/*+.]/g, '')
        )
      } catch (e) {
        console.log('Show error that value is not valid')
      }

      console.log(this.emitter)
    }
  }
}
</script>

<style></style>
