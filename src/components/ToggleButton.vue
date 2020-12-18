<template>
  <q-btn flat round dark :color="checked ? 'primary' : ''" :icon="icon" @click="checked = !checked">
  </q-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, VModel } from 'vue-property-decorator'

@Component()
export default class ToggleButton extends Vue {
    @Prop({ default: 'default value' }) readonly icon!: string

    @VModel({ type: Boolean }) checked!: boolean;
}
</script>

<style>

</style>