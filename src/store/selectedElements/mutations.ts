import { MutationTree } from 'vuex';
import { ModelStateInterface } from './state';
import { SELECTED_CLASS } from './actions'

const mutation: MutationTree<ModelStateInterface> = {
  _clearSelectedElements(state) {
    for (const element of state._selectedElements) {
      const el = document.getElementById(element);
      if (el) {
        el.classList.remove(SELECTED_CLASS)
      }
    }
  },

  /**
   * Updates an existing page on backend side and in local store
   * @memberof SelectedElements
   */
  _addSelectedElementAndModel(state, params: { elementId: string, model: unknown }) {
    state._selectedElements.push(params.elementId);
    state._selectedModels.push(params.model);

    const el = document.getElementById(params.elementId);
    if (el) {
      el.classList.add(SELECTED_CLASS);
    }
  },

  /**
   * Updates an existing page on backend side and in local store
   * @params {HTMLElement, any}
   * @memberof SelectedElements
   */
  _removeSelectedElementAndModel(state, element: string) {
    const index = state._selectedElements.indexOf(element);

    if (index >= 0) {
      state._selectedElements.slice(index, 1);
      state._selectedModels.slice(index, 1);
    }
  },

  /**
   * Removes all stored elements and models
   * @params {HTMLElement, any}
   * @memberof SelectedElements
   */
  _removeAllSelectedElementsAndModels(state) {

    state._selectedElements = [] //.slice(0, this._selectedElements.length)
    state._selectedModels = []
  }
};

export default mutation;
