<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Button</h1>

    <div class="preview">
      <q-btn dark
        :flat="!isHighlightedInput"
        :label="labelInput"
        :icon="previewIcon"
      />
    </div>

    <q-input
      dark
      placeholder="Label"
      v-model="labelInput"
    />

    <label>Display Highlighted</label>
    <q-toggle
      v-model="isHighlightedInput"
      color="accent"
    />

    <label>Display Icon</label>
    <q-toggle
      v-model="hasIconInput"
      color="accent"
    />
    <div v-if="hasIconInput">
      <div v-for="group in groupedIcons">
        <h2 class="text-subtitle2">{{group.label}}</h2>

        <q-icon :name="icon" v-for="icon in group.icons" v-bind:class="{ selected: selected(icon) }" @click="setIcon(icon)" />
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Options from "../ui_builder/Options.vue";
import { Component, Prop } from 'vue-property-decorator'
import { Getter, Action } from "vuex-class";
import IModel from '../../store/Model'

export interface Button {
  identifier: string,
  hasIcon: boolean,
  isHighlighted: boolean,
  label: string,
  icon: string
}

@Component({
  name: "ButtonOptions",
})
export default class ButtonOptions extends Options {
  @Prop({ default: 'uuid' }) uuid!: string

  get model () {
    return this.getModel(this.uuid)
  }

  @Getter('model')
  getModel!: (uuid: string) => IModel

  @Action('updateModel')
  updateModel!: (params: IModel) => void

  set identifierInput(value: string) {
    this.updateModel({
      uuid: this.uuid,
      model: { identifier: value }
    })
  }

  get identifierInput() {
    return this.model.identifier;
  }

  set hasIconInput(value: boolean) {
    this.updateModel({
      uuid: this.uuid,
      model: { hasIcon: value }
    })
  }

  get hasIconInput() {
    return this.model.hasIcon;
  }

  set isHighlightedInput(value: boolean) {
    this.updateModel({
      uuid: this.uuid,
      model: { isHighlighted: value }
    })
  }

  get isHighlightedInput() {
    return this.model.isHighlighted;
  }

  set labelInput(value: string) {
    this.updateModel({
      uuid: this.uuid,
      model: { label: value }
    })
  }

  get labelInput() {
    return this.model.label;
  }

  set iconInput(value: string) {
    this.updateModel({
      uuid: this.uuid,
      model: { icon: value }
    })
  }

  get iconInput() {
    return this.model.icon;
  }

  get previewIcon() {
    let icon = undefined;

    if(this.hasIconInput && this.iconInput !== '') {
      icon = this.iconInput
    }

    return icon;
  }

  selected(icon: string) {
    return (icon === this.iconInput);
  }

  setIcon(icon: string) {
    this.iconInput = icon
  }

  groupedIcons = [
    { label: 'Automotive', icons: [
      'las la-car',
      'las la-car-side',
      'las la-truck',
      'las la-ambulance',
      'las la-charging-station',
      'las la-gas-pump',
      'las la-shuttle-van',
      'las la-bus',
      'las la-car-battery',
      'las la-tachometer-alt',
      'las la-truck-pickup',
      'las la-car-crash',
      'las la-motorcycle',
      'las la-taxi'
    ]
    },
    { label: 'Chat', icons: [
      'las la-comment-alt',
      'las la-comments',
      'las la-comment-dots',
      'las la-phone-alt',
      'las la-phone-slash',
      'las la-quote-left',
      'las la-quote-right',
      'las la-video',
      'las la-video-slash',
    ]
    },
    { label: 'Code', icons: [
      'las la-archive',
      'las la-code',
      'las la-microchip',
      'las la-barcode',
      'las la-code-branch',
      'las la-project-diagram',
      'las la-qrcode',
      'las la-terminal',
      'las la-bug',
      'las la-laptop-code',
    ]
    }
  ]
}
</script>

<style lang="scss">
.option-column {
  border-left: 1px solid white;
  padding-left: 1em;

  .preview {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 1em;
  }
}
.q-icon {
  font-size: 3em;
  margin: 0.3rem;
}

.selected {
  color: $accent;
}
</style>
