<template>
  <div>
    <q-btn dark :flat="!model.isHighlighted" :label="model.label" :icon="previewIcon" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Options from "../ui_builder/Options.vue";
import { Getter, Action } from "vuex-class";
import IModel from '../../store/Model'

@Component({
  name: "ButtonElement",
})
export default class ButtonElement extends Vue {
  @Prop({ default: 'uuid' }) uuid!: string

  get model () {
    return this.getModel(this.uuid)
  }

  @Getter('model')
  getModel!: (uuid: string) => IModel

  @Action('updateModel')
  updateModel!: (params: IModel) => void

  hover: boolean = false;

  get previewIcon() {
    let icon = undefined;

    if (this.model.hasIcon && this.model.icon !== "") {
      icon = this.model.icon;
    }

    return icon;
  }
}
</script>

<style lang="scss">
</style>
