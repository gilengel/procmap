<template>
  <div>
    <div
      class="menububble shadow-3 rounded-borders"
      v-if="hover"
    >
      <q-btn
        flat
        stack
        color="white"
        label="Password"
        icon="las la-key"
      />
      <q-btn
        flat
        stack
        color="white"
        label="Email"
        icon="las la-at"
      />
      <q-btn
        flat
        stack
        color="white"
        label="URL"
        icon="las la-link"
      />
      <q-btn
        flat
        stack
        color="white"
        label="Date"
        icon="las la-calendar"
      />
      <q-btn
        flat
        stack
        color="white"
        label="Phone"
        icon="las la-phone"
      />
    </div>
    <q-input
      dark
      placeholder="Label"
      v-model="label"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    />
    <q-input
      dark
      placeholder="Text"
      readonly
      @mouseover="hover = true"
      @mouseleave="hover = false"
    />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Options from '../ui_builder/Options.vue'

@Component({
  name: 'TextElement'
})
export default class TextElement extends Options {
  label = ''

  hover = false
}
</script>

<style lang="scss">
</style>
