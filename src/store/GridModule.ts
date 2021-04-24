import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Grid, Row, Column, Element, ElementAttribute, ElementConnection, Point } from '../models/Grid'
import { v4 as uuidv4 } from "uuid";
import { ElementType, ElementAttributeType } from 'src/layouts/FormModel';
import { start } from 'repl';

function text () : Element {
    const widgetAttributes = new Array<ElementAttribute>();

    widgetAttributes.push({
        name: "variable",
        type: ElementAttributeType.String,
        value: "Some_text",
    });
    widgetAttributes.push({
        name: "label",
        type: ElementAttributeType.String,
        value: "Some text",
    });
    widgetAttributes.push({
        name: "type",
        type: ElementAttributeType.String,
        value: "date",
    });
    widgetAttributes.push({
        name: "withLabel",
        type: ElementAttributeType.Boolean,
        value: true,
    });

    return  {
            uuid: uuidv4(),
            type: ElementType.Text,
        attributes: widgetAttributes,
        classList: [],
        inputs: [],
            outputs: []
    }
}

const DefaultGrid = {
    rows: [
        {
            columns: [
                { width: 4, element: text() },
                { width: 8, element: text() },
            ],
        },

        {
            columns: [
                { width: 4, element: text() },
                { width: 4, element: null },
                { width: 4, element: text() },
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

    private _connections: Array<ElementConnection> = [];

    get grid (): Grid | null {
        return this._grid;
    }

    get connections (): Array<ElementConnection> {
        console.log(this._connections)
        return this._connections;
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
    _addToClassList (param: { element: Element, class: string }) {
        param.element.classList.push(param.class);
    }

    @Action({ commit: '_addToClassList' })
    addToClassList (param: { element: Element, class: string }) {
        return param
    }

    @Mutation
    _removeFromClassList (param: { element: Element, class: string }) {
        const index = param.element.classList.findIndex((e: string) => e === param.class)

        
        if (index !== -1) {
            param.element.classList.splice(index, 1)
        }
    }

    @Action({ commit: '_removeFromClassList' })
    removeFromClassList (param: { element: Element, class: string }) {
        return param
    }

    @Mutation
    _linkTwoElements (param: { start: Element, startPosition: Point, end: Element, endPosition: Point }) {
        const connection: ElementConnection = {
            uuid: uuidv4(),
            input: param.start.uuid,
            output: param.end.uuid,
            start: param.startPosition,
            end: param.endPosition
        }

        const startIndex = param.start.outputs?.findIndex((c: ElementConnection) => c.input === param.start.uuid)
        const endIndex = param.end.inputs?.findIndex((c: ElementConnection) => c.output === param.end.uuid)

        if (startIndex !== -1 && endIndex !== -1) {
            return
        }

        param.start.outputs?.push(connection);
        param.end.inputs?.push(connection);

        this._connections.push(connection)
    }

    @Action({ commit: '_linkTwoElements'})
    linkTwoElements (param: { start: Element, startPosition: Point, end: Element, endPosition: Point }) {
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
