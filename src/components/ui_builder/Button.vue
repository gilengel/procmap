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

import BaseElement from './BaseElement'

import buttonElement from 'src/composables/ButtonElement'

export default defineComponent({
  extends: BaseElement,

  setup(props) {
    const store = useStore(storeKey)

    return {
      store,
      ...buttonElement(props.model, store)
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
