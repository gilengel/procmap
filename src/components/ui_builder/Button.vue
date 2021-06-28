<template>
  <div>
    <q-btn
      text-color="white"
      :flat="!isHighlighted"
      :label="label"
      :icon="previewIcon"
      :type="type"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseElement from './BaseElement.vue';

export default defineComponent({
  extends: BaseElement,

    setup() {
        /*
        const type = this.getValueOfAttribute<string>('type')
        const label = this.getValueOfAttribute<string>('label')
        const isHighlighted = this.getValueOfAttribute<boolean>('isHighlighted')
        const icon = this.getValueOfAttribute<string>('icon')
        const hasIcon = this.getValueOfAttribute<boolean('hasIcon')
        const previewIcon = computed(() => {
            let icon;
            if (this.hasIcon && this.icon !== '') {
                icon = this.icon;
            }
            return icon;
        })
        */
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
