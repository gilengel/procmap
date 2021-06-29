/*
import { Element, ElementAttribute } from 'src/layouts/FormModel'
import { defineComponent } from 'vue'
import { Getter, Action } from 'vuex-class'
import IModel from '../../store/Model'
import { mixins } from "vue-class-component";
import { Selectable } from '../../mixins/Selectable'
import { ElementConnection } from 'src/models/Grid';

import { mapActions, mapGetters } from 'vuex';
export default defineComponent({
    props: {
        uuid: String,
        model: Object
    },

    methods: {
        ...mapActions(['Style/setStyle']),
        ...mapActions(['Grid/updateElementAttributes', 'Grid/setConnectionValue']),
        
        getValueOfAttribute<T>(name: string): unknown {
            const element = this.model as unknown as Element;
            const attribute = element.attributes.find(attribute => attribute.name === name) as ElementAttribute;
            if(attribute === undefined) {
              return undefined;
            }
            return (attribute === undefined) ? undefined : attribute.value as T
          },

          setValueOfAttribute(name: string, value: unknown): Promise<unknown> {
              return this['Grid/updateElementAttributes']({ element: this.model, name: name, value: value })
          }        
    }
    

    /*
  @Getter('element')
  getElement!: (uuid: string) => Element
})
*/