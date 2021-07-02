<template>
  <div class="el-text">
    <h1>Heading</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseElement from './BaseElement';

export default defineComponent({
  extends: BaseElement,

  props: {
    editable: {
      required: true,
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="scss" scoped>
h1 {
    font-size: 2em;
    padding: 0;
    margin: 0;
}
</style>
