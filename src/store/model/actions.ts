import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ModelStateInterface, IModel } from './state';

const actions: ActionTree<ModelStateInterface, StateInterface> = {
  updateModel (state, params: IModel) {
    this.commit('_updateModel', params)
  }
};

export default actions;
