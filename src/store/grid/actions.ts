import { StringTransform } from './../../models/String';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GridStateInterface } from './state';
import { Row, Column, Element, ElementConnection } from '../../models/Grid'


const actions: ActionTree<GridStateInterface, StateInterface> = {
  setRows(state, rows: Array<Row>) {
    this.commit('Grid/_setRows', rows);
  },

  addRow(state, row: Row) {
    return row;
  },

  deleteRow(state, rowIndex: number) {
    return rowIndex;
  },

  deleteColumn(state, params: { row: Row, columnIndex: number }) {
    this.commit('Grid/_deleteColumn', params)
  },

  splitColumn(state, params: { row: Row, columnIndex: number }) {
    this.commit('Grid/_splitColumn', params)
  },

  updateColumnWidth(state, params: { column: Column, newWidth: number }) {
    this.commit('Grid/_updateColumnWidth', params)
  },


  //@Action({ commit: '_updateElementAttributes', rawError: true })
  updateElementAttributes(state, param: { element: Element, name: string, value: unknown }) {
    this.commit('Grid/_updateElementAttributes', param)
  },

  //@Action({ commit: '_addToClassList' })
  addToClassList(state, param: { element: Element, class: string }) {
    this.commit('Grid/_addToClassList', param)
  },


  //@Action({ commit: '_removeFromClassList' })
  removeFromClassList(state, param: { element: Element, class: string }) {
    this.commit('Grid/_removeFromClassList', param)
  },

  //@Action({ commit: '_unlinkTwoElements' })
  unlinkTwoElements(state, param: { identifier: string, start: Element, end: Element }) {
    this.commit('Grid/_unlinkTwoElements', param)
  },

  //@Action({ commit: '_linkTwoElements' })
  linkTwoElements(state, param: { identifier: string, start: Element, end: Element }) {
    this.commit('Grid/_linkTwoElements', param)
  },

  //@Action({ commit: '_setConnectionValue' })
  setConnectionValue(state, param: { connection: ElementConnection, value: unknown }) {
    this.commit('Grid/_setConnectionValue', param)
  },

  //@Action({ commit: '_addConnectionTransformation' })
  addConnectionTransformation(state, param: { connection: ElementConnection, transformation: StringTransform }) {
    this.commit('Grid/_addConnectionTransformation', param)
  },

  //@Action({ commit: '_setConnectionTransformations' })
  setConnectionTransformations(state, param: { connection: ElementConnection, transformations: Array<StringTransform> }) {
    this.commit('Grid/_setConnectionTransformations', param)
  },

  //@Action({ commit: '_removeConnectionTransformation' })
  removeConnectionTransformation(state, param: { connection: ElementConnection, index: number }) {
    this.commit('Grid/_removeConnectionTransformation', param)
  },


  //@Action({ commit: '_addElementToColumn', rawError: true })
  addElementToColumn(state, param: { column: Column, element: Element }) {
    this.commit('Grid/_addElementToColumn', param)
  },

  //@Action({ commit: '_removeElementFromColumn', rawError: true })
  removeElementFromColumn(state, column: Column) {
    this.commit('Grid/_removeElementFromColumn', column)
  }
};

export default actions;
