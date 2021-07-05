import { MutationTree } from 'vuex'
import { reactive } from 'vue'
import { GridStateInterface } from './state'
import { Row, Column, Element, ElementConnection } from '../../models/Grid'
import { v4 as uuidv4 } from 'uuid';
import { StringTransform } from 'src/models/String'

const mutation: MutationTree<GridStateInterface> = {
  _setRows(state, rows: Array<Row>) {
    state._grid?.rows.splice(0)

    for(const row of rows) {
      state._grid?.rows.push(row)
    }

    console.log(state._grid?.rows)

  },

  _addRow(state, row: Row) {
    state._grid?.rows.push(row)
  },

  _deleteRow(state, rowIndex: number) {
    state._grid?.rows.splice(rowIndex, 1)
  },

  _splitColumn(state, param: { row: Row, columnIndex: number }) {
    const colSize = param.row.columns[param.columnIndex].width / 2;

    const leftSize = Math.floor(colSize);
    const rightSize = Math.ceil(colSize);

    param.row.columns[param.columnIndex].width = leftSize;

    param.row.columns.splice(param.columnIndex, 0, {
      width: rightSize,
      element: null,
    });
  },

  _deleteColumn(state, param: { row: Row, columnIndex: number }) {
    const colSize = param.row.columns[param.columnIndex].width;

    const isLastColumn = param.columnIndex == param.row.columns.length - 1;

    param.row.columns.splice(param.columnIndex, 1);
    param.row.columns[
      isLastColumn ? param.columnIndex - 1 : param.columnIndex
    ].width += colSize;
  },

  _updateColumnWidth(state, param: { column: Column, newWidth: number }) {
    param.column.width = param.newWidth
  },

  _updateElementAttributes(state, param: { element: Element, name: string, value: unknown }) {
    const attribute = param.element.attributes.find(attribute => attribute.name === param.name);

    if (attribute) {
      attribute.value = param.value;
    }
  },

  _addToClassList(state, param: { element: Element, class: string }) {
    param.element.classList.push(param.class);
  },

  _removeFromClassList(state, param: { element: Element, class: string }) {
    const index = param.element.classList.findIndex((e: string) => e === param.class)


    if (index !== -1) {
      param.element.classList.splice(index, 1)
    }
  },

  _unlinkTwoElements(state, param: { identifier: string, start: Element, end: Element }) {
    if(!param.start.outputs || !param.end.inputs) {
      return;
    }

    const startIndex = param.start.outputs?.findIndex(pin => pin.identifier === param.identifier)
    const endIndex = param.end.inputs?.findIndex(pin => pin.identifier === param.identifier)

    const connection = param.start.outputs[startIndex].connection as ElementConnection;
    const connectionIndex = state._connections.findIndex(v => v.uuid === connection.uuid)
    state._connections.slice(connectionIndex, 1)

    param.start.outputs[startIndex].connection = undefined;
    param.start.outputs[endIndex].connection = undefined;
    //Vue.set(param.start.outputs[startIndex], 'connection', null)
    //Vue.set(param.end.inputs[endIndex], 'connection', null)
  },

  _linkTwoElements(state, param: { identifier: string, start: Element, end: Element }) {
    if(!param.start.outputs || !param.end.inputs) {
      return;
    }

    const connection: ElementConnection = {
      uuid: uuidv4(),
      input: param.start.uuid,
      output: param.end.uuid,
      value: '',
      transform: []
    }

    const startIndex = param.start.outputs?.findIndex(pin => pin.identifier === param.identifier)
    const endIndex = param.end.inputs?.findIndex(pin => pin.identifier === param.identifier)

    param.start.outputs[startIndex].connection = reactive(connection);
    param.start.outputs[endIndex].connection = reactive(connection);
    //Vue.set(param.start.outputs[startIndex], 'connection', connection)
    //Vue.set(param.end.inputs[endIndex], 'connection', connection)

    state._connections.push(connection)
  },

  _setConnectionValue(state, param: { connection: ElementConnection, value: unknown }) {

    const connection = state._connections.find(c => c.uuid === param.connection.uuid)
    if (!connection) {
      return
    }

    connection.value = param.value
  },

  _addConnectionTransformation(state, param: { connection: ElementConnection, transformation: StringTransform }) {
    const connection = state._connections.find(c => c.uuid === param.connection.uuid)

    if (!connection) {
      return
    }

    connection.transform.push(param.transformation)
  },

  _setConnectionTransformations(state, param: { connection: ElementConnection, transformations: Array<StringTransform> }) {
    const connection = state._connections.find(c => c.uuid === param.connection.uuid)

    if (!connection) {
      return
    }

    connection.transform = param.transformations
  },

  _removeConnectionTransformation(state, param: { connection: ElementConnection, index: number }) {
    const connection = state._connections.find(c => c.uuid === param.connection.uuid)

    if (!connection) {
      return
    }

    connection.transform.splice(param.index, 1)
  },

  _addElementToColumn(state, param: { column: Column, element: Element }) {
    param.element.column = param.column
    param.column.element = param.element
  },

  _removeElementFromColumn(state, column: Column) {
    column.element = null;
  }

};

export default mutation;
