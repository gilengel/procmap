<template>
  <div>
    <q-toolbar class="bg-black text-white vue-draggable-handle">
      <q-toolbar-title>{{ title }}</q-toolbar-title>
    </q-toolbar>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'Widget'
})
export default class Widget extends Vue {
  @Prop({ default: 'Blank Widget' }) readonly title!: string;
}
</script>

<style lang="scss">
.q-toolbar {
  background: $dark !important;
}

.vue-draggable-handle {
  position: relative !important;
  width: auto !important;
  padding: 0 !important;
}
</style>
