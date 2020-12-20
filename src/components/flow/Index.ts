import { FlowComponent } from '../FlowGraph'

import MapComponent from './Map'
import Random from './Random'
import Voronoi from './Voronoi'
import SelectRandom from './SelectRantom'

import { Component } from 'rete'

export interface MetaFlowComponent {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly component: Component,
  readonly defaultData: {}
}

// Unfortunatly vue does not support Maps for v-for which is necessary to display the registered components.
// Therefore we use an Array, see https://github.com/vuejs/vue/issues/6644
const registeredComponents: Array<MetaFlowComponent> = [
  {
    id: 'map',
    label: 'Map',
    icon: 'las la-map-marked',
    component: MapComponent,
    defaultData: {
      dimension: { width: 256, height: 256 }
    }
  },
  {
    id: 'random',
    label: 'Random',
    icon: 'las la-map-marked',
    component: Random,
    defaultData: {
      amount: 100, preview: false, progress: 1
    }
  },
  {
    id: 'voronoi',
    label: 'Voronoi',
    icon: 'las la-map-marked',
    component: Voronoi,
    defaultData: {
      iterations: 2, preview: false, progress: 1
    }
  },
  {
    id: 'select_random',
    label: 'Select Random',
    icon: 'las la-map-marked',
    component: SelectRandom,
    defaultValue: {

    }
  }
]

export function getRegisteredFlowComponents () : Array<MetaFlowComponent> {
  return registeredComponents
}
