<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Text</h1>
      <q-toggle
        v-model="withLabel"
        label="With Label"
        color="primary"
      />

    <q-input
      dark
      standout
      v-model="variableInput"
      label="Variable Identifier"
      stack-label
      style="margin-bottom: 1em"
    />

    <q-input
      dark
      standout
      v-model="labelInput"
      label="Variable Identifier"
      stack-label
      style="margin-bottom: 1em"
    />

    <q-option-group
      v-model="typeGroup"
      :options="typeOptions"
      dark
      color="primary"
    />
  </div>
</template>

<script lang="ts">
import TextElement from './Text.vue'
import { getValueOfAttribute, setValueOfAttribute } from './BaseElement'

import { defineComponent, PropType, computed } from 'vue'
import { Element } from 'src/models/Grid';
import { useStore } from 'vuex';

import { storeKey } from 'src/store'

export enum TextType {
  Password = 'password',
  Email = 'email',
  Phone = 'tel',
  URL = 'url',
  Time = 'time',
  Date = 'date',
  Text = 'text'
}


export default defineComponent({
  extends: TextElement,

  props: {
    model: {
      required: true,
      type: Object as PropType<Element>
    },

    editable: {
      required: true,
      type: Boolean,
      default: () => false
    }
  },

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
        { label: 'Text', value: TextType.Text }
      ],

      typeGroup : 'text'
    }
  },

  mounted() {
    /*
    const type = this.typeInput;

    if(type) {
      this.typeGroup = type;
    }
    */
  },


/*
  @Watch('typeGroup')
  onChildChanged(val: String, oldVal: String) {
    this.setValueOfAttribute("type", val);
  }
  */




  setup(props) {
    const store = useStore(storeKey)
    const getValue = getValueOfAttribute;
    const setValue = setValueOfAttribute;

    const labelInput = computed({
      get () {
        return getValue('label', props.model) as string;
      },
      set (value: string) {
        setValue('label', value, props.model, store);
      }
    })

    const variableInput = computed({
      get () {
        return getValue('variable', props.model) as string;
      },

      set (value: string) {
        setValue('variable', value, props.model, store);
      }
    })

/*
    const typeInput = computed({
      get () {
        return props.type;
      },

      set (value: string) {
        setValue('label', value, props.model, store);
      }
    })
    */

    return {
      store,
      getValue,
      labelInput,
      variableInput,
      //typeInput
    }
  }
})
</script>

<style lang="scss" scoped>
.option-column {
  padding-left: 1em;
  padding-right: 1em;
  color: white;

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
