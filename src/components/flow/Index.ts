
import MapComponent from './Map'
import Voronoi from './Voronoi'
import SelectRandom from './SelectRantom'

import { Component } from 'rete'
import Filter from './Filter'
import Mountains from './Mountains'

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
  readonly defaultData: Record<string, unknown>
}

const basicCategory: MetaFlowCategory = {
  label: 'Basic',
  icon: '',

  components: [
    {
      id: 'map',
      label: 'Map',
      icon: 'las la-map-marked',
      component: MapComponent,
      defaultData: {
        dimension: { width: 1024, height: 1024 }
      }
    },
    {
      id: 'voronoi',
      label: 'Voronoi',
      icon: 'las la-map-marked',
      component: Voronoi,
      defaultData: {
        amount: 100,
        iterations: 2
      }
    },
    {
      id: 'select_random',
      label: 'Select Random',
      icon: 'las la-map-marked',
      component: SelectRandom,
      defaultData: {
        amount: 2
      }
    },
    {
      id: 'mountain',
      label: 'Mountain',
      icon: 'las la-mountain',
      component: Mountains,
      defaultData: {

      }
    }
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
