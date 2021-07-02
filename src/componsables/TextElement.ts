import { Element } from 'src/models/Grid';
import { computed } from 'vue'
import { getValueOfAttribute, setValueOfAttribute } from 'src/components/ui_builder/BaseElement'

import { Store } from 'vuex'

export default function textElement(element : Element, store: Store<unknown>) {

    const withLabel = computed({
        get(): boolean {
          return getValueOfAttribute('withLabel', element) as boolean
        },
  
        set(value: boolean) {
            setValueOfAttribute('withLabel', value, element, store)
        }
      })

      const editable = computed({
        get(): boolean {
          return getValueOfAttribute('editable', element) as boolean
        },
  
        set(value: boolean) {
            setValueOfAttribute('editable', value, element, store)
        }
      })      
  
      const label = computed(() =>
      getValueOfAttribute('label', element) as string
      );
  
      const type = computed(() =>
      getValueOfAttribute('type', element) as string
      );   
      
    return {
        withLabel,
        label,
        type,
        editable
    }
}