import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ModelStateInterface } from './state';

export const SELECTED_CLASS = 'selected';

const actions: ActionTree<ModelStateInterface, StateInterface> = {
  /**
   * Updates an already stored new page in the store.
   * @params {HTMLElement, any}
   * @memberof SelectedElements
   */
   addSelectedElementAndModel(state, params: { element: string, model: unknown, clearPreviousSelected: boolean }) {
     if (params.clearPreviousSelected) {
       this.commit('_clearSelectedElements')
       this.commit('_removeAllSelectedElementsAndModels', null);
     }

     this.commit('_addSelectedElementAndModel', { elementId: params.element, model: params.model })
   },

   /**
    * Removes the selected element from the list of selected elements if it is contained within
    * @params {HTMLElement, any}
    * @memberof SelectedElements
    */
   removeSelectedElementAndModel(state, params: { elementId: string, model: unknown }) {
     const el = document.getElementById(params.elementId);
     if (el) {
       el.classList.remove(SELECTED_CLASS)
     }

     this.commit('_removeSelectedElementAndModel', params)
   },

   /**
   * Removes all selected elements saved in the store
   * @memberof SelectedElements
   */
   removeAllSelectedElementsAndModels() {
     this.commit('_clearSelectedElements')
     this.commit('_removeAllSelectedElementsAndModels', null);
   }
};

export default actions;
