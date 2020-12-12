<template>
  <div>
    <q-input
      color="grey-3"
      label-color="orange"
      @input="change($event)"
      outlined
      v-model="value"
      label="Label"
    >
      <template v-slot:append>
        <q-icon name="event" color="orange" />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ImageControl',

  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],

  data () {
    return {
      value: ''
    }
  },

  methods: {
    change (e: string) {
      console.log(e)
      this.value = e
      this.update()
    },
    update () {
      if (this.ikey) this.putData(this.ikey, this.value)
      this.emitter.trigger('process')
    }
  },
  mounted () {
    this.value = this.getData(this.ikey)
  }
}
</script>

<style></style>
