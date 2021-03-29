<template>
  <div>
    <q-btn
      dark
      :flat="!isHighlighted"
      :label="label"
      :icon="previewIcon"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Options from '../ui_builder/Options.vue'
import { Getter, Action } from 'vuex-class'
import IModel from '../../store/Model'

@Component({
  name: 'ButtonElement'
})
export default class ButtonElement extends Vue {
  @Prop({ default: 'uuid' }) uuid!: string

  get model () {
    return this.getModel(this.uuid)
  }

  protected getValueOfAttribute(name: String): any {
    const element = this.model as unknown as Element;
    const attribute = element.attributes.find(attribute => attribute.name === name);

    return attribute.value;
  }
  get label(): String {
    return this.getValueOfAttribute('label')
  }
  
  get isHighlighted(): String {
    return this.getValueOfAttribute('isHighlighted')
  }

  get icon(){
    return this.getValueOfAttribute('icon')
  }

  get hasIcon(){
    return this.getValueOfAttribute('hasIcon')
  }

  @Getter('model')
  getModel!: (uuid: string) => IModel

  @Action('updateModel')
  updateModel!: (params: IModel) => void

  hover = false;

  get previewIcon () {
    let icon

    if (this.hasIcon && this.icon !== '') {
      icon = this.icon
    }

    return icon
  }
}
</script>

<style lang="scss">
</style>
