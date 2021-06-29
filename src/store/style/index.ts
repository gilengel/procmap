import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { StyleStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const PageModule: Module<StyleStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default PageModule;
