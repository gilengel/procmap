
import { Element } from 'src/models/Grid';
import { defineComponent, PropType } from 'vue'
import { Store } from 'vuex'

import { v4 as uuidv4 } from 'uuid'
import { mapActions } from 'vuex';

export function getValueOfAttribute(name: string, model: Element) : undefined | unknown {
  const attribute = model.attributes.find(attribute => attribute.name === name);

  if(attribute === undefined) {
    return undefined;
  }

  return (attribute === undefined) ? undefined : attribute.value
}

export function setValueOfAttribute (name: string, value: unknown, model: Element, store: Store<unknown>) {
  void store.dispatch('Grid/updateElementAttribute', { element: model, name: name, value: value })
}


export default defineComponent({
  props: {
    model: {
      required: true,
      type: Object as PropType<Element>
    }
  },

  methods: {
    ...mapActions(['SelectedElements/removeAllSelectedElementsAndModels', 'SelectedElements/addSelectedElementAndModel']),

    registerListeners() {
      (this.$el as HTMLElement).addEventListener('click', (e) => this.clickEvent(e))
      document.body.addEventListener('click', () => this.bodyClickEvent());
    },

    unregisterListeners() {
      (this.$el as HTMLElement).removeEventListener('click', (e) => this.clickEvent(e))
      document.body.addEventListener('click', () => this.bodyClickEvent());
    },

    clickEvent(event: MouseEvent) {
      event.stopPropagation()

      void this['SelectedElements/addSelectedElementAndModel']({ element: (this.$el as HTMLElement).id, model: this.model, clearPreviousSelected: !event.ctrlKey })
    },

    bodyClickEvent() {
      //console.log(event)
    }
  },

  mounted() {
    this.registerListeners();

    (this.$el as HTMLElement).id = uuidv4();
  },

  beforeUnmount() {
    this.unregisterListeners();
  }






});
