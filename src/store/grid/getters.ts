import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { GridStateInterface } from './state';
import { Grid, ElementConnection } from 'src/models/Grid'

const getters: GetterTree<GridStateInterface, StateInterface> = {
  grid(state): Grid {
    return state._grid;
  },

  connections(state): ElementConnection[] {
    return state._connections;
  }

};

export default getters;
