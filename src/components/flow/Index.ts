
import MapComponent from './Map'
import Random from './Random'
import Voronoi from './Voronoi'
import SelectRandom from './SelectRantom'
import FunctionComponent from './Function'

import { Component } from 'rete'
import Filter from './Filter'
import Mountains from './Mountains'
import Add from './arithmethic/Add'
import Subtract from './arithmethic/Subtract'
import Multiply from './arithmethic/Multiply'
import Divide from './arithmethic/Divide'
import DimensionToNumbers from './conversion/DimensionToNumbers'

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

const arithmeticCategory: MetaFlowCategory = {
  label: 'Basic Math',
  icon: '',

  components: [
    {
      id: 'add',
      label: 'Addition',
      icon: 'las la-plus',
      component: Add,
      defaultData: {
        number: 0,
        number_2: 0
      }
    },
    {
      id: 'subtract',
      label: 'Subtraction',
      icon: 'las la-minus',
      component: Subtract,
      defaultData: {
        number: 0,
        number_2: 0
      }
    },
    {
      id: 'multiplication',
      label: 'Multiplication',
      icon: 'las la-times',
      component: Multiply,
      defaultData: { }
    },
    {
      id: 'division',
      label: 'Division',
      icon: 'las la-divide',
      component: Divide,
      defaultData: { }
    }
  ]
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
      id: 'random',
      label: 'Random',
      icon: 'las la-map-marked',
      component: Random,
      defaultData: {
        amount: 100
      }
    },
    {
      id: 'voronoi',
      label: 'Voronoi',
      icon: 'las la-map-marked',
      component: Voronoi,
      defaultData: {
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
}

const conversionCategory: MetaFlowCategory = {
  label: 'Conversion',
  icon: '',

  components: [
    {
      id: 'dimension2numbers',
      label: 'Split Dimension',
      icon: 'las la-cube',
      component: DimensionToNumbers,
      defaultData: {
      }
    }
  ]
}

// Unfortunatly vue does not support Maps for v-for which is necessary to display the registered components.
// Therefore we use an Array, see https://github.com/vuejs/vue/issues/6644
export function getRegisteredComponentCategories () : Array<MetaFlowCategory> {
  return [basicCategory, arithmeticCategory, conversionCategory]
}

export function findRegisteredComponentById (id : string): MetaFlowComponent | undefined {
  for (const category of getRegisteredComponentCategories()) {
    const component = category.components.find(component => component.id === id)

    if (component) {
      return component
    }
  }

  return undefined
}
