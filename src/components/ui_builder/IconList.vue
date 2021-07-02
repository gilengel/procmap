<template>
  <div>
      <h2 class="text-subtitle2">{{ group.label }}</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface IconGroup {
    label: string
}

export default defineComponent({
    props: {
        group: {
            required: true,
            type: Object as PropType<IconGroup>
        }
    }
})
</script>

<style lang="scss" scoped>
</style>