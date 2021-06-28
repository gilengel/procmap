/*
import InputComponent from './Input'
import OutputComponent from './Output'
import SplitObjectComponent from './SplitObject'
import TextComponent from './Text'
*/


/*
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
      id: 'text',
      label: 'Text',
      icon: 'las la-sms',
      component: TextComponent,
    },
  ]
}
*/

/*
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
*/
