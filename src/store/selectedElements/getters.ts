import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ModelStateInterface } from './state';

const getters: GetterTree<ModelStateInterface, StateInterface> = {
  /**
   * Returns all selected elements
   *
   * @readonly
   * @type {Array<HTMLElement>}
   * @memberof SelectedElements
   */
   selectedElements(state): Array<string> {
    return state._selectedElements;
  },

  /**
   * Returns all selected models
   *
   * @readonly
   * @type {Array<any>}
   * @memberof SelectedElements
   */
  selectedModels(state): Array<unknown> {
    return state._selectedModels;
  }
};

export default getters;
