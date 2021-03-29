<template>
  <div>
    <q-input
      dark
      standout
      v-model="identifier"
      label="Variable Identifier"
      stack-label
    />

    <q-option-group
      v-model="typeGroup"
      :options="typeOptions"
      dark
      color="yellow"
    />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Options from '../ui_builder/Options.vue'

export enum TextType {
  Password = 'password',
  Email = 'email',
  Phone = 'tel',
  URL = 'url',
  Time = 'time',
  Date = 'date',
  Text = 'text'
}

@Component({
  name: 'TextOptions'
})
export default class TextOptions extends Options {
  identifier = 'text'

  typeGroup = 'text'

  typeOptions = [
    { label: 'Password', value: TextType.Password },
    { label: 'Email', value: TextType.Email },
    { label: 'Phone', value: TextType.Phone },
    { label: 'URL', value: TextType.URL },
    { label: 'Time', value: TextType.Time },
    { label: 'Date', value: TextType.Date },
    { label: 'Text', value: TextType.Text }
  ]
}
</script>

<style lang="scss">
</style>
