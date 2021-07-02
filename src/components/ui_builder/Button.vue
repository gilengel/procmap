<template>
  <div>

    <q-btn
      :flat="!isHighlighted"
      :label="label"
      :icon="previewIcon"
      :type="type"
    />

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

import { storeKey } from 'src/store'

import BaseElement, { getValueOfAttribute } from './BaseElement'


export default defineComponent({
  extends: BaseElement,

  computed: {
    type(): string {
      return this.getValue('type', this.model) as string;
    },

    label(): string {
      return this.getValue('label', this.model) as string;
    },

    isHighlighted(): boolean {
      return this.getValue('isHighlighted', this.model) as boolean;
    },

    icon(): string {
      return this.getValue('icon', this.model) as string;
    },

    hasIcon(): boolean {
      return this.getValue('hasIcon', this.model) as boolean;
    },

    previewIcon() {
      let icon;

      if (this.hasIcon && this.icon !== '') {
        icon = this.icon;
      }

      return icon;
    },
  },

  setup() {
    const store = useStore(storeKey)
    const getValue = getValueOfAttribute;

    return {
      store,
      getValue
    }
  }
});
</script>

<style lang="scss" scoped>
div {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
