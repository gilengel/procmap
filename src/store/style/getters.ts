import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { StyleStateInterface } from './state';

const getters: GetterTree<StyleStateInterface, StateInterface> = {
    currentStyle(state) {
        return state._style
    }
};

export default getters;
