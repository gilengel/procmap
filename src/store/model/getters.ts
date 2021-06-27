import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ModelStateInterface, IModel } from './state';

const getters: GetterTree<ModelStateInterface, StateInterface> = {
  models(state) {
    return state._models;
  },

  model(state, uuid: string) {
    const element = state._models.find(
      (element: IModel) => element.uuid === uuid
    );

    if (element === undefined) {
      return undefined;
    }

    return element.model;
  },
};

export default getters;
