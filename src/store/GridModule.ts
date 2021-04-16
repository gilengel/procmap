import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Grid, Row, Column, Element, ElementAttribute } from '../models/Grid'
import { v4 as uuidv4 } from "uuid";

const DefaultGrid = {
    rows: [
        {
            columns: [
                { width: 4, element: null },
                { width: 8, element: null },
            ],
        },

        {
            columns: [
                { width: 4, element: null },
                { width: 4, element: null },
                { width: 4, element: null },
            ],
        },

        {
            columns: [
                { width: 6, element: null },
                { width: 6, element: null },
            ],
        },
    ],
};

@Module
export default class GridModulue extends VuexModule {
    private _grid: Grid | null = DefaultGrid;

    get grid (): Grid | null {
        return this._grid;
    }

    @Mutation
    _addRow (row: Row) {
        this._grid?.rows.push(row)
    }

    @Mutation
    _deleteRow (rowIndex: number) {
        this._grid?.rows.splice(rowIndex, 1)
    }

    @Action({ commit: '_addRow' })
    addRow (row: Row) {
        return row;
    }

    @Action({ commit: '_deleteRow' })
    deleteRow (rowIndex: number) {
        return rowIndex;
    }

    @Action({ commit: '_deleteColumn', rawError: true })
    deleteColumn (params: { row: Row, columnIndex: number }) {
        return params
    }

    @Mutation
    _splitColumn (param: { row: Row, columnIndex: number }) {
        const colSize = param.row.columns[param.columnIndex].width / 2;

        const leftSize = Math.floor(colSize);
        const rightSize = Math.ceil(colSize);

        param.row.columns[param.columnIndex].width = leftSize;

        param.row.columns.splice(param.columnIndex, 0, {
            width: rightSize,
            element: null,
        });
    }

    @Action({ commit: '_splitColumn', rawError: true })
    splitColumn (params: { row: Row, columnIndex: number }) {
        return params
    }


    @Mutation
    _deleteColumn (param: { row: Row, columnIndex: number }) {
        const colSize = param.row.columns[param.columnIndex].width;

        const isLastColumn = param.columnIndex == param.row.columns.length - 1;

        param.row.columns.splice(param.columnIndex, 1);
        param.row.columns[
            isLastColumn ? param.columnIndex - 1 : param.columnIndex
        ].width += colSize;
    }

    @Mutation
    _updateColumnWidth (param: { column: Column, newWidth: number }) {
        param.column.width = param.newWidth
    }

    @Action({ commit: '_updateColumnWidth', rawError: true })
    updateColumnWidth (params: { column: Column, newWidth: number }) {
        return params
    }

    @Mutation
    _updateElementAttributes (param: { element: Element, name: string, value: any }) {
        const attribute = param.element.attributes.find(attribute => attribute.name === param.name);

        if (attribute) {
            attribute.value = param.value;
        }
    }

    @Action({ commit: '_updateElementAttributes', rawError: true })
    updateElementAttributes (param: { element: Element, name: string, value: any }) {
        return param
    }

    @Mutation
    _addElementToColumn (param: { column: Column, element: Element }) {
        param.column.element = param.element
    }

    @Action({ commit: '_addElementToColumn', rawError: true })
    addElementToColumn (param: { column: Column, element: Element }) {
        return param
    }

    @Mutation
    _removeElementFromColumn (column: Column) {
        column.element = null;
    }

    @Action({ commit: '_removeElementFromColumn', rawError: true })
    removeElementFromColumn (column: Column) {
        return column
    }
}
