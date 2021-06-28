import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { StyleStateInterface } from './state';
import { Style } from 'src/models/Style'

const actions: ActionTree<StyleStateInterface, StateInterface> = {
 
    setStyle (state, style: Style) {
        this.commit('Style/_setStyle', style)
    }
  
};

export default actions;
