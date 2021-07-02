<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Text</h1>
    <q-toggle v-model="withLabel" label="With Label" color="primary" />

    <q-input
      standout
      v-model="variableInput"
      label="Variable Identifier"
      stack-label
      style="margin-bottom: 1em"
    />

    <q-input
      standout
      v-model="labelInput"
      label="Variable Identifier"
      stack-label
      style="margin-bottom: 1em"
    />

    <q-option-group
      v-model="typeGroup"
      :options="typeOptions"
      color="primary"
    />
  </div>
</template>

<script lang="ts">
import BaseElement from './BaseElement';

import { defineComponent, computed, watch, ref } from 'vue';
import { useStore } from 'vuex';

import { storeKey } from 'src/store';
import { getValueOfAttribute, setValueOfAttribute } from 'src/components/ui_builder/BaseElement'


import textElement from 'src/composables/TextElement';

export enum TextType {
  Password = 'password',
  Email = 'email',
  Phone = 'tel',
  URL = 'url',
  Time = 'time',
  Date = 'date',
  Text = 'text',
}

export default defineComponent({
  extends: BaseElement,

  data() {
    return {
      identifier: 'text',

      typeOptions: [
        { label: 'Password', value: TextType.Password },
        { label: 'Email', value: TextType.Email },
        { label: 'Phone', value: TextType.Phone },
        { label: 'URL', value: TextType.URL },
        { label: 'Time', value: TextType.Time },
        { label: 'Date', value: TextType.Date },
        { label: 'Text', value: TextType.Text },
      ],
    };
  },

  setup(props) {
    const store = useStore(storeKey);

    const variableInput = computed({
      get(): boolean {
        return getValueOfAttribute('variable', props.model) as boolean;
      },

      set(value: boolean) {
        setValueOfAttribute('variable', value, props.model, store);
      },
    });

    const labelInput = computed({
      get(): boolean {
        return getValueOfAttribute('label', props.model) as boolean;
      },

      set(value: boolean) {
        setValueOfAttribute('label', value, props.model, store);
      },
    });    

    const typeGroup = ref('text')
    watch(typeGroup, (type) => {
        setValueOfAttribute('type', type, props.model, store);
    })    

    return {
      ...textElement(props.model, store),
      store,
      variableInput,
      labelInput,
      typeGroup
    };
  },
});
</script>

<style lang="scss" scoped>
.option-column {
  padding-left: 1em;
  padding-right: 1em;

  .preview {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 1em;
  }
}
.q-icon {
  font-size: 3em;
  margin: 0.3rem;
}
</style>
