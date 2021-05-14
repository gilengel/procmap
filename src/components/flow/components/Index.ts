
import InputComponent from './Input'
import OutputComponent from './Output'
import CreateObjectComponent from './CreateObject'
import SplitObjectComponent from './SplitObject'
import TextComponent from './Text'

import { Component } from 'rete'

export interface MetaFlowCategory {
  readonly label: string;
  readonly icon: string;

  readonly components: Array<MetaFlowComponent>
}

export interface MetaFlowComponent {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly component: Component,
  readonly defaultData?: Record<string, unknown>
}

const basicCategory: MetaFlowCategory = {
  label: 'Basic',
  icon: '',

  components: [
    {
      id: 'input',
      label: 'Input',
      icon: 'las la-download',
      component: InputComponent,
    },

    {
      id: 'output',
      label: 'Output',
      icon: 'las la-upload',
      component: OutputComponent,
    },

    {
      id: 'split',
      label: 'Split',
      icon: 'las la-sitemap',
      component: SplitObjectComponent,
    },

    {
      id: 'create',
      label: 'Create',
      icon: 'las la-sitemap',
      component: CreateObjectComponent,
    },

    {
      id: 'text',
      label: 'Text',
      icon: 'las la-sms',
      component: TextComponent,
    },
  ]
}

// Unfortunatly vue does not support Maps for v-for which is necessary to display the registered components.
// Therefore we use an Array, see https://github.com/vuejs/vue/issues/6644
export function getRegisteredComponentCategories (): Array<MetaFlowCategory> {
  return [basicCategory]
}

export function findRegisteredComponentById (id: string): MetaFlowComponent | undefined {
  for (const category of getRegisteredComponentCategories()) {
    const component = category.components.find(component => component.id === id)

    if (component) {
      return component
    }
  }

  return undefined
}
