<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Button</h1>

    <Option label="Label">
    <q-input placeholder="Label" v-model="labelInput" />
    </Option>

    <Option label="Type">
        <!--
        <q-option-group
          color="primary"
          :options="buttonOptions"
          label="Notifications"
          type="radio"
          v-model="typeInput"
        />
        -->
    </Option>

    <Option label="Highlighted">
      <q-toggle v-model="isHighlightedInput" color="primary" label="Highlighed?" />
    </Option>

    <Option label="With Icon?">
      <q-toggle v-model="hasIconInput" color="primary" label="With Icon?" />
    </Option>


    <Option label="Icon">
        <IconList :group="{ label: 'All'}" @setIcon="updateIcon"/>
    </Option>
  </div>
</template>

<script lang="ts">
import BaseElement from './BaseElement';
import IconList from 'src/components/ui_builder/IconList.vue'
import Option from './Option.vue'
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex';
import { storeKey } from 'src/store'
import buttonElement from 'src/componsables/ButtonElement'
import { getValueOfAttribute, setValueOfAttribute } from 'src/components/ui_builder/BaseElement'

export interface Button {
  identifier: string;
  hasIcon: boolean;
  isHighlighted: boolean;
  label: string;
  icon: string;
}

export default defineComponent({
  extends: BaseElement,

  components: {
      Option,
      IconList
  },

  setup(props) {
    const store = useStore(storeKey)

    const labelInput = computed({
      get(): boolean {
        return getValueOfAttribute('label', props.model) as boolean;
      },

      set(value: boolean) {
        setValueOfAttribute('label', value, props.model, store);
      },
    });


    const isHighlightedInput = computed({
      get(): boolean {
        return getValueOfAttribute('isHighlighted', props.model) as boolean;
      },

      set(value: boolean) {
        setValueOfAttribute('isHighlighted', value, props.model, store);
      },
    });

    const hasIconInput = computed({
      get(): boolean {
        return getValueOfAttribute('hasIcon', props.model) as boolean;
      },

      set(value: boolean) {
        setValueOfAttribute('hasIcon', value, props.model, store);
      },
    });

    const updateIcon = (icon: string) => {
      setValueOfAttribute('icon', icon, props.model, store);
    }

    return {
      store,
      ...buttonElement(props.model, store),
      isHighlightedInput,
      hasIconInput,
      labelInput,
      updateIcon
    }
  }
})
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
