import { Component } from 'rete'
import Table from './Table'
import Image from './Image'

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
            id: 'table',
            label: 'Table',
            icon: 'las la-map-marked',
            component: Table,
            defaultData: {}
        },
        {
            id: 'image',
            label: 'Image',
            icon: 'las la-map-marked',
            component: Image,
            defaultData: {}
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
