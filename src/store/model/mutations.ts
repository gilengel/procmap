import { MutationTree } from 'vuex';
import { ModelStateInterface, IModel } from './state';


const mutation: MutationTree<ModelStateInterface> = {
  _updateModel (state, params: IModel) {
    const found = state._models.find((element: IModel) => element.uuid === params.uuid)

    if (!found) {
      state._models.push(params)

      return
    }

    found.model = Object.assign({}, found.model, params.model)
  }
};

export default mutation;
