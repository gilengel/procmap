
import MapComponent from './Map'
import Random from './Random'
import Voronoi from './Voronoi'
import SelectRandom from './SelectRantom'
import FunctionComponent from './Function'

import { Component } from 'rete'
import Filter from './Filter'

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
      dimension: { width: 512, height: 512 }
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
    defaultData: {
      amount: 2
    }
  },
  {
    id: 'function',
    label: 'Function',
    icon: 'las la-map-marked',
    component: FunctionComponent,
    defaultData: {

    }
  },
  {
    id: 'filter',
    label: 'Filter',
    icon: 'las la-filter',
    component: Filter,
    defaultData: {
      number: 0,
      number_2: 0
    }
  }
]

export function getRegisteredFlowComponents () : Array<MetaFlowComponent> {
  return registeredComponents
}
