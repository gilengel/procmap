<template>
  <div class="option">
    <h1 class="text-subtitle1 text-white">{{label}}</h1>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        label: {
            required: true,
            type: String
        }
    }
})
</script>

<style lang="scss" scoped>
    .option {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }
</style>