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
  readonly component: Component
}

// Unfortunatly vue does not support Maps for v-for which is necessary to display the registered components.
// Therefore we use an Array, see https://github.com/vuejs/vue/issues/6644
const registeredComponents: Array<MetaFlowComponent> = [
  { id: 'map', label: 'Map', icon: 'las la-map-marked', component: MapComponent },
  { id: 'random', label: 'Random', icon: 'las la-map-marked', component: Random },
  { id: 'voronoi', label: 'Voronoi', icon: 'las la-map-marked', component: Voronoi },
  { id: 'select_random', label: 'Select Random', icon: 'las la-map-marked', component: SelectRandom }
]

export function getRegisteredFlowComponents () : Array<MetaFlowComponent> {
  return registeredComponents
}
