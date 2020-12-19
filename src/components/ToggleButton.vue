<template>
  <q-btn flat round dark :color="checked ? 'primary' : 'white'" :icon="checked ? icon : (disableIcon !== '' ? disableIcon : icon)" @click="checked = !checked">
  </q-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop, VModel } from 'vue-property-decorator'

@Component
export default class ToggleButton extends Vue {
    @Prop({ default: 'default value' }) readonly icon!: string
    @Prop({ default: '' }) readonly disableIcon?: string

    @VModel({ type: Boolean }) checked!: boolean;
}
</script>

<style>

</style>
